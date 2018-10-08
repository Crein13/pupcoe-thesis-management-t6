var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var config = require('./config.js');
var { Client } = require('pg');
console.log('config db', config.db);
var client = new Client(config.db);

// connect to database
client.connect()
  .then(function () {
    console.log('Connected to database!');
  })
  .catch(function (err) {
    if (err) throw err;
    console.log('Cannot connect to database!');
  });

var app = express();

// Set Public folder
app.use(express.static(path.join(__dirname, '/public')));

// Assign Handlebars To .handlebars files
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

// Set Default extension .handlebars
app.set('view engine', 'handlebars');

/* app.get('/', function(req, res) {
res.render('products');
});
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/* ---------- Welcome Page / Login Page ---------- */

app.get('/', function (req, res) {
  res.render('login', {
    layout: false
  });
});


/* ------------------------ ADMIN PAGE ------------------------ */
app.get('/admin', function (req, res) {
  res.render('admin/home', {
  });
});

/* -------- FACULTY --------- */
app.get('/admin/faculty', function (req, res) {
  res.render('admin/list_faculty', {
  });
});

app.get('/admin/add_faculty', function (req, res) {
  res.render('admin/add_faculty', {
  })
})

/* -------- STUDENT --------- */
app.get('/admin/student', function (req, res) {
  res.render('admin/list_student', {
  });
});

app.get('/admin/add_student', function (req, res) {
  res.render('admin/add_student', {
  })
})

/* -------- CLASS --------- */
app.get('/admin/class', function (req, res) {
  res.render('admin/list_class', {
  });
});

app.get('/admin/add_class', function (req, res) {
  res.render('admin/add_class', {
  })
})

// Server
app.listen(port, function () {
  console.log('App Started on ' + port);
});
