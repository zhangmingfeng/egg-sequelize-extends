const _ = require('lodash/string');

module.exports = app => {
    const models = app.model.models || {};
    for (const modelName in models) {
        app.model[_.upperFirst(modelName)] = models[modelName];
    }
};