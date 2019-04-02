const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference) {
  return knex.raw(`SELECT * FROM [IntSchema].[checkForDisabledReference] (?)`, [ reference ])
  .then(function(results) {
    if (results) {
      return true
    } else {
      return false
    }
  })
}
