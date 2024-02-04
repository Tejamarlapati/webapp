import chai from 'chai'
import chaiHTTP from 'chai-http'
import server from '../../src/server'
import database from '../../src/config/database'
import { TEST_DB_IN_MEMORY_CONNECTION_STRING, setEnvironmentVariables } from '../utils/env-utils'
import { createOrUpdateTestUser } from '../utils/user-utils'

chai.should()
chai.use(chaiHTTP)

const INTEGRATION_USER_AUTH_HEADER = 'Basic aW50ZWdyYXRpb25AdGVzdC5jb206cGFzc3dvcmQ='
const INTEGRATION_USER_WRONGPASS_AUTH_HEADER = 'Basic aW50ZWdyYXRpb25AdGVzdC5jb206d3JvbmdwYXNzd29yZA=='
const TEST_USER_AUTH_HEADER = 'Basic dGVzdEB0ZXN0LmNvbTpwYXNzd29yZA=='
const NO_USER_AUTH_HEADER = 'Basic YXNidjphc2RqaW8='

describe('User Controller Tests - /user', function () {
  const db = database

  // Setup the database connection before all tests
  this.beforeAll(() => {
    setEnvironmentVariables(TEST_DB_IN_MEMORY_CONNECTION_STRING)
    db.reloadConnectionString()
    database.getDatabaseConnection().sync()
  })

  it('should return status 405 on /user GET', function (done) {
    chai
      .request(server)
      .get('/v1/user')
      .end(function (_, res) {
        res.should.have.status(405)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 405 on /user PUT', function (done) {
    chai
      .request(server)
      .put('/v1/user')
      .end(function (_, res) {
        res.should.have.status(405)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 405 on /user DELETE', function (done) {
    chai
      .request(server)
      .delete('/v1/user')
      .end(function (_, res) {
        res.should.have.status(405)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 405 on /user PATCH', function (done) {
    chai
      .request(server)
      .patch('/v1/user')
      .end(function (_, res) {
        res.should.have.status(405)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user POST with no body', function (done) {
    chai
      .request(server)
      .post('/v1/user')
      .send('')
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user POST with empty JSON', function (done) {
    chai
      .request(server)
      .post('/v1/user')
      .send({})
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user POST invalid JSON', function (done) {
    chai
      .request(server)
      .post('/v1/user')
      .set('Content-Type', 'application/json')
      .send('{"first_name"')
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user POST invalid data', function (done) {
    chai
      .request(server)
      .post('/v1/user')
      .set('Content-Type', 'application/json')
      .send({
        first_name: 'TJ'
      })
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user POST invalid data 1', function (done) {
    chai
      .request(server)
      .post('/v1/user')
      .set('Content-Type', 'application/json')
      .send({
        first_name: 'TJ',
        last_name: 'TJ',
        username: 'TJ',
        password: 'TJ'
      })
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user POST invalid data 2', function (done) {
    chai
      .request(server)
      .post('/v1/user')
      .set('Content-Type', 'application/json')
      .send({
        first_name: '',
        last_name: 'TJ',
        username: 'a@a.com',
        password: 'TJ'
      })
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user POST duplicate user', function (done) {
    chai
      .request(server)
      .post('/v1/user')
      .set('Content-Type', 'application/json')
      .send({
        first_name: 'TJ',
        last_name: 'TJ',
        username: 'test@test.com',
        password: 'TJ'
      })
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user POST query params', function (done) {
    chai
      .request(server)
      .post('/v1/user?query')
      .set('Content-Type', 'application/json')
      .send({
        first_name: 'TJ',
        last_name: 'TJ',
        username: 'test@test.com',
        password: 'TJ'
      })
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 201 on /user POST', function (done) {
    chai
      .request(server)
      .post('/v1/user')
      .set('Content-Type', 'application/json')
      .send({
        first_name: 'TJ',
        last_name: 'TJ',
        username: Date.now() + 'test@test.com',
        password: 'TJ'
      })
      .end(function (_, res) {
        res.should.have.status(201)
        const response = res.body
        chai.expect(response.first_name).to.eql('TJ')
        chai.expect(response.last_name).to.eql('TJ')
        chai.expect(response.username).to.contain('test@test.com')
        chai.expect(response).to.not.have.property('password')
        chai
          .expect(response)
          .to.have.all.keys(['id', 'first_name', 'last_name', 'username', 'account_updated', 'account_created'])
        done()
      })
  })

  after(() => chai.request(server).close())

  // Disconnect the database after all tests
  this.afterAll(async () => {
    await database.closeDatabaseConnection()
  })
})

describe('User Controller Tests - /self', function () {
  const db = database

  // Setup the database connection before all tests
  this.beforeAll(() => {
    setEnvironmentVariables(TEST_DB_IN_MEMORY_CONNECTION_STRING)
    db.reloadConnectionString()
    database.getDatabaseConnection().sync()
  })

  it('should return status 405 on /user/self POST', function (done) {
    chai
      .request(server)
      .post('/v1/user/self')
      .end(function (_, res) {
        res.should.have.status(405)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 405 on /user/self PATCH', function (done) {
    chai
      .request(server)
      .patch('/v1/user/self')
      .end(function (_, res) {
        res.should.have.status(405)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 405 on /user/self DELETE', function (done) {
    chai
      .request(server)
      .delete('/v1/user/self')
      .end(function (_, res) {
        res.should.have.status(405)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 401 on /user/self GET without auth', function (done) {
    chai
      .request(server)
      .get('/v1/user/self')
      .end(function (_, res) {
        res.should.have.status(401)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 401 on /user/self GET with query params', function (done) {
    chai
      .request(server)
      .get('/v1/user/self?qwuer')
      .end(function (_, res) {
        res.should.have.status(401)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 401 on /user/self PUT without auth', function (done) {
    chai
      .request(server)
      .put('/v1/user/self')
      .end(function (_, res) {
        res.should.have.status(401)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 401 on /user/self PUT with query params', function (done) {
    chai
      .request(server)
      .put('/v1/user/self?qwuer')
      .end(function (_, res) {
        res.should.have.status(401)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 200 on /user/self GET', function (done) {
    chai
      .request(server)
      .get('/v1/user/self')
      .set('AUTHORIZATION', INTEGRATION_USER_AUTH_HEADER)
      .end(function (_, res) {
        res.should.have.status(200)
        const response = res.body
        chai.expect(response.first_name).to.eql('TJ')
        chai.expect(response.last_name).to.eql('M')
        chai.expect(response.username).to.contain('integration@test.com')
        chai.expect(response).to.not.have.property('password')
        chai
          .expect(response)
          .to.have.all.keys(['id', 'first_name', 'last_name', 'username', 'account_updated', 'account_created'])
        done()
      })
  })

  it('should return status 400 on /user/self GET with query params', function (done) {
    chai
      .request(server)
      .get('/v1/user/self?qwuer')
      .set('AUTHORIZATION', INTEGRATION_USER_AUTH_HEADER)
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user/self GET with no user in db', function (done) {
    chai
      .request(server)
      .get('/v1/user/self')
      .set('AUTHORIZATION', NO_USER_AUTH_HEADER)
      .end(function (_, res) {
        res.should.have.status(401)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user/self GET with wrong pass', function (done) {
    chai
      .request(server)
      .get('/v1/user/self')
      .set('AUTHORIZATION', INTEGRATION_USER_WRONGPASS_AUTH_HEADER)
      .end(function (_, res) {
        res.should.have.status(401)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user/self PUT send username', function (done) {
    chai
      .request(server)
      .put('/v1/user/self')
      .set('AUTHORIZATION', TEST_USER_AUTH_HEADER)
      .send({
        first_name: 'PUT',
        last_name: 'PUT',
        username: 'test@test.com',
        password: 'password'
      })
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user/self PUT send empty fields 1', function (done) {
    chai
      .request(server)
      .put('/v1/user/self')
      .set('AUTHORIZATION', TEST_USER_AUTH_HEADER)
      .send({
        first_name: 'PUT',
        last_name: '',
        password: 'password'
      })
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user/self PUT send empty body', function (done) {
    chai
      .request(server)
      .put('/v1/user/self')
      .set('AUTHORIZATION', TEST_USER_AUTH_HEADER)
      .send({})
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user/self PUT send empty fields 2', function (done) {
    chai
      .request(server)
      .put('/v1/user/self')
      .set('AUTHORIZATION', TEST_USER_AUTH_HEADER)
      .send({
        first_name: '',
        last_name: 'PUT',
        password: 'password'
      })
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  it('should return status 400 on /user/self PUT send empty fields 3', function (done) {
    chai
      .request(server)
      .put('/v1/user/self')
      .set('AUTHORIZATION', TEST_USER_AUTH_HEADER)
      .send({
        first_name: 'A',
        last_name: 'B',
        password: ''
      })
      .end(function (_, res) {
        res.should.have.status(400)
        chai.expect(res.body).to.be.empty
        done()
      })
  })

  describe('User Controller Tests - /self PUT', function () {
    this.beforeEach(async () => {
      await createOrUpdateTestUser()
    })

    it('should return status 200 on /user/self PUT', function (done) {
      chai
        .request(server)
        .put('/v1/user/self')
        .set('AUTHORIZATION', TEST_USER_AUTH_HEADER)
        .send({
          first_name: 'PUT Update',
          last_name: 'PUT',
          password: 'password'
        })
        .end(function (_, res) {
          res.should.have.status(200)
          const response = res.body
          chai.expect(response.first_name).to.eql('PUT Update')
          chai.expect(response.last_name).to.eql('PUT')
          chai.expect(response.username).to.contain('test@test.com')
          chai.expect(response).to.not.have.property('password')
          chai
            .expect(response)
            .to.have.all.keys(['id', 'first_name', 'last_name', 'username', 'account_updated', 'account_created'])

          done()
        })
    })

    it('should return status 200 on /user/self PUT partial update 1', function (done) {
      chai
        .request(server)
        .put('/v1/user/self')
        .set('AUTHORIZATION', TEST_USER_AUTH_HEADER)
        .send({
          first_name: 'PUT Update Partial'
        })
        .end(function (_, res) {
          res.should.have.status(200)
          const response = res.body
          chai.expect(response.first_name).to.eql('PUT Update Partial')
          chai.expect(response.last_name).to.eql('M')
          chai.expect(response.username).to.contain('test@test.com')
          chai.expect(response).to.not.have.property('password')
          chai
            .expect(response)
            .to.have.all.keys(['id', 'first_name', 'last_name', 'username', 'account_updated', 'account_created'])

          done()
        })
    })

    it('should return status 200 on /user/self PUT partial update 2', function (done) {
      chai
        .request(server)
        .put('/v1/user/self')
        .set('AUTHORIZATION', TEST_USER_AUTH_HEADER)
        .send({
          last_name: 'PUT Update Partial last_name'
        })
        .end(function (_, res) {
          res.should.have.status(200)
          const response = res.body
          chai.expect(response.first_name).to.eql('TJ')
          chai.expect(response.last_name).to.eql('PUT Update Partial last_name')
          chai.expect(response.username).to.contain('test@test.com')
          chai.expect(response).to.not.have.property('password')
          chai
            .expect(response)
            .to.have.all.keys(['id', 'first_name', 'last_name', 'username', 'account_updated', 'account_created'])

          done()
        })
    })
  })

  after(() => chai.request(server).close())

  // Disconnect the database after all tests
  this.afterAll(async () => {
    await database.closeDatabaseConnection()
  })
})
