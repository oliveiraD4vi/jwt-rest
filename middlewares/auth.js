const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = {
  eAdmin: async function (req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(400).json({
        error: true,
        message: 'Access denied!'
      });
    }

    const [, token ]= authHeader.split(' ');

    if(!token){
      return res.status(400).json({
        error: true,
        message: 'Access denied!'
      });
    }

    try {
      const decode = await promisify(jwt.verify) (token, 'SASDERFGHNB44SASE54F1G5DFG2');
      req.userId = decode.id;
      return next();
    } catch(err) {
      return res.status(400).json({
        error: true,
        message: 'Access denied!'
      });
    }
  }
}
