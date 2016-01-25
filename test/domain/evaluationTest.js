var should = require('should');
var dCard = require('../../lib/domain/card');
var dCardStack = require('../../lib/domain/cardStack');
var general = require('../../lib/domain/evaluation/general');

describe('GeneralCardStackEvaluation test', function () {
    var generalEvaluation;
    before(function () {
        generalEvaluation = general.createEvaluation();
    });
    context('test is pass #isPass(cardStack)', function () {
        it('should true if card stack is 6 pair', function () {
            var cards = [];
            var cardData = {};
            cardData.cardValue = 2;
            cardData.cardSuit = "spade";
            cards.push(dCard.createCard(cardData));
            cardData.cardSuit = "club";
            cards.push(dCard.createCard(cardData));
            cardData.cardValue = 3;
            cardData.cardSuit = "spade";
            cards.push(dCard.createCard(cardData));
            cardData.cardSuit = "club";
            cards.push(dCard.createCard(cardData));
            cardData.cardValue = 4;
            cardData.cardSuit = "spade";
            cards.push(dCard.createCard(cardData));
            cardData.cardSuit = "club";
            cards.push(dCard.createCard(cardData));
            cardData.cardValue = 5;
            cardData.cardSuit = "spade";
            cards.push(dCard.createCard(cardData));
            cardData.cardSuit = "club";
            cards.push(dCard.createCard(cardData));
            cardData.cardValue = 6;
            cardData.cardSuit = "spade";
            cards.push(dCard.createCard(cardData));
            cardData.cardSuit = "club";
            cards.push(dCard.createCard(cardData));
            cardData.cardValue = 7;
            cardData.cardSuit = "spade";
            cards.push(dCard.createCard(cardData));
            cardData.cardSuit = "club";
            cards.push(dCard.createCard(cardData));
            cardData.cardValue = 10;
            cardData.cardSuit = "club";
            cards.push(dCard.createCard(cardData));
            var cardStack = dCardStack.createCardStack(cards);
            var result = generalEvaluation.isPass(cardStack);
            result.should.be.eql(true);
        });
    });
});