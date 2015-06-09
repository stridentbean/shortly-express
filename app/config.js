var Bookshelf = require('bookshelf');
var path = require('path');

var db = Bookshelf.initialize({
  client: 'sqlite3',
  connection: {
    host: '127.0.0.1',
    user: 'your_database_user',
    password: 'password',
    database: 'shortlydb',
    charset: 'utf8',
    filename: path.join(__dirname, '../db/shortly.sqlite')
  }
});

db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('base_url', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.integer('user_id');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table URL', table);
    });
  }
});

db.knex.schema.hasTable('clicks').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('clicks', function (click) {
      click.increments('id').primary();
      click.integer('link_id');
      click.timestamps();
    }).then(function (table) {
      console.log('Created Table Clicks', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if(!exists) {
    console.log("creating");
    db.knex.schema.createTable('users', function(user) {
      user.integer('id').primary();
      user.string('username', 50);
      user.string('password', 100);
      user.string('salt', 32);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table Users', table);
    });
  }
});

db.knex.schema.hasTable('tokens').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('tokens', function(token) {
      token.integer('id').primary();
      token.integer('user_id');
      token.string('token', 32);
      token.dateTime('expires');
      token.timestamps();
    }).then(function (table) {
      console.log('Created Table Tokens', table);
    });
  }
});

db.knex.schema.hasTable('userLinkJoins').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('userLinkJoins', function(userLinkJoin) {
      userLinkJoin.integer('user_id');
      userLinkJoin.integer('link_id');
    }).then(function (table) {
      console.log('Created Table userLinkJoins', table);
    });
  }
});

module.exports = db;
