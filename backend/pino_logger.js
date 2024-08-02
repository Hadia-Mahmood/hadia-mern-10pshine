const pino = require('pino');
const prettyPino = require('pino-pretty');


const logFile = './logs/output.log';

const logger = pino(
    {
        transport: {
            target: 'pino-pretty',
            options: {
                destination: logFile,
                mkdir: true,
                
            },
        },
    },
);

module.exports = logger;