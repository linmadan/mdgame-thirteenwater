var should = require('should');
var thirteenWater = require('../../lib/application/thirteenWater');
var appError = require('../../lib/application/appError');

describe('AThirteenWater use case test', function () {
    var aThirteenWater;
    before(function () {
        aThirteenWater = thirteenWater.createAThirteenWater();
    });
    context('to init a new game #initGame(gameData,cb)', function () {
        it('should error if players is not enough for rule player amount', function (done) {
            var gameData = {};
            gameData.gameID = "game-1";
            gameData.ruleName = "general";
            gameData.players = [{playerID: "linmadan", playerName: "linmadan"}]
            aThirteenWater.initGame(gameData, function (err) {
                err.message.should.be.eql(appError.NOT_ENOUGH_PLAYERS);
                done();
            });
        });
        it('should error if is not this rule', function (done) {
            var gameData = {};
            gameData.gameID = "game-1";
            gameData.ruleName = "norule";
            gameData.players = [{playerID: "linmadan", playerName: "linmadan"},
                {playerID: "huhuzhu", playerName: "huhuzhu"},
                {playerID: "tutu", playerName: "tutu"},
                {playerID: "uerltd", playerName: "uerltd"}];
            aThirteenWater.initGame(gameData, function (err) {
                err.message.should.be.eql(appError.NOT_THIS_RULE);
                done();
            });
        });
        it('should set input game data', function (done) {
            var gameData = {};
            gameData.gameID = "game-1";
            gameData.ruleName = "general";
            gameData.players = [{playerID: "linmadan", playerName: "linmadan"},
                {playerID: "huhuzhu", playerName: "huhuzhu"},
                {playerID: "tutu", playerName: "tutu"},
                {playerID: "uerltd", playerName: "uerltd"}];
            aThirteenWater.initGame(gameData, function (err, cbData) {
                cbData.gameID.should.be.eql("game-1");
                cbData.players.should.be.eql({
                    linmadan: {name: "linmadan", isPalyAHand: false},
                    huhuzhu: {name: "huhuzhu", isPalyAHand: false},
                    tutu: {name: "tutu", isPalyAHand: false},
                    uerltd: {name: "uerltd", isPalyAHand: false}
                });
                done();
            });
        });
    });
    context('when a new game is inited, player can view his hand cards #playerViewHand(playerData,cb)', function () {
        it('should error if player is not playing this game', function (done) {
            var playerData = {};
            playerData.playerID = "noplaying";
            aThirteenWater.playerViewHand(playerData, function (err) {
                err.message.should.be.eql(appError.PLAYER_NOT_PLAYING_GAME);
                done();
            });
        });
        it('should view hand for rule', function (done) {
            var playerData = {};
            playerData.playerID = "linmadan";
            aThirteenWater.playerViewHand(playerData, function (err, cbData) {
                cbData.hand.length.should.be.eql(13);
                done();
            });
        });
    });
    context('when a player play a hand #playerPlayAHand(playerData, playAHandAction, cardIndexs)', function () {
        it('should error if player is not playing this game', function (done) {
            aThirteenWater.on(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND, function (err) {
                err.message.should.be.eql(appError.PLAYER_NOT_PLAYING_GAME);
                done();
            });
            var playerData = {};
            playerData.playerID = "noplaying";
            var playAHandAction = "normal"
            var cardIndexs = [1, 0, 2, 3, 4, 6, 5, 7, 8, 9, 10, 12, 11];
            aThirteenWater.playerPlayAHand(playerData, playAHandAction, cardIndexs);
            aThirteenWater.removeAllListeners(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND);
        });
        it('should error if play a hand action is not in game rule', function (done) {
            aThirteenWater.on(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND, function (err) {
                err.message.should.be.eql(appError.NOT_THIS_PLAY_A_HAND_ACTION);
                done();
            });
            var playerData = {};
            playerData.playerID = "linmadan";
            var playAHandAction = "noaction"
            var cardIndexs = [1, 0, 2, 3, 4, 6, 5, 7, 8, 9, 10, 12, 11];
            aThirteenWater.playerPlayAHand(playerData, playAHandAction, cardIndexs);
            aThirteenWater.removeAllListeners(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND);
        });
        it('should error if card indexs amount is not conform this game rule hand amount', function (done) {
            aThirteenWater.on(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND, function (err) {
                err.message.should.be.eql(appError.INDEXS_NOT_EQL_RULE_AMOUNT);
                done();
            });
            var playerData = {};
            playerData.playerID = "linmadan";
            var playAHandAction = "normal"
            var cardIndexs = [];
            aThirteenWater.playerPlayAHand(playerData, playAHandAction, cardIndexs);
            aThirteenWater.removeAllListeners(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND);
        });
        it('should error if card indexs is not conform this game rule ', function (done) {
            aThirteenWater.on(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND, function (err) {
                err.message.should.be.eql(appError.PLAY_A_HAND_IS_NOT_CONFORM_RULE);
                done();
            });
            var playerData = {};
            playerData.playerID = "linmadan";
            var playAHandAction = "normal"
            var cardIndexs = [1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11];
            aThirteenWater.playerPlayAHand(playerData, playAHandAction, cardIndexs);
            aThirteenWater.removeAllListeners(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND);
        });
        it('should emit "PLAYER_PLAY_A_HAND" event ', function (done) {
            aThirteenWater.on(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND, function (err, eventData) {
                eventData.playerID.should.be.eql("linmadan");
                done();
            });
            var playerData = {};
            playerData.playerID = "linmadan";
            var playAHandAction = "normal"
            var cardIndexs = [1, 0, 2, 3, 4, 6, 5, 7, 8, 9, 10, 12, 11];
            aThirteenWater.playerPlayAHand(playerData, playAHandAction, cardIndexs);
            aThirteenWater.removeAllListeners(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND);
        });
        it('should error if player have play a hand ', function (done) {
            aThirteenWater.on(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND, function (err) {
                err.message.should.be.eql(appError.PLAYER_HAVE_PLAY_A_HAND);
                done();
            });
            var playerData = {};
            playerData.playerID = "linmadan";
            var playAHandAction = "normal"
            var cardIndexs = [1, 0, 2, 3, 4, 6, 5, 7, 8, 9, 10, 12, 11];
            aThirteenWater.playerPlayAHand(playerData, playAHandAction, cardIndexs);
            aThirteenWater.removeAllListeners(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND);
        });
        it('should emit "SHOW_DOWN" event when all player play a hand ', function (done) {
            aThirteenWater.on(thirteenWater.domainEvent.SHOW_DOWN, function (err, eventData) {
                eventData.gameID.should.be.eql("game-1");
                done();
            });
            var playerData = {};
            var cardIndexs = [1, 0, 2, 3, 4, 6, 5, 7, 8, 9, 10, 12, 11];
            playerData.playerID = "huhuzhu";
            aThirteenWater.playerPlayAHand(playerData, "pass", cardIndexs);
            playerData.playerID = "tutu";
            aThirteenWater.playerPlayAHand(playerData, "thirteenwater", cardIndexs);
            playerData.playerID = "uerltd";
            aThirteenWater.playerPlayAHand(playerData, "normal", cardIndexs);
            aThirteenWater.removeAllListeners(thirteenWater.domainEvent.SHOW_DOWN);
        });
    });
    context('when a game show down, player can view show down result #playerViewsShowDownResult(playerData,cb)', function () {
        it('should error if player is not playing this game', function (done) {
            var playerData = {};
            playerData.playerID = "noplaying";
            aThirteenWater.playerViewsShowDownResult(playerData, function (err) {
                err.message.should.be.eql(appError.PLAYER_NOT_PLAYING_GAME);
                done();
            });
        });
        it('should view show down result', function (done) {
            var playerData = {};
            playerData.playerID = "linmadan";
            aThirteenWater.playerViewsShowDownResult(playerData, function (err, cbData) {
                cbData.playerID.should.be.eql("linmadan");
                cbData.results["linmadan"].playerName.should.be.eql("linmadan");
                cbData.results["linmadan"].firstCardStack.cards.length.should.be.eql(3);
                cbData.results["linmadan"].middleCardStack.cards.length.should.be.eql(5);
                cbData.results["linmadan"].endCardStack.cards.length.should.be.eql(5);
                done();
            });
        });
    });
    context('when a game show down, player can exit game #playerExitGame(playerData)', function () {
        it('should error if player is not playing this game', function (done) {
            aThirteenWater.on(thirteenWater.applicationEvent.PLAYER_EXIT_GAME, function (err) {
                err.message.should.be.eql(appError.PLAYER_NOT_PLAYING_GAME);
                done();
            });
            var playerData = {};
            playerData.playerID = "noplaying";
            aThirteenWater.playerExitGame(playerData);
            aThirteenWater.removeAllListeners(thirteenWater.applicationEvent.PLAYER_EXIT_GAME);
        });
        it('should emit "PLAYER_EXIT_GAME" application event', function (done) {
            aThirteenWater.on(thirteenWater.applicationEvent.PLAYER_EXIT_GAME, function (err, eventData) {
                eventData.playerID.should.be.eql("linmadan");
                done();
            });
            var playerData = {};
            playerData.playerID = "linmadan";
            aThirteenWater.playerExitGame(playerData);
            aThirteenWater.removeAllListeners(thirteenWater.applicationEvent.PLAYER_EXIT_GAME);
        });
        it('should error if player had exit this game', function (done) {
            aThirteenWater.on(thirteenWater.applicationEvent.PLAYER_EXIT_GAME, function (err) {
                err.message.should.be.eql(appError.PLAYER_HAVE_EXIT_GAME);
                done();
            });
            var playerData = {};
            playerData.playerID = "linmadan";
            aThirteenWater.playerExitGame(playerData);
            aThirteenWater.removeAllListeners(thirteenWater.applicationEvent.PLAYER_EXIT_GAME);
        });
        it('should emit "GAME_END" event when all player exit game ', function (done) {
            aThirteenWater.on(thirteenWater.domainEvent.GAME_END, function (err, eventData) {
                eventData.gameID.should.be.eql("game-1");
                done();
            });
            var playerData = {};
            playerData.playerID = "huhuzhu";
            aThirteenWater.playerExitGame(playerData);
            playerData.playerID = "tutu";
            aThirteenWater.playerExitGame(playerData);
            playerData.playerID = "uerltd";
            aThirteenWater.playerExitGame(playerData);
            aThirteenWater.removeAllListeners(thirteenWater.domainEvent.GAME_END);
        });
    });
    context('when a game playing, have player run away #playerRunAway(playerData)', function () {
        before(function () {
            aThirteenWater = thirteenWater.createAThirteenWater();
            var gameData = {};
            gameData.gameID = "game-2";
            gameData.ruleName = "general";
            gameData.players = [{playerID: "linmadan", playerName: "linmadan"},
                {playerID: "huhuzhu", playerName: "huhuzhu"},
                {playerID: "tutu", playerName: "tutu"},
                {playerID: "uerltd", playerName: "uerltd"}];
            aThirteenWater.initGame(gameData, function (err, cbData) {
            });
        });
        it('should error if player is not playing this game', function (done) {
            aThirteenWater.on(thirteenWater.applicationEvent.PLAYER_RUN_AWAY, function (err) {
                err.message.should.be.eql(appError.PLAYER_NOT_PLAYING_GAME);
                done();
            });
            var playerData = {};
            playerData.playerID = "noplaying";
            aThirteenWater.playerRunAway(playerData);
            aThirteenWater.removeAllListeners(thirteenWater.applicationEvent.PLAYER_RUN_AWAY);
        });
        it('should emit "PLAYER_PLAY_A_HAND" event and "PLAYER_RUN_AWAY" application event if player is not play a hand', function (done) {
            var currentEmitCount = 0;
            var emitDone = function () {
                currentEmitCount++;
                if (currentEmitCount == 2) {
                    done();
                }
            };
            aThirteenWater.on(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND, function (err, eventData) {
                eventData.playerID.should.be.eql("linmadan");
                emitDone();
            });
            aThirteenWater.on(thirteenWater.applicationEvent.PLAYER_RUN_AWAY, function (err, eventData) {
                eventData.playerID.should.be.eql("linmadan");
                emitDone();
            });
            var playerData = {};
            playerData.playerID = "linmadan";
            playerData.playerName = "linmadan";
            aThirteenWater.playerRunAway(playerData);
            aThirteenWater.__runAwayPlayers__[playerData.playerID].should.be.eql("linmadan");
            aThirteenWater.removeAllListeners(thirteenWater.domainEvent.PLAYER_PLAY_A_HAND);
            aThirteenWater.removeAllListeners(thirteenWater.applicationEvent.PLAYER_RUN_AWAY);
        });
        it('should emit "PLAYER_EXIT_GAME" application event if game is show down', function (done) {
            aThirteenWater.on(thirteenWater.applicationEvent.PLAYER_EXIT_GAME, function (err, eventData) {
                eventData.playerID.should.be.eql("linmadan");
                aThirteenWater.__playersIsExitGame__["linmadan"].should.be.eql(true);
                done();
            });
            var playerData = {};
            var cardIndexs = [1, 0, 2, 3, 4, 6, 5, 7, 8, 9, 10, 12, 11];
            playerData.playerID = "huhuzhu";
            aThirteenWater.playerPlayAHand(playerData, "pass", cardIndexs);
            playerData.playerID = "tutu";
            aThirteenWater.playerPlayAHand(playerData, "pass", cardIndexs);
            playerData.playerID = "uerltd";
            aThirteenWater.playerPlayAHand(playerData, "normal", cardIndexs);
            aThirteenWater.__runAwayPlayers__["linmadan"].should.be.eql("linmadan");
            aThirteenWater.removeAllListeners(thirteenWater.applicationEvent.PLAYER_EXIT_GAME);
        });
        it('should emit "PLAYER_EXIT_GAME" application event if this player is have play a hand and game is show down', function (done) {
            aThirteenWater.on(thirteenWater.applicationEvent.PLAYER_EXIT_GAME, function (err, eventData) {
                eventData.playerID.should.be.eql("tutu");
                aThirteenWater.__playersIsExitGame__["tutu"].should.be.eql(true);
                done();
            });
            var playerData = {};
            playerData.playerID = "tutu";
            aThirteenWater.playerRunAway(playerData);
            aThirteenWater.removeAllListeners(thirteenWater.applicationEvent.PLAYER_EXIT_GAME);
        });
        it('should emit "GAME_END" event when all player exit game ', function (done) {
            aThirteenWater.on(thirteenWater.domainEvent.GAME_END, function (err, eventData) {
                eventData.gameID.should.be.eql("game-2");
                done();
            });
            var playerData = {};
            playerData.playerID = "huhuzhu";
            aThirteenWater.playerExitGame(playerData);
            playerData.playerID = "uerltd";
            aThirteenWater.playerExitGame(playerData);
            aThirteenWater.removeAllListeners(thirteenWater.domainEvent.GAME_END);
        });
    });
});