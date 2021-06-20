const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  const decode = jwt.decode(token)
  
  if(decode.role === 'admin') {
    next();
  } else {
    res.status(401).json({
      message: `You don't have access to this action!`
    });
  }
}