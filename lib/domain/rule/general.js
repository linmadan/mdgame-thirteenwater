function GeneralRule() {
    this.ruleName = "general";
    this.playerAmount = 4;
    this.handAmount = 13;
    this.cardSuits = {spade: "spade", club: "club", diamond: "diamond", heart: "heart"};
    this.cardNameValues = {
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        J: 11,
        Q: 12,
        K: 13,
        A: 14
    };
    this.playAHandAction = {
        THIRTEENWATER: "thirteenwater",
        PASS: "pass",
        NORMAL: "normal",
        GIVEUP: "giveup"
    };
    this.jokers = [];
};

module.exports.createRule = function () {
    return new GeneralRule();
};