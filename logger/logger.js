
const winston = require("winston");
const userLogger = winston.createLogger({
   level: "info",
   format: winston.format.json(),
   defaultMeta: {
       service: "user-service"
   },
   transports: [
    new winston.transports.Console()
   ]
});
const AdminLogger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: {
        service: "admin-service"
    },
    transports: [
     new winston.transports.Console()
    ]
 });
// If we're not in production then log to the `console`
// if (process.env.NODE_ENV !== 'production') {
//    logger.add(new winston.transports.Console({
//        format: winston.format.simple()
//    }));
// }
module.exports = {
    userLogger: userLogger,
    AdminLogger: AdminLogger
};                                                                                                                                     