/* eslint-disable no-new */
const TrainExpense = require('../../../../../app/services/domain/expenses/train-expense')
const ValidationError = require('../../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/expenses/train-expense', function () {
  const VALID_COST = '20'
  const VALID_FROM = 'some from'
  const VALID_TO = 'some to'
  const VALID_IS_RETURN = 'yes'
  const VALID_TICKET_OWNER = 'you'
  const VALID_DEPARTURE_TIME = '10am'
  const INVALID_COST = '0'

  const IS_PAST_CLAIM = false
  const IS_ADVANCE_CLAIM = true

  const INVALID_CHARS_FROM = '&lt>><somewhere<>>>>&gt'
  const INVALID_CHARS_TO = '&><>To somewhere<&gt<>'

  it('should construct a domain object given valid input', function () {
    var expense = new TrainExpense(
      VALID_COST,
      VALID_FROM,
      VALID_TO,
      VALID_IS_RETURN,
      VALID_TICKET_OWNER,
      VALID_DEPARTURE_TIME,
      IS_PAST_CLAIM
    )
    expect(expense.cost).to.equal(VALID_COST)
    expect(expense.from).to.equal(VALID_FROM)
    expect(expense.to).to.equal(VALID_TO)
    expect(expense.isReturn).to.equal(VALID_IS_RETURN)
    expect(expense.isAdvanceClaim).to.equal(IS_PAST_CLAIM)
  })

  it('should construct a domain object given valid input', function () {
    var expense = new TrainExpense(
      VALID_COST,
      VALID_FROM,
      VALID_TO,
      VALID_IS_RETURN,
      VALID_TICKET_OWNER,
      VALID_DEPARTURE_TIME,
      IS_ADVANCE_CLAIM
    )
    expect(expense.cost).to.equal(VALID_COST)
    expect(expense.from).to.equal(VALID_FROM)
    expect(expense.to).to.equal(VALID_TO)
    expect(expense.isReturn).to.equal(VALID_IS_RETURN)
    expect(expense.ticketOwner).to.equal(VALID_TICKET_OWNER)
    expect(expense.isAdvanceClaim).to.equal(IS_ADVANCE_CLAIM)
  })

  it('should strip illegal characters from otherwise valid input', function () {
    const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
    var expense = new TrainExpense(
      VALID_COST,
      INVALID_CHARS_FROM,
      INVALID_CHARS_TO,
      VALID_IS_RETURN,
      VALID_TICKET_OWNER,
      VALID_DEPARTURE_TIME,
      IS_PAST_CLAIM
    )
    expect(expense.cost).to.equal(VALID_COST)
    expect(expense.from).to.equal(INVALID_CHARS_FROM.replace(unsafeInputPattern, ''))
    expect(expense.to).to.equal(INVALID_CHARS_TO.replace(unsafeInputPattern, ''))
    expect(expense.isReturn).to.equal(VALID_IS_RETURN)
    expect(expense.ticketOwner).to.equal(VALID_TICKET_OWNER)
    expect(expense.isAdvanceClaim).to.equal(IS_PAST_CLAIM)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new TrainExpense(
        INVALID_COST,
        VALID_FROM,
        VALID_TO,
        VALID_IS_RETURN,
        VALID_TICKET_OWNER,
        IS_PAST_CLAIM
      )
    }).to.throw(ValidationError)
  })
})
