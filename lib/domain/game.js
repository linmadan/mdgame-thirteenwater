var _ = require('underscore');
var deck = require('./deck');
var player = require('./player');

function Game(gameData) {
    this.gameID = gameData.gameID;
    this.rule = gameData.rule;
    this.cardStackEvaluation = gameData.cardStackEvaluation;
    var deckData = {
        cardSuits: this.rule.cardSuits,
        cardNameValues: this.rule.cardNameValues,
        jokers: this.rule.jokers
    };
    this.deck = deck.createDeck(deckData);
    this.players = {};
    for (var i = 0; i < this.rule.playerAmount; i++) {
        var playerData = gameData.players[i];
        this.players[playerData.playerID] = player.createPlayer(playerData);
    }
    this.deck.shuffle();
    var sequence = _.range(0, this.rule.playerAmount);
    var first = _.random(1, this.rule.playerAmount);
    var residueSequence = sequence.splice(first - 1);
    var takeCardSequence = residueSequence.concat(sequence);
    for (var i = 0; i < this.rule.handAmount; i++) {
        _.each(takeCardSequence, function (sequence) {
            var card = this.deck.dealOneCard();
            var playerID = _.keys(this.players)[sequence];
            this.players[playerID].takeOneCard(card);
        }, this);
    }
    this.isAllPlayerPalyAHand = false;
    this.isShowDown = false;
};

Game.prototype.playerPlayAHand = function (player, playAHandAction, cardIndexs) {
    var cardStackEvaluation = this.cardStackEvaluation;
    switch (playAHandAction) {
        case this.rule.playAHandAction.THIRTEENWATER:
            player.playAHandOfThirteenWater(cardIndexs);
            if (cardStackEvaluation.isThirteenWater(player.thirteenWaterCardStack)) {
                cardStackEvaluation.justThirteenWater(player.thirteenWaterCardStack);
                cardStackEvaluation.justThirteenWater(player.firstCardStack);
                cardStackEvaluation.justThirteenWater(player.middleCardStack);
                cardStackEvaluation.justThirteenWater(player.endCardStack);
            }
            else {
                player.thirteenWaterCardStack = null;
                cardStackEvaluation.justPerversionWater(player.firstCardStack);
                cardStackEvaluation.justPerversionWater(player.middleCardStack);
                cardStackEvaluation.justPerversionWater(player.endCardStack);
            }
            break;
        case this.rule.playAHandAction.PASS:
            player.playAHandOfPass(cardIndexs);
            if (cardStackEvaluation.isPass(player.passCardStack)) {
                cardStackEvaluation.justPass(player.passCardStack);
                cardStackEvaluation.justPass(player.firstCardStack);
                cardStackEvaluation.justPass(player.middleCardStack);
                cardStackEvaluation.justPass(player.endCardStack);
            }
            else {
                player.passCardStack = null;
                cardStackEvaluation.justPerversionWater(player.firstCardStack);
                cardStackEvaluation.justPerversionWater(player.middleCardStack);
                cardStackEvaluation.justPerversionWater(player.endCardStack);
            }
            break;
        case this.rule.playAHandAction.GIVEUP:
            player.playAHandOfNormal(cardIndexs);
            cardStackEvaluation.justPerversionWater(player.firstCardStack);
            cardStackEvaluation.justPerversionWater(player.middleCardStack);
            cardStackEvaluation.justPerversionWater(player.endCardStack);
            break;
        default :
            player.playAHandOfNormal(cardIndexs);
            if (cardStackEvaluation.isThreeOfAKind(player.firstCardStack)) {
                cardStackEvaluation.justThreeOfAKind(player.firstCardStack);
            }
            else if (cardStackEvaluation.isOnePair(player.firstCardStack)) {
                cardStackEvaluation.justOnePair(player.firstCardStack);
            }
            else {
                cardStackEvaluation.justHighCard(player.firstCardStack);
            }
            if (cardStackEvaluation.isStraightFlush(player.middleCardStack)) {
                cardStackEvaluation.justStraightFlush(player.middleCardStack);
            }
            else if (cardStackEvaluation.isFourOfAKind(player.middleCardStack)) {
                cardStackEvaluation.justFourOfAKind(player.middleCardStack);
            }
            else if (cardStackEvaluation.isFullHouse(player.middleCardStack)) {
                cardStackEvaluation.justFullHouse(player.middleCardStack);
            }
            else if (cardStackEvaluation.isFullHouse(player.middleCardStack)) {
                cardStackEvaluation.justFullHouse(player.middleCardStack);
            }
            else if (cardStackEvaluation.isFlush(player.middleCardStack)) {
                cardStackEvaluation.justFlush(player.middleCardStack);
            }
            else if (cardStackEvaluation.isStraight(player.middleCardStack)) {
                cardStackEvaluation.justStraight(player.middleCardStack);
            }
            else if (cardStackEvaluation.isThreeOfAKind(player.middleCardStack)) {
                cardStackEvaluation.justThreeOfAKind(player.middleCardStack);
            }
            else if (cardStackEvaluation.isTwoPair(player.middleCardStack)) {
                cardStackEvaluation.justTwoPair(player.middleCardStack);
            }
            else if (cardStackEvaluation.isOnePair(player.middleCardStack)) {
                cardStackEvaluation.justOnePair(player.middleCardStack);
            }
            else {
                cardStackEvaluation.justHighCard(player.middleCardStack);
            }
            if (cardStackEvaluation.isStraightFlush(player.endCardStack)) {
                cardStackEvaluation.justStraightFlush(player.endCardStack);
            }
            else if (cardStackEvaluation.isFourOfAKind(player.endCardStack)) {
                cardStackEvaluation.justFourOfAKind(player.endCardStack);
            }
            else if (cardStackEvaluation.isFullHouse(player.endCardStack)) {
                cardStackEvaluation.justFullHouse(player.endCardStack);
            }
            else if (cardStackEvaluation.isFullHouse(player.endCardStack)) {
                cardStackEvaluation.justFullHouse(player.endCardStack);
            }
            else if (cardStackEvaluation.isFlush(player.endCardStack)) {
                cardStackEvaluation.justFlush(player.endCardStack);
            }
            else if (cardStackEvaluation.isStraight(player.endCardStack)) {
                cardStackEvaluation.justStraight(player.endCardStack);
            }
            else if (cardStackEvaluation.isThreeOfAKind(player.endCardStack)) {
                cardStackEvaluation.justThreeOfAKind(player.endCardStack);
            }
            else if (cardStackEvaluation.isTwoPair(player.endCardStack)) {
                cardStackEvaluation.justTwoPair(player.endCardStack);
            }
            else if (cardStackEvaluation.isOnePair(player.endCardStack)) {
                cardStackEvaluation.justOnePair(player.endCardStack);
            }
            else {
                cardStackEvaluation.justHighCard(player.endCardStack);
            }
            if (_.isNull(player.thirteenWaterCardStack) && _.isNull(player.passCardStack)) {
                if (player.firstCardStack.compareTo(player.middleCardStack) == 1 ||
                    player.firstCardStack.compareTo(player.endCardStack) == 1 ||
                    player.middleCardStack.compareTo(player.endCardStack) == 1) {
                    player.firstCardStack.compareValues = [];
                    player.middleCardStack.compareValues = [];
                    player.endCardStack.compareValues = [];
                    cardStackEvaluation.justPerversionWater(player.firstCardStack);
                    cardStackEvaluation.justPerversionWater(player.middleCardStack);
                    cardStackEvaluation.justPerversionWater(player.endCardStack);
                }
            }
    }
    this.isAllPlayerPalyAHand = true;
    _.each(_.keys(this.players), function (key) {
        if (!this.players[key].isPalyAHand) {
            this.isAllPlayerPalyAHand = false;
            return;
        }
    }, this);
};

Game.prototype.showDown = function () {
    var playerAmount = _.keys(this.players).length;
    _.each(_.keys(this.players), function (playerID) {
        if (this.players[playerID].thirteenWaterCardStack) {
            this.players[playerID].point += 26 * (playerAmount - 1);
            _.each(_.keys(this.players), function (key) {
                if (playerID != key) {
                    this.players[key].point -= 26;
                }
            }, this);
        }
        if (this.players[playerID].passCardStack) {
            var deductionPointPlayerCount = 0;
            _.each(_.keys(this.players), function (key) {
                if (_.isNull(this.players[key].thirteenWaterCardStack)) {
                    deductionPointPlayerCount++;
                }
            }, this);
            this.players[playerID].point += 3 * (deductionPointPlayerCount - 1);
            _.each(_.keys(this.players), function (key) {
                if (playerID != key) {
                    if (_.isNull(this.players[key].thirteenWaterCardStack)) {
                        this.players[key].point -= 3;
                    }
                }
            }, this);
        }
        _.each(_.keys(this.players), function (key) {
            if (playerID != key) {
                if (_.isNull(this.players[playerID].thirteenWaterCardStack) && _.isNull(this.players[key].thirteenWaterCardStack)
                    && _.isNull(this.players[playerID].passCardStack) && _.isNull(this.players[key].passCardStack)) {
                    var point = 0;
                    if (this.players[playerID].firstCardStack.compareTo(this.players[key].firstCardStack) == 1) {
                        point = __calculateBiggerCardStackPoint__("first", this.players[playerID].firstCardStack.cardStackType);
                        this.players[playerID].point += point;
                        this.players[key].point -= point;
                        this.players[playerID].winCount++;
                    }
                    if (this.players[playerID].middleCardStack.compareTo(this.players[key].middleCardStack) == 1) {
                        point = __calculateBiggerCardStackPoint__("middle", this.players[playerID].middleCardStack.cardStackType);
                        this.players[playerID].point += point;
                        this.players[key].point -= point;
                        this.players[playerID].winCount++;
                    }
                    if (this.players[playerID].endCardStack.compareTo(this.players[key].endCardStack) == 1) {
                        point = __calculateBiggerCardStackPoint__("end", this.players[playerID].endCardStack.cardStackType);
                        this.players[playerID].point += point;
                        this.players[key].point -= point;
                        this.players[playerID].winCount++;
                    }
                }
            }
        }, this);
        if (this.players[playerID].winCount == (3 * (playerAmount - 1))) {
            this.players[playerID].point *= 2;
            _.each(_.keys(this.players), function (key) {
                if (playerID != key) {
                    this.players[key].point -= (this.players[playerID].point / 2) / (playerAmount - 1);
                }
            }, this);
        }
    }, this);
    this.isShowDown = true;
};

var __calculateBiggerCardStackPoint__ = function (cardStackLocation, cardStackType) {
    if (cardStackLocation == "first") {
        if (cardStackType == "three of a kind") {
            return 3;
        }
    }
    if (cardStackLocation == "middle") {
        if (cardStackType == "straight flush") {
            return 10;
        }
        if (cardStackType == "four of a kind") {
            return 8;
        }
        if (cardStackType == "full house") {
            return 2;
        }
    }
    if (cardStackLocation == "end") {
        if (cardStackType == "straight flush") {
            return 5;
        }
        if (cardStackType == "four of a kind") {
            return 4;
        }
    }
    return 1;
};

module.exports.createGame = function (gameData) {
    return new Game(gameData);
};
