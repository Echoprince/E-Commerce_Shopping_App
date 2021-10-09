const winston = require('winston')
const {transports, createLogger, format } = winston
const { combine, timestamp, label, prettyPrint, json, printf } = format;

const customFormat = combine(timestamp(), json(), prettyPrint(), printf((info) => {
    return `${info.timestamp} - [${info.level.toUpperCase()}] - ${info.message}`
}))
 
const logger = createLogger({
  format: customFormat,
  
  transports: [
    new transports.Console({level: 'silly'}),
    new transports.File({ filename: 'app.log', level: 'info' }),
    ]
})
 


 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }

module.exports = logger