var generalEvaluation = require('../../domain/evaluation/general');

EvaluationRepository = {
    __evaluations__: {
        general: generalEvaluation.createEvaluation()
    },
    getEvaluationForEvaluationName: function (evaluationName) {
        return this.__evaluations__[evaluationName];
    }
};

module.exports = EvaluationRepository;