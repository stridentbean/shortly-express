var db = require('../config');
var Link = require('./link');
var Token = require('./token');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var UserLinkJoin = require('./userLinkJoin');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  links: function() {
    return this.belongToMany(Link).through(UserLinkJoin);
  },
  token: function() {
    return this.hasOne(Token);
  },
  initialize: function() {
    this.on('creating', function(model, attrs, options) {
      //create salt
      //append to password
      //hash salt + password
      //save that to the model as password
      //MAYBE create token MAYBE
    });
  }
});

module.exports = User;
