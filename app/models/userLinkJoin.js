var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var UserLinkJoin = db.Model.extend({
  tableName: 'userLinkJoins',
  initialize: function() {
    this.on('creating', function(model, attrs, options) {

    });
  }
});

module.exports = UserLinkJoin;
