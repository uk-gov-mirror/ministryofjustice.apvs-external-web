const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const BusExpense = require('../../../../services/domain/expenses/bus-expense')
const insertExpense = require('../../../../services/data/insert-expense')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/bus', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/claim/bus-details', {
      reference: req.params.reference,
      claimId: req.params.claimId,
      params: expenseUrlRouter.parseParams(req.query)
    })
  })

  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/bus', function (req, res) {
    UrlPathValidator(req.params)

    var expense = new BusExpense(
      req.params.claimId,
      req.body.cost,
      req.body.from,
      req.body.to,
      req.body['return-journey']
    )

    insertExpense(expense)
      .then(function () {
        return res.redirect(expenseUrlRouter.getRedirectUrl(req))
      })
  })
}
