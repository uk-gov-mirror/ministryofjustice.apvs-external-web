const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const FieldsetValidator = require('../validators/fieldset-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')

class NewClaim {
  constructor (reference, day, month, year, childVisitor, isRepeatDuplicateClaim, isAdvanceClaim) {
    this.reference = reference
    this.dateOfJourney = dateFormatter.build(day, month, year)
    this.childVisitor = childVisitor ? childVisitor.trim() : ''
    this.isRepeatDuplicateClaim = isRepeatDuplicateClaim
    this.isAdvanceClaim = isAdvanceClaim
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.reference, 'Reference', errors)
      .isRequired()

    if (!this.isAdvanceClaim) {
      FieldsetValidator(this.dateOfJourney, 'DateOfJourney', errors)
        .isValidDate(this.dateOfJourney)
        .isPastDate(this.dateOfJourney)
        .isDateWithinDays(this.dateOfJourney, 28)
    } else {
      FieldsetValidator(this.dateOfJourney, 'DateOfJourney', errors)
        .isValidDate(this.dateOfJourney)
        .isFutureDate(this.dateOfJourney)
        .isDateWithinDays(this.dateOfJourney, 28)
        .isNotDateWithinDays(this.dateOfJourney, 5)
    }

    if (!this.isRepeatDuplicateClaim) {
      FieldValidator(this.childVisitor, 'child-visitor', errors)
        .isRequired()
        .isValidBooleanSelect()
    }

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = NewClaim
