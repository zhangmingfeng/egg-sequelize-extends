const eggSequelize = require('egg-sequelize/app');
const constant = require('./constant');
const path = require('path');
const CustomLogger = require('egg-logger').EggCustomLogger;
const _ = require('lodash');

module.exports = app => {
    let logger = app.config.sequelize.logger;
    if (!logger.dir) {
        logger.dir = app.config.logger.dir || path.join(app.baseDir, 'logs');
    }
    if (!logger.level) {
        logger.level = app.config.logger.level || 'DEBUG';
    }
    if (!logger.file) {
        logger.file = path.join(logger.dir, 'sequelize-sql.log');
    }
    const customLogger = new CustomLogger(Object.assign({}, app.config.logger, logger));
    app.config.sequelize.logging = function (...args) {
        const used = typeof args[1] === 'number' ? `(${args[1]}ms)` : '';
        if (customLogger[logger.level.toLowerCase()]) {
            customLogger[logger.level.toLowerCase()]('[egg-sequelize-extends]%s %s', used, args[0]);
        } else {
            customLogger.debug('[egg-sequelize-extends]%s %s', used, args[0]);
        }
    };
    eggSequelize(app);
    if (app.config.sequelize.dialect === constant.TYPE_MYSQL) {
        app.model.queryInterface.QueryGenerator = _.extend({}, require('../extends/mysql/query-generator'), {
            options: app.model.queryInterface.QueryGenerator.options,
            _dialect: app.model.queryInterface.QueryGenerator._dialect,
            sequelize: app.model.queryInterface.QueryGenerator.sequelize
        });
    }
};