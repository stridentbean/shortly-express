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
    });
  },
  salt: function (password, callback) {
    console.log('salt start');
    var context = this;
    bcrypt.genSalt(10, function(err, salt) {
      context.set('salt',salt);
      console.log('salting');
      bcrypt.hash(password, salt, null, function(err,hash) {
        console.log('hashing');
        context.set('password', hash);
        callback();
      });
    });
  },
  checkPassword: function(password, callback) {
    console.log('checking password');

    var context = this;
    bcrypt.hash(password, context.get('salt'), null, function (err, hash) {
      callback(hash === context.get('password'));
    });
  }
});

module.exports = User;
