const isEmailValid = email => {
  const regex = /^\w+.*@\w+(\.\w{2,3})$/;
  return regex.test(email);
}

const isPasswordValid = password => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return regex.test(password);
}

module.exports = { isEmailValid, isPasswordValid };