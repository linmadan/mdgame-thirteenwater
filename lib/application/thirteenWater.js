var util = require('util');
var EventEmitter = require('events');
var _ = require('underscore');
var dGame = require('../domain/game');
var RuleRepository = require('./repository/rule');
var EvaluationRepository = require('./repository/evaluation');
var appError = require('./appError');
var appUtils = require('./appUtils');

function AThirteenWater() {
    EventEmitter.call(this);
    this.__game__ = null;
    this.__playersIsExitGame__ = {};
    this.__playersExitGameTimeOut__ = {};
    this.__runAwayPlayers__ = {};
};

util.inherits(AThirteenWater, EventEmitter);

AThirteenWater.prototype.initGame = function (gameData, cb) {
    if (this.__game__) {
        cb(new Error(appError.REPEAT_INIT_GAME));
        return;
    }
    var newGameData = {};
    newGameData.gameID = gameData && gameData.gameID ? gameData.gameID : appUtils.calculateGameID();
    var ruleName = gameData && gameData.ruleName ? gameData.ruleName : "general";
    var rule = RuleRepository.getRuleForRuleName(ruleName);
    var evaluation = EvaluationRepository.getEvaluationForEvaluationName(ruleName);
    if (_.isUndefined(rule) || _.isUndefined(evaluation)) {
        cb(new Error(appError.NOT_THIS_RULE));
        return;
    }
    newGameData.rule = rule;
    newGameData.cardStackEvaluation = evaluation;
    if (!(gameData && gameData.players) || (gameData.players.length < newGameData.rule.playerAmount)) {
        cb(new Error(appError.NOT_ENOUGH_PLAYERS));
        return;
    }
    newGameData.players = gameData.players;
    this.__game__ = dGame.createGame(newGameData);
    var cbData = {};
    cbData.gameID = this.__game__.gameID;
    cbData.players = {};
    _.each(_.keys(this.__game__.players), function (key) {
        var playerData = {};
        playerData.isPalyAHand = this.__game__.players[key].isPalyAHand;
        cbData.players[key] = playerData;
    }, this);
    cb(null, cbData);
};

AThirteenWater.prototype.playerViewHand = function (playerData, cb) {
    if (_.isNull(this.__game__)) {
        cb(new Error(appError.GAME_NOT_INIT));
        return;
    }
    var player = this.__game__.players[playerData.playerID];
    if (_.isUndefined(player)) {
        cb(new Error(appError.PLAYER_NOT_PLAYING_GAME));
        return;
    }
    var cbData = {};
    cbData.playerID = player.playerID;
    cbData.hand = [];
    for (var i = 0; i < player.hand.length; i++) {
        var card = {};
        card.cardSuit = player.hand[i].cardSuit;
        card.cardName = player.hand[i].cardName;
        card.cardValue = player.hand[i].cardValue;
        card.handIndex = i;
        cbData.hand.push(card);
    }
    cb(null, cbData);
};

AThirteenWater.prototype.playerPlayAHand = function (playerData, playAHandAction, cardIndexs) {
    if (_.isNull(this.__game__)) {
        this.emit(domainEvent.PLAYER_PLAY_A_HAND, new Error(appError.GAME_NOT_INIT));
        return;
    }
    var player = this.__game__.players[playerData.playerID];
    if (_.isUndefined(player)) {
        this.emit(domainEvent.PLAYER_PLAY_A_HAND, new Error(appError.PLAYER_NOT_PLAYING_GAME));
        return;
    }
    if (player.isPalyAHand) {
        this.emit(domainEvent.PLAYER_PLAY_A_HAND, new Error(appError.PLAYER_HAVE_PLAY_A_HAND));
        return;
    }
    if (_.indexOf(_.values(this.__game__.rule.playAHandAction), playAHandAction) == -1) {
        this.emit(domainEvent.PLAYER_PLAY_A_HAND, new Error(appError.NOT_THIS_PLAY_A_HAND_ACTION));
        return;
    }
    if (cardIndexs.length != this.__game__.rule.handAmount) {
        this.emit(domainEvent.PLAYER_PLAY_A_HAND, new Error(appError.INDEXS_NOT_EQL_RULE_AMOUNT));
        return;
    }
    if (_.intersection(cardIndexs, _.range(this.__game__.rule.handAmount)).length != this.__game__.rule.handAmount) {
        this.emit(domainEvent.PLAYER_PLAY_A_HAND, new Error(appError.PLAY_A_HAND_IS_NOT_CONFORM_RULE));
        return;
    }
    this.__game__.playerPlayAHand(player, playAHandAction, cardIndexs);
    var eventData = {};
    eventData.playerID = playerData.playerID;
    this.emit(domainEvent.PLAYER_PLAY_A_HAND, null, eventData);
    if (this.__game__.isAllPlayerPalyAHand) {
        this.__game__.showDown();
        eventData = {};
        eventData.gameID = this.__game__.gameID;
        this.emit(domainEvent.SHOW_DOWN, null, eventData);
        var aThirteenWater = this;
        _.each(_.keys(this.__game__.players), function (key) {
            aThirteenWater.__playersIsExitGame__[key] = false;
            aThirteenWater.__playersExitGameTimeOut__[key] = setTimeout(function () {
                aThirteenWater.playerExitGame({playerID: key});
            }, 60000);
        });
        _.each(_.keys(this.__runAwayPlayers__), function (key) {
            aThirteenWater.playerExitGame({playerID: key});
        });
    }
};

AThirteenWater.prototype.playerViewsShowDownResult = function (playerData, cb) {
    if (_.isNull(this.__game__)) {
        cb(new Error(appError.GAME_NOT_INIT));
        return;
    }
    var player = this.__game__.players[playerData.playerID];
    if (_.isUndefined(player)) {
        cb(new Error(appError.PLAYER_NOT_PLAYING_GAME));
        return;
    }
    if (!this.__game__.isShowDown) {
        cb(new Error(appError.GAME_NOT_SHOW_DOWN));
        return;
    }
    var cbData = {};
    cbData.playerID = player.playerID;
    cbData.results = {};
    _.each(_.keys(this.__game__.players), function (key) {
        var result = {};
        result.playerID = key;
        result.point = this.__game__.players[key].point;
        if (this.__game__.players[key].thirteenWaterCardStack) {
            result.playAHandAction = this.__game__.rule.playAHandAction.THIRTEENWATER;
        }
        if (this.__game__.players[key].passCardStack) {
            result.playAHandAction = this.__game__.rule.playAHandAction.PASS;
        }
        result.firstCardStack = {};
        result.firstCardStack.type = this.__game__.players[key].firstCardStack.cardStackType;
        result.firstCardStack.cards = [];
        for (var n = 0; n < this.__game__.players[key].firstCardStack.cards.length; n++) {
            var card = {};
            card.suit = this.__game__.players[key].firstCardStack.cards[n].cardSuit;
            card.name = this.__game__.players[key].firstCardStack.cards[n].cardName;
            result.firstCardStack.cards.push(card);
        }
        result.middleCardStack = {};
        result.middleCardStack.type = this.__game__.players[key].middleCardStack.cardStackType;
        result.middleCardStack.cards = [];
        for (var n = 0; n < this.__game__.players[key].middleCardStack.cards.length; n++) {
            var card = {};
            card.suit = this.__game__.players[key].middleCardStack.cards[n].cardSuit;
            card.name = this.__game__.players[key].middleCardStack.cards[n].cardName;
            result.middleCardStack.cards.push(card);
        }
        result.endCardStack = {};
        result.endCardStack.type = this.__game__.players[key].endCardStack.cardStackType;
        result.endCardStack.cards = [];
        for (var n = 0; n < this.__game__.players[key].endCardStack.cards.length; n++) {
            var card = {};
            card.suit = this.__game__.players[key].endCardStack.cards[n].cardSuit;
            card.name = this.__game__.players[key].endCardStack.cards[n].cardName;
            result.endCardStack.cards.push(card);
        }
        cbData.results[key] = result;
    }, this);
    cb(null, cbData);
};

AThirteenWater.prototype.playerExitGame = function (playerData) {
    if (_.isNull(this.__game__)) {
        this.emit(applicationEvent.PLAYER_EXIT_GAME, new Error(appError.GAME_NOT_INIT));
        return;
    }
    if (!this.__game__.isShowDown) {
        this.emit(applicationEvent.PLAYER_EXIT_GAME, new Error(appError.GAME_NOT_SHOW_DOWN));
        return;
    }
    var player = this.__game__.players[playerData.playerID];
    if (_.isUndefined(player)) {
        this.emit(applicationEvent.PLAYER_EXIT_GAME, new Error(appError.PLAYER_NOT_PLAYING_GAME));
        return;
    }
    if (this.__playersIsExitGame__[playerData.playerID]) {
        this.emit(applicationEvent.PLAYER_EXIT_GAME, new Error(appError.PLAYER_HAVE_EXIT_GAME));
        return;
    }
    this.__playersIsExitGame__[playerData.playerID] = true;
    var timeout = this.__playersExitGameTimeOut__[playerData.playerID];
    if (timeout) {
        clearTimeout(timeout);
        delete this.__playersExitGameTimeOut__[playerData.playerID];
    }
    var appEventData = {};
    appEventData.playerID = playerData.playerID;
    this.emit(applicationEvent.PLAYER_EXIT_GAME, null, appEventData);
    var isAllPlayersExitGame = true;
    _.each(_.keys(this.__playersIsExitGame__), function (key) {
        if (!this.__playersIsExitGame__[key]) {
            isAllPlayersExitGame = false;
            return;
        }
    }, this);
    if (isAllPlayersExitGame) {
        var eventData = {};
        eventData.gameID = this.__game__.gameID;
        this.emit(domainEvent.GAME_END, null, eventData);
    }
};

AThirteenWater.prototype.playerRunAway = function (playerData) {
    if (_.isNull(this.__game__)) {
        this.emit(applicationEvent.PLAYER_RUN_AWAY, new Error(appError.GAME_NOT_INIT));
        return;
    }
    var player = this.__game__.players[playerData.playerID];
    if (_.isUndefined(player)) {
        this.emit(applicationEvent.PLAYER_RUN_AWAY, new Error(appError.PLAYER_NOT_PLAYING_GAME));
        return;
    }
    if (!player.isPalyAHand) {
        this.__runAwayPlayers__[player.playerID] = player.playerID;
        var playerData = {};
        var cardIndexs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        playerData.playerID = player.playerID;
        this.playerPlayAHand(playerData, "giveup", cardIndexs);
        var appEventData = {};
        appEventData.playerID = playerData.playerID;
        this.emit(applicationEvent.PLAYER_RUN_AWAY, null, appEventData);
    }
    else {
        if (!this.__playersIsExitGame__[playerData.playerID]) {
            this.playerExitGame({playerID: playerData.playerID});
        }
    }
};

var applicationEvent = {
    PLAYER_EXIT_GAME: "player-exit-game",
    PLAYER_RUN_AWAY: "player-run-away"
};
var domainEvent = {
    PLAYER_PLAY_A_HAND: "player-play-a-hand",
    SHOW_DOWN: "show-down",
    GAME_END: "game-end"
};

module.exports.createAThirteenWater = function () {
    return new AThirteenWater();
};

module.exports.domainEvent = domainEvent;
module.exports.applicationEvent = applicationEvent;
