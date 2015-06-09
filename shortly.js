var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');
var Clicks = require('./app/collections/clicks');
var Token = require('./app/models/token');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({
  secret: 'boo',
  resave: false,
  saveUninitialized: false
}));
// app.use(authenticate);
app.use(restrict);

app.get('/login',
function(req, res) {
  res.render('login');
});

app.get('/signup',
function(req,res) {
  res.render('signup');
});

app.post('/signup',
function(req,res) {
  var currentUser = new User({
    username: req.body.username
  });

  currentUser.fetch().then(function(found) {
    if (found) {
      console.log('user found');
      res.redirect('/signup');
    } else {
      console.log('user not found');
      currentUser.salt(req.body.password, function() {
        currentUser.save().then(function() {
          req.session.user = {};
          req.session.save();
          res.redirect('/');
        });
      });
    }
  });
});

app.post('/login',
function(req,res) {

  var currentUser = new User({
    username: req.body.username
  });

  currentUser.fetch().then(function(found) {
    if (found) {
      console.log('user found');
      currentUser.checkPassword(req.body.password, function(passwordCorrect) {
        if(passwordCorrect) {
          console.log('correct password');
          //TODO set up cookies
          // req.session.cookie.token  = 'token';
          req.session.user = {};
          req.session.save();
          res.redirect('/');
        } else {
          console.log('incorrect password');
          res.redirect('/login');
          // res.render('login');
        }
      });
    } else {
      console.log('user not found');
      res.redirect('/login');
      // res.render('login');
    }
  });
});

function authenticate(req, res, next) {
  console.log('authenticate');
  // if(req.sessionStore) {
    console.log('req.session: ', req.cookies['connect.sid']);
    req.sessionStore.load(req.cookies['connect.sid'], function(err, session) {
      if(err || !session) {
        console.log('session not found');
      } else {
        console.log('sessions found: ', session);
        req.session = session;
        //touch
      }
      next();
    });

  // }
}

function restrict(req, res, next) {
  if (req.session.user || req.url === '/login' || req.url === '/signup') {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/',
function(req, res) {
  console.log('index');
  res.render('index');
});

app.get('/create',
function(req, res) {
  res.render('index');
});

app.get('/links',
function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  });
});

app.post('/links',
function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save().then(function(newLink) {
          Links.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/



/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short c=ode and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        link_id: link.get('id')
      });

      click.save().then(function() {
        db.knex('urls')
          .where('code', '=', link.get('code'))
          .update({
            visits: link.get('visits') + 1,
          }).then(function() {
            return res.redirect(link.get('url'));
          });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);
