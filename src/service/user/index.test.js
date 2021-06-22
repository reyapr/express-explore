const chai = require('chai');
const sinon = require('sinon');
const { BusinessLogicException } = require('../../libraries/exception');
const User = require('../../models/user');
const userService = require('./index');
const bcryptjs = require('bcryptjs');

const expect = chai.expect;
const assert = sinon.assert;

describe('User Controller', () => {
  
  const userValidRequest = {
    email: 'renal.test@gmail.com',
    password: 'Renal1234556'
  }
  
  const userInvalidRequest = {
    email: 'renal.test@gmail.com',
    password: 'renal123'
  }
  
  const userResponse = {
    id: '123',
    email: 'renal.test@gmail.com',
    role: 'admin'
  }
  
  const user = {
    id: '123',
    email: 'renal.test@gmail.com',
    role: 'admin',
    password: 'Renal1234556'
  }
  
  const signUpResponse = {
    message: 'Success to Create Account!',
    data: userResponse
  }
  
  const userPromiseResponse = new Promise(res => {
    res(user)
  })
  
  const userRejectPromise = new Promise((resolve, reject) => {
    reject(new BusinessLogicException({
      status: 400,
      message: 'Your password minimum eight characters, at least one letter and one number'
    }))
  })
  
  const userPromise = new Promise(res => {
    res(user)
  })
  
  afterEach(() => {
    sinon.restore();
  })
  
 
  it('should success sign up with role admin', function(){
    sinon.stub(User, 'create').returns(userPromiseResponse);
    User.create(user);
    
    return userService.signUp(userValidRequest)
      .then(response => {
        expect(response.id).to.equal(user.id)
      })
    
  })

  it('should failed sign up caused by invalid password input', function() {
    return userService.signUp(userInvalidRequest)
      .catch(err => {
        expect(err instanceof BusinessLogicException).to.equal(true);
        expect(err.status).to.equal(400);
      })
  })
  
  it('success login', function() {
    const findOne = sinon.stub(User, 'findOne').returns(userPromise);
    User.findOne({email: userValidRequest.email});
    
    const compare = sinon.stub(bcryptjs, "compare").returns(new Promise(res => res(true)));
    bcryptjs.compare(userValidRequest.password, userValidRequest.password)
    
    const updateOne = sinon.stub(User, 'updateOne').returns(new Promise((res) => {
      res(null);
    }));
    User.updateOne({_id: user.id})
    
    assert.calledWith(findOne, {email: user.email});
    assert.calledWith(compare, user.password, user.password); 
    assert.calledWith(updateOne, {_id: user.id})
    
    return userService.signIn(userValidRequest)
      .then(response => {
        expect(response.email).to.equal(user.email);
      });
  })
  
    
  it('login password unmatch', function() {
    const findOne = sinon.stub(User, 'findOne').returns(userPromise);
    User.findOne({email: userValidRequest.email});
    
    const compare = sinon.stub(bcryptjs, "compare").returns(new Promise(res => res(false)));
    bcryptjs.compare(userValidRequest.password, userValidRequest.password)
        
    assert.calledWith(findOne, {email: user.email});
    assert.calledWith(compare, user.password, user.password); 
    
    return userService.signIn(userInvalidRequest)
      .catch(err => {
        expect(err instanceof BusinessLogicException).to.equal(true);
        expect(err.message).to.equal('Wrong Password');
      });
  })
})




