const expect = require('chai').expect
const claimTypeEnum = require('../../../../app/constants/claim-type-enum')
const benefitUploadNotRequired = require('../../../../app/routes/helpers/benefit-upload-not-required')

describe('routes/helpers/benefit-upload-not-required', function () {
  it('should return true for repeat claims with no new eligibility', function () {
    expect(benefitUploadNotRequired(claimTypeEnum.REPEAT_CLAIM)).to.be.true  //eslint-disable-line
    expect(benefitUploadNotRequired(claimTypeEnum.REPEAT_DUPLICATE)).to.be.true  //eslint-disable-line
  })

  it('should return false for first-time claims and repeat with eligibility changes', function () {
    expect(benefitUploadNotRequired(claimTypeEnum.FIRST_TIME)).to.be.false  //eslint-disable-line
    expect(benefitUploadNotRequired(claimTypeEnum.REPEAT_NEW_ELIGIBILITY)).to.be.false  //eslint-disable-line
  })
})
