const winston = require('winston');
const { combine, timestamp, printf, align } = winston.format;

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'DD-MM-YYYY hh:mm:ss A',
        }),
        align(),
        printf((info) =>{
            const stackLine = new Error().stack.split('\n')[11].trim();
            const fileInfo = stackLine.split('/').pop();
            const [file, line] = fileInfo.split(':'); 
            return `[${info.timestamp}] ${info.level.toUpperCase()} ${info.message} (${file}:${line})`    
        })    
    ),
    level: 'info',
    handleExceptions: true,
    transports: [
        new winston.transports.File({ filename: "logs/server.log" }),
    ],
});

global.logger = logger;