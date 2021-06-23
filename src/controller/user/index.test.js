const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon')
const userService = require('../../service/user/index');
const app = require('../../../app')
const { BusinessLogicException } = require('../../libraries/exception');
const { USERS, SIGN_UP, SIGN_IN } = require('../../routes/constant/userPath');

const expect = chai.expect;
chai.use(chaiHttp);

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
  
  it('should success sign up with role admin', done => {
    sinon.stub(userService, 'signUp').returns(userPromiseResponse);
    userService.signUp(user);
     
    chai.request(app)
      .post(`${USERS}${SIGN_UP}`)
      .send(userValidRequest)
      .end((err, res, req) => {
        if(err) throw err;
        expect(res).to.have.status(200);
        expect(res).to.have.cookie('token');
        expect(res.body.message).to.equal(signUpResponse.message);
        expect(res.body.data.email).to.equal(user.email);
        done();
      })
    
  })
  
  it('should failed sign up caused by invalid password input', done => {
    sinon.stub(userService, 'signUp').returns(userRejectPromise);
    userService.signUp(user);
    
    chai.request(app)
      .post(`${USERS}${SIGN_UP}`)
      .send(userInvalidRequest)
      .end((err, res) => {
        if(err) throw err;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Your password minimum eight characters, at least one letter and one number');
        done();
      })
    
  })

  it('success login', done => {
    sinon.stub(userService, 'signIn').returns(userPromise);
    userService.signIn({email: userValidRequest.email});
    
    chai.request(app)
      .post(`${USERS}${SIGN_IN}`)
      .send(userValidRequest)
      .end((err, res) => {
        if(err) throw err;
        expect(res).to.have.status(200);
        expect(res).to.have.cookie('token');
        expect(res.body.message).to.equal('Success login');
        done();
      })
    
  })

})
