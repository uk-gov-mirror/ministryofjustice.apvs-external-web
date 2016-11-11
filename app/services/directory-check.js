const config = require('../../config')
var fs = require('fs')
var mkdirp = require('mkdirp')

module.exports = function (reference, claimId, claimExpenseId, documentType) {
  var path
  if (!claimExpenseId) {
    path = `${config.FILE_UPLOAD_LOCATION}/${reference}/${claimId}/${documentType}`
  } else {
    path = `${config.FILE_UPLOAD_LOCATION}/${reference}/${claimId}/${claimExpenseId}/${documentType}`
  }
  if (!fs.existsSync(path)) {
    mkdirp.sync(path)
  }
}
