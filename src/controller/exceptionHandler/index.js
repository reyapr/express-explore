const { BusinessLogicException } = require("../../libraries/exception");

module.exports = (err, req, res, next) => {
  console.log(`[Error] message: ${err.message}`, err.stack);

  if (err.message.includes('duplicate key')) {
    res.status(400).json({
      message: 'Duplicate Data'
    })
  } else if (err instanceof BusinessLogicException) {
    res.status(err.status).json({
      message: err.message,
    });
  } else {
    res.status(400).json({
      message: 'Runtime Error'
    })
  }

}