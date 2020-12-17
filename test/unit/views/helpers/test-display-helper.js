const expect = require('chai').expect
const proxyquire = require('proxyquire')
const prisonsEnum = require('../../../../app/constants/prisons-enum')
const benefitsEnum = require('../../../../app/constants/benefits-enum')
const prisonerRelationshipsEnum = require('../../../../app/constants/prisoner-relationships-enum')
const expenseTypeEnum = require('../../../../app/constants/expense-type-enum')

describe('views/helpers/display-helper', function () {
  const VALID_PRISONER_RELATIONSHIP_VALUE = prisonerRelationshipsEnum.WIFE.value
  const VALID_BENEFIT_VALUE = benefitsEnum.INCOME_SUPPORT.value
  const VALID_PRISON_VALUE = prisonsEnum.ALTCOURSE.value
  const INVALID_PRISON_VALUE = 'testing'
  const VALID_EXPENSE_VALUE = expenseTypeEnum.BUS.value

  let displayHelper

  beforeEach(function () {
    const prisonsEnumStub = {
      'non-object': 'some non object element'
    }

    displayHelper = proxyquire(
      '../../../../app/views/helpers/display-helper', {
        '../../constants/prisons-enum': prisonsEnumStub
      })
  })

  it('should return the correct prisoner relationship display name given a valid value', function () {
    const result = displayHelper.getPrisonerRelationshipDisplayName(VALID_PRISONER_RELATIONSHIP_VALUE)
    expect(result).to.equal(prisonerRelationshipsEnum.WIFE.displayName)
  })

  it('should return the correct benefit display name given a valid value', function () {
    const result = displayHelper.getBenefitDisplayName(VALID_BENEFIT_VALUE)
    expect(result).to.equal(benefitsEnum.INCOME_SUPPORT.displayName)
  })

  it('should return the correct require benefit upload value given a valid input', function () {
    const result = displayHelper.getBenefitRequireUpload(VALID_BENEFIT_VALUE)
    expect(result).to.equal(benefitsEnum.INCOME_SUPPORT.requireBenefitUpload)
  })

  it('should return the correct benefit multipage value given a valid input', function () {
    const result = displayHelper.getBenefitMultipage(VALID_BENEFIT_VALUE)
    expect(result).to.equal(benefitsEnum.INCOME_SUPPORT.multipage)
  })

  it('should return the correct prison display name given a valid value', function () {
    const result = displayHelper.getPrisonDisplayName(VALID_PRISON_VALUE)
    expect(result).to.equal(prisonsEnum.ALTCOURSE.displayName)
  })

  it('should return the value given if prison not found', function () {
    const result = displayHelper.getPrisonDisplayName(INVALID_PRISON_VALUE)
    expect(result).to.equal(INVALID_PRISON_VALUE)
  })

  it('should return the correct expense name given a valid value', function () {
    const result = displayHelper.getExpenseDisplayName(VALID_EXPENSE_VALUE)
    expect(result).to.equal(expenseTypeEnum.BUS.displayName)
  })

  it('should return the correct boolean for receipt required given a valid value', function () {
    const result = displayHelper.getExpenseReceiptRequired(VALID_EXPENSE_VALUE)
    expect(result).to.equal(expenseTypeEnum.BUS.receiptRequired)
  })

  it('should return the correct currency value given a valid integer or decimal number', function () {
    expect(displayHelper.toCurrency(50)).to.equal('£50')
    expect(displayHelper.toCurrency('21.5')).to.equal('£21.50')
    expect(displayHelper.toCurrency(-40)).to.equal('-£40')
    expect(displayHelper.toCurrency('-32.4')).to.equal('-£32.40')
  })

  describe('getPrisonsByRegion', function () {
    const VALID_REGIONS = [
      'ENG/WAL',
      'SCO',
      'NI',
      'JSY',
      'GSY'
    ]
    const INVALID_REGION = 'some invalid region'

    it('should return the list of prisons for the given region', function () {
      VALID_REGIONS.forEach(function (region) {
        const result = displayHelper.getPrisonsByRegion(region)
        expect(result).to.not.equal(undefined)
      })
    })

    it('should return undefined if an invalid region is passed as input', function () {
      const result = displayHelper.getPrisonsByRegion(INVALID_REGION)
      expect(result).to.equal(undefined)
    })
  })

  describe('zeroCostWarning', function () {
    const ADVANCE = true
    const RETRO = false
    const ZERO_COST = 0
    const COST = 2.5

    it('should give false when no warnings are needed', function () {
      expect(displayHelper.zeroCostWarning(expenseTypeEnum.CAR.value, ZERO_COST, RETRO)).to.be.false  //eslint-disable-line
      expect(displayHelper.zeroCostWarning(expenseTypeEnum.CAR.value, ZERO_COST, ADVANCE)).to.be.false  //eslint-disable-line
      expect(displayHelper.zeroCostWarning(expenseTypeEnum.TRAIN.value, ZERO_COST, ADVANCE)).to.be.false  //eslint-disable-line
      expect(displayHelper.zeroCostWarning(expenseTypeEnum.BUS.value, COST, RETRO)).to.be.false  //eslint-disable-line
    })

    it('should return true if the cost is zero or less and not one of the expections', function () {
      expect(displayHelper.zeroCostWarning(expenseTypeEnum.BUS.value, ZERO_COST, RETRO)).to.be.true  //eslint-disable-line
      expect(displayHelper.zeroCostWarning(expenseTypeEnum.TRAIN.value, ZERO_COST, RETRO)).to.be.true  //eslint-disable-line
    })
  })
})
