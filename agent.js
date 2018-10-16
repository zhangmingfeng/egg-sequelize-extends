'use strict';

module.exports = agent => {
    require('./lib/logger')(agent);
    require('./lib/models')(agent);
};

