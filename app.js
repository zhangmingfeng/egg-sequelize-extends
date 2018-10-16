'use strict';

module.exports = app => {
    require('./lib/logger')(app);
    require('./lib/models')(app);
};