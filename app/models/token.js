var db = require('../config');
var moment = require('moment');
var User = require('./user');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var getExpirationTime = function () {
  var seconds = 60 * 60 * 24;
  var futureDate = new Date(Date.now() + seconds * 1000);
  var stringDate = moment(futureDate).format('yyyy-MM-dd HH:mm:ss');
  return stringDate;
};

var Token = db.Model.extend({
  tableName: 'tokens',
  hasTimestamps: true,
  default: {
    expires: getExpirationTime()
  },
  user: function() {
    return this.belongsTo(User);
  },
  initialize: function() {
    this.on('creating', function(model, attrs, options) {
      //create new token
      //
    });
  }
});

module.exports = Token;

