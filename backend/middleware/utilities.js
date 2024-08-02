const jwt = require("jsonwebtoken");
require("dotenv").config();
const  logger  = require('../pino_logger');

const authenticate =(req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    logger.info(` unauthorized access `);
    return res.status(401).json({ error: true, message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    logger.info(` Token verified `);
    next();
  } catch (error) {
    logger.error(error," Invalid Token ");
    res.status(400).json({ error: true, message: "Invalid Token" });
  }
}

module.exports=authenticate;

