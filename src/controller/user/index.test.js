const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon')
const userController = require('./index');
const User = require('../../models/user');
const app = require('../../../app')
const bcryptjs = require('bcryptjs');

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
  
  const userPromise = new Promise(res => {
    res(user)
  })
  
  afterEach(() => {
    sinon.restore();
  })
  
  it('should success sign up with role admin', done => {
    sinon.stub(User, 'create').returns(userPromiseResponse);
    User.create(user);
     
    chai.request(app)
      .post('/users/signUp')
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
    chai.request(app)
      .post('/users/signUp')
      .send(userInvalidRequest)
      .end((err, res) => {
        if(err) throw err;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Your password minimum eight characters, at least one letter and one number');
        done();
      })
    
  })
  
  it('success login', done => {
    sinon.stub(User, 'findOne').returns(userPromise);
    User.findOne({email: userValidRequest.email});
    
    sinon.stub(bcryptjs, "compare").returns(new Promise(res => res(true)));
    bcryptjs.compareSync(userValidRequest.password, userValidRequest.password)
    
    sinon.stub(User, 'updateOne').returns(new Promise((res) => {
      res(null);
    }));
    User.updateOne({_id: user.id});
    
    chai.request(app)
      .post('/users/signIn')
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