const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.USER_SECRET, (err) => {
    if(err) {
      res.status(401).json({
        message: `You don' have permission to do this action!`
      });
    } else {
      next();
    }
  })
}