const eggSequelize = require('egg-sequelize/app');
const constant = require('./constant');
const path = require('path');
const _ = require('lodash');
const Logger = require('egg-logger').Logger;
const FileTransport = require('egg-logger').FileTransport;
const moment = require('moment');

class CoustomLogger extends FileTransport {
    log(level, args, meta) {
        const prefixStr = this.buildFormat();
        for (let i in args) {
            if (args.hasOwnProperty(i)) {
                if (parseInt(i, 10) === 0) {
                    args[i] = `${prefixStr}${args[i]}`;
                }
                if (parseInt(i, 10) === args.length - 1) {
                    args[i] += '\n';
                }
            }
        }
        super.log(level, args, meta);
    }

    buildFormat() {
        const timeStr = `[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}]`;
        const threadNameStr = `[${process.pid}]`;
        return `${timeStr}${threadNameStr}`;
    }
}

module.exports = app => {
    let loggerConfig = app.config.sequelize.logger;
    if (!loggerConfig.dir) {
        loggerConfig.dir = app.config.logger.dir || path.join(app.baseDir, 'logs');
    }
    if (!loggerConfig.level) {
        loggerConfig.level = app.config.logger.level || 'DEBUG';
    }
    if (!loggerConfig.file) {
        loggerConfig.file = path.join(loggerConfig.dir, 'sequelize-sql.log');
    }
    const logger = new Logger();
    logger.set('file', new CoustomLogger(Object.assign({}, app.config.logger, loggerConfig)));
    app.config.sequelize.logging = function (...args) {
        const used = typeof args[1] === 'number' ? `(${args[1]}ms)` : '';
        logger.debug('[egg-sequelize-extends]%s %s', used, args[0]);
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
