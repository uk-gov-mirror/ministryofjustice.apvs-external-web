const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/first-time/eligibility/claim/about-child', function () {
  const REFERENCE = 'APVS123'
  const CLAIM_ID = '123'
  const ROUTE = `/first-time/eligibility/${REFERENCE}/claim/${CLAIM_ID}/child`

  var app

  var urlPathValidatorStub
  var aboutChildStub
  var insertChildStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    aboutChildStub = sinon.stub()
    insertChildStub = sinon.stub()

    var route = proxyquire('../../../../../../app/routes/first-time/eligibility/claim/about-child', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/domain/about-child': aboutChildStub,
      '../../../../services/data/insert-child': insertChildStub
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const ABOUT_CHILD = {}

    it('should call the URL Path Validator', function () {
      insertChildStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should insert valid FirstTimeClaim domain object', function () {
      aboutChildStub.returns(ABOUT_CHILD)
      insertChildStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(aboutChildStub)
          sinon.assert.calledOnce(insertChildStub)
          sinon.assert.calledWith(insertChildStub, CLAIM_ID, ABOUT_CHILD)
        })
        .expect(302)
    })

    it('should redirect to expenses page if add-another-child is set to no', function () {
      insertChildStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .expect('location', `/first-time/eligibility/${REFERENCE}/claim/${CLAIM_ID}`)
    })

    it('should redirect to the about-child page if add-another-child is set to yes', function () {
      insertChildStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .send({
          'add-another-child': 'yes'
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      insertChildStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      insertChildStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})