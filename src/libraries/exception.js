function BusinessLogicException({ status, message }) {
  this.status = status;
  this.message = message ;
}

module.exports = { BusinessLogicException };