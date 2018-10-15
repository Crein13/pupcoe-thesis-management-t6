var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var session = require('express-session');
var bcrypt = require('bcryptjs');
var port = process.env.PORT || 3000;
var config = require('./config.js');
var { Client } = require('pg');
console.log('config db', config.db);
var client = new Client(config.db);


const db = require('./db/db.js')
const admin = require('./models/admin.js')
// const adviser = require('./models/adviser.js')
// const student = require('./models/student.js')
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* ----- Session ----- */
app.use(session({
  secret: 'team6secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  },

function(email, password, cb) {
  admin.getByEmail(email, function(user) {
    if (!user) { return cb(null, false); }
    if (user.password != password) { return cb(null, false); }
    return cb(null, user);
  });
}));

passport.serializeUser(function(user, cb) {
  console.log('serializeUser', user)
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  admin.getById(id, function (user) {
    console.log('deserializeUser', user)
    cb(null, user);
  });
});

function isAdmin(req, res, next) {
   if (req.isAuthenticated()) {
      console.log(req.user);
    role = req.user.isAdmin
    console.log(role)
    if (req.user.isAdmin == true) {
      req.session.admin == true;
        return next();
    }
    else{
      res.send(404);
    }
  }
  else{
res.redirect('/admin');
  }
}
function isFaculty(req, res, next) {
   if (req.isAuthenticated()) {
  admin.checkIfCommittee(req.user.id,function(result){
    if(result.rowCount > 0){
      req.session.committee = true;
    }
  });
  admin.checkIfAdviser(req.user.id,function(result){
    if(result.rowCount > 0){
      req.session.adviser = true;
    }
  });
  admin.getById(req.user.id,function(user){
    req.session.admin = req.user.isAdmin;
    role = req.user.user_type  
    console.log('role:',role);
    if (role == 'faculty') { 
    console.log(req.session.admin)   
        return next();
    }
    else{
     res.send(404);
    }

  });

  }
  else{
res.redirect('/faculty');
}
}

function isAdviser(req,res,next){
  if (req.session.adviser != true){
    res.send(404)
  }
  else{
    return next();
  }
}

function isStudent(req, res, next) {
   if (req.isAuthenticated()) {
  admin.getGroupId(req.user.id,function(user){
    req.session.group_id = user.group_id;
    console.log(req.session.group_id)
    role = req.user.user_type;
    if (role == 'student') {
        return next();
    }
    else{
      res.send(404);
    }
  });
  }
  else{
    res.redirect('/student');
  }
}

function isGuest(req, res, next) {
   if (req.isAuthenticated()) {
    role = req.user.user_type;
    console.log('role:',role);
    if (role == 'guest') {
      return next();
    }
    else{
      res.send(404);
    }
  }
  else{
    res.redirect('/');
  }
}

/* ---------- Welcome Page / Login Page ---------- */

app.get('/', function (req, res) {
  res.render('login', {
    layout: false
  });
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    if (req.user.is_admin) {
      res.redirect('/admin');
    } else if (req.user.user_type == 'faculty') {
      res.redirect('/faculty');
    } else if (req.user.user_type == 'student') {
      res.redirect('/student');
    } else {
      res.redirect('/');
    }
  });
/* ------- Authentication --------*/



/* ------------------------ ADMIN PAGE ------------------------ */
app.get('/admin', function (req, res) {
  res.render('admin/dashboard', {
  });
});

/* -------- FACULTY --------- */
app.get('/admin/faculty', function (req, res) {
  admin.facultyList({}, function(facultyList) {
    res.render('admin/list_faculty', {
    first_name: req.user.fname,
    last_name: req.user.lname,
    email: req.user.email,
    phone: req.user.phone,
    user_type: req.user.user_type,
    faculties: facultyList
    });
  });
});

app.get('/admin/add_faculty', function (req, res) {
  res.render('admin/add_faculty', {
  });
});

app.post('/admin/add_faculty', function (req, res) {
  admin.createFaculty({
    first_name: req.body.fname,
    last_name: req.body.lname,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    user_type: req.body.user_type,
  });
});

/* -------- STUDENT --------- */
app.get('/admin/student', function (req, res) {
  admin.studentList({}, function(studentList) {
    res.render('admin/list_faculty', {
    first_name: req.user.fname,
    last_name: req.user.lname,
    email: req.user.email,
    phone: req.user.phone,
    user_type: req.user.user_type,
    students: studentList
    });
  });
});

app.get('/admin/add_student', function (req, res) {
  res.render('admin/add_student', {
  });
});

app.post('/admin/add_student', function (req, res) {
  admin.createStudent({
    first_name: req.body.fname,
    last_name: req.body.lname,
    email: req.body.email,
    student_number: req.body.student_number,
    phone: req.body.phone,
    password: req.body.password,
    user_type: req.body.user_type
  });
});

/* -------- CLASS --------- */
app.get('/admin/class', function (req, res) {
  res.render('admin/list_class', {
  });
});

app.get('/admin/add_class', function (req, res) {
  res.render('admin/add_class', {
  })
})


/* ------------------------ FACULTY PAGE ------------------------ */
app.get('/faculty', function (req, res) {
  res.render('faculty/dashboard', {
  });
});

/* -------- FACULTY --------- */
app.get('/faculty/class', function (req, res) {
  res.render('faculty/list_my_class', {
  });
});

/* ------------------------ STUDENT PAGE ------------------------ */
app.get('/student', function (req, res) {
  res.render('student/dashboard', {
  });
});

app.get('/student/class', function (req, res) {
  res.render('student/class', {
  });
});

app.get('/student/group', function (req, res) {
  res.render('student/group', {
  });
});

// Server
app.listen(port, function () {
  console.log('App Started on ' + port);
});
