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


const db = require('./db/db.js');
const admin = require('./models/admin.js');
const faculty = require('./models/faculty.js');
const student = require('./models/student.js');
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
    admin.getUserData({id: req.user.id}, function(user){
      role = user[0].user_type;
      isAdmin = user[0].is_admin;
      console.log('role:',role);
      console.log('isAdmin:',isAdmin);
      if ((role == 'faculty') && (isAdmin === true)) {
        return next();
      }
      else{
        res.redirect('/');
      }
    });
  }
   else{
    res.redirect('/');
  }
}

function isFaculty (req, res, next) {
  if (req.isAuthenticated()) {
    admin.getUserData({id: req.user.id}, function(user){
      role = user[0].user_type;
      isAdmin = user[0].is_admin;
      console.log('role:',role);
      console.log('isAdmin:',isAdmin);
      if ((role == 'faculty') && (isAdmin === false)) {
        return next();
      }
      else{
        res.redirect('/');
      }
    });
  }
  else{
    res.redirect('/');
  }
}

function isStudent (req, res, next) {
  if (req.isAuthenticated()) {
    admin.getUserData({id: req.user.id}, function(user){
      role = user[0].user_type;
      console.log('role:',role);
      if (role == 'student') {
          return next();
      }
      else{
        res.redirect('/');
      }
    });
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
app.get('/admin', isAdmin, function (req, res) {
  res.render('admin/dashboard', {
  });
});

/* -------- FACULTY --------- */
app.get('/admin/faculty', isAdmin, function (req, res) {
  admin.facultyList({}, function(facultyList) {
    res.render('admin/list_faculty', {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    phone: req.user.phone,
    user_type: req.user.user_type,
    faculties: facultyList
    });
  });
});



app.get('/admin/add_faculty', isAdmin, function (req, res) {
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
    is_admin: req.body.is_admin
  },
  function(callback){
    res.redirect('/admin/faculty');
  });
});

/* -------- STUDENT --------- */
app.get('/admin/student', isAdmin, function (req, res) {
  admin.studentList({}, function(studentList) {
    res.render('admin/list_student', {
    student_id: req.user.id,
    student_number: req.user.student_number,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    phone: req.user.phone,
    user_type: req.user.user_type,
    students: studentList
    });
  });
});

app.get('/admin/add_student', isAdmin, function (req, res) {
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
  },
  function(callback){
    res.redirect('/admin/student');
  });
});

/* -------- CLASS --------- */
app.get('/admin/class', isAdmin, function (req, res) {
  admin.classList({ }, function(classList) {
    res.render('admin/list_class', {
    class_id: req.user.id,
    batch: req.user.batch,
    section: req.user.section,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    adviser: req.user.adviser,
    classes: classList
    });
  });
});

app.get('/admin/add_class', isAdmin, function (req, res) {
  admin.facultyList({}, function(facultyList) {
    res.render('admin/add_class', {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    phone: req.user.phone,
    user_type: req.user.user_type,
    faculties: facultyList
    });
  });
});

app.post('/admin/add_class', function (req, res) {
  admin.createClass({
    batch: req.body.batch,
    section: req.body.section,
    adviser: req.body.adviser
  },
  function(callback) {
    res.redirect('/admin/class');
  });
});

app.get('/admin/class/:id', isAdmin, function (req, res) {
  admin.classId({id: req.user.id}, function (classId) {
    admin.classStudentList({id: req.user.id}, function (classStudentList) {
      admin.noClassList({}, function  (noClassList) {
        res.render('admin/class_detail', {
          student_number: req.user.student_number,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          email: req.user.email,
          phone: req.user.phone,
          noClass: noClassList,
          students: classStudentList
        });
      });
    });
  });
});

app.post('/admin/class/addStudent', function (req, res) {
  admin.insertStudent({
    student_id: req.body.student_id,
    class_id: class_id
  },
  function(callback) {
    res.redirect('/admin/class');
  });
});

/* -------- GROUP --------- */
app.get('/admin/group', isAdmin, function (req, res) {
  admin.groupList({}, function (groupList) {
    res.render('admin/list_group', {
      batch: req.user.batch,
      group_name: req.user.group_name,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      group: groupList
    });
  });
});

app.get('/admin/add_group', isAdmin, function (req, res) {
  admin.facultyList({}, function(facultyList) {
    res.render('admin/add_group', {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    phone: req.user.phone,
    user_type: req.user.user_type,
    faculties: facultyList
    });
  });
});

app.post('/admin/add_group', function (req, res) {
  admin.createGroup({
    batch: req.body.batch,
    group_name: req.body.group_name,
    adviser_id: req.body.adviser_id
  },
  function(callback) {
    res.redirect('/admin/group');
  });
});

/* ------------------------ FACULTY PAGE ------------------------ */
app.get('/faculty', isFaculty, function (req, res) {
  res.render('faculty/dashboard', {
    layout: 'faculty'
  });
});

/* -------- FACULTY --------- */
app.get('/faculty/class', isFaculty, function (req, res) {
  faculty.listByFacultyID({id:req.user.id}, function(classList) {
    res.render('faculty/list_my_class', {
      batch: req.user.batch,
      section: req.user.section,
      classes: classList,
      layout: 'faculty'
    });
  });
});

app.get('/faculty/class/:id', isFaculty, function (req, res) {
  faculty.classList({id: req.user.id}, function (studentList) {
      res.render('faculty/class_detail', {
        id: req.user.id,
        student_number: req.user.student_number,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        phone: req.user.phone,
        students: studentList,
        layout: 'faculty'
      });
  });
});


/* ------------------------ STUDENT PAGE ------------------------ */
app.get('/student', isStudent, function (req, res) {
  student.studentProfile({id: req.user.id}, function (profileList) {
    res.render('student/dashboard', {
      student_number: req.user.student_number,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      phone: req.user.phone,
      student: profileList,
      layout: 'student'
    });
  });
});

app.get('/student/group', isStudent, function (req, res) {
  student.studentGroup({id: req.user.id}, function (studentGroup) {
  res.render('student/group', {
    student_number: req.user.student_number,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    group: studentGroup,
    layout: 'student'
    });
  });
});

app.get('/student/thesis', isStudent, function (req, res) {
  res.render('student/list_thesis', {
    layout: 'student'
  })
});

// Server
app.listen(port, function () {
  console.log('App Started on port ' + port);
});
