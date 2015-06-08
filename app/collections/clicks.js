var db = require('../config');
var Click = require('../models/click');

var Clicks = new db.Collection();

Clicks.model = Click;

module.exports = Clicks;
