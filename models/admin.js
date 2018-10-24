const db = require('../db/db.js')

var actions = {
  createFaculty: (facultyData, callback) => {
    const query =
    `INSERT INTO
      users (first_name, last_name, email, phone, password, user_type, is_admin)
    VALUES
      (
      '${facultyData.first_name}',
      '${facultyData.last_name}',
      '${facultyData.email}',
      '${facultyData.phone}',
      '${facultyData.password}',
      '${facultyData.user_type}',
      '${facultyData.is_admin ? true : false}')
      RETURNING *
    `;
    db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e)
        callback(e)
      })
  },
  createStudent: (studentData, callback) => {
    const query =
    `INSERT INTO
      users (first_name, last_name, email, student_number, phone, password, user_type)
    VALUES
      (
      '${studentData.first_name}',
      '${studentData.last_name}',
      '${studentData.email}',
      '${studentData.student_number}',
      '${studentData.phone}',
      '${studentData.password}',
      '${studentData.user_type}')
      RETURNING *
    `;
    db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e);
      });
  },
  createUser: (userData,callback) => {
      const query =
      `INSERT INTO 
        users (first_name,middle_name,last_name,email,password,user_type,contact_no) 
       VALUES 
        ('${userData.firstName}','${userData.middleName}','${userData.lastName}','${userData.email}','${userData.password}','${userData.userType}','${userData.contactNo}') 
        RETURNING id`;
       db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e);
      })
    }, 
    createClass: (classData,callback) => {
      const query =
      `INSERT INTO 
        classes (batch,section,adviser) 
       VALUES 
        ('${classData.batch}','${classData.section}','${classData.adviser}') 
       RETURNING *`;
       db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e);
      })
    },
    insertStudent: (userData,callback) => {
    const query =
    `INSERT INTO 
      class_members (class_id,user_id) 
     VALUES 
      ('${userData.classid}','${userData.userid}') 
      `;
     db.query(query)
    .then(res => callback(res))
    .catch(e => {
      console.log(e);
    });
    },
    getByEmail: (email,callback) => {
    const query =
    ` select * from users where email = '${email}'
     `;
     db.query(query)
    .then(res => callback(res.rows[0]))
    .catch(e => callback(e));
   },
    getById: (id,callback) => {
    const query =
    ` select * from users where id = '${id}'
     `;
     db.query(query)
    .then(res => callback(res.rows[0]))
      .catch(e => callback(e));
    },
    getGroupId: (id,callback) => {
    const query =
    ` select group_id from 
      group_members where user_id = ${id} `;
     db.query(query)
    .then(res => callback(res.rows[0]))
      .catch(e => callback(e));
    },
    classList: (filter,callback) => {
    const query =
    `SELECT
      classes.id, classes.batch, classes.section,
      users.first_name, users.last_name
    FROM
      classes
    INNER JOIN
      users
    ON
      classes.adviser = users.id
    WHERE
      users.user_type = 'faculty'
      `;
     db.query(query)
    .then(res => callback(res.rows))
    .catch(e => {
      console.log(e)
      callback(e)
    });

    },
    facultyList: (filter,callback) => {
    const query =
    `SELECT
      *
     FROM
       users
     WHERE
       user_type = 'faculty'
      `;
     db.query(query)
    .then(res => callback(res.rows))
    .catch(e => {
      console.log(e);
    });
    },
    studentList: (filter,callback) => {
    const query =
    `SELECT
      *
     FROM
       users
     WHERE
       user_type = 'student' 
      `;
     db.query(query)
    .then(res => callback(res.rows))
    .catch(e => {
      console.log(e);
    });
    }
  }
module.exports = actions;