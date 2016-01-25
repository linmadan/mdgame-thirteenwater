var generalRule = require('../../domain/rule/general');

RuleRepository = {
    __rules__: {
        general: generalRule.createRule()
    },
    getRuleForRuleName: function (ruleName) {
        return this.__rules__[ruleName];
    }
};

module.exports = RuleRepository;