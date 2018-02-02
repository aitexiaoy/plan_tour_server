var log4js = require('log4js');
log4js.configure({
    appenders: {
        index: {
            type: 'file',
            filename: './log/log.log'
        },
        console: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['console','index'],
            level: 'trace'
        }
    }
});

exports.logger = function (name, level) {
    var logger = log4js.getLogger(name);
    // logger.setLevel(levels[level] || levels['debug']);
    return logger;
};