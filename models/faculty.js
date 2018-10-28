const db = require('../db/db.js')

var actions = {
  classList: (filter,callback) => {
      const query =
      `SELECT users.id as student_id, users.student_number as student_number, users.first_name, users.last_name, classes.id as class_id
      FROM classes 
      inner join users on users.id = classes.adviser
      WHERE classes.adviser = '${filter.id}' 
      AND users.user_type = 'student' `;
       db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e)
        callback(e)
      })
    },
  noClassList: (noClassData,callback) => {
      const query =
      `SELECT *
      FROM users
      WHERE user_type = 'student' AND users.id NOT IN (SELECT DISTINCT student_id FROM "classStudents")`;
       db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e)
        callback(e)
      })
    },
  classId: (filter,callback) => {
      const query =
      `select id from class where adviser = ${filter.id} `;
       db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e)
        callback(e)
      })
    },
  groupList: (filter,callback) => {
      const query =
      `select * from groups where class_id = ${filter.id} `;
       db.query(query)
      .then(res => callback(res.rows))
      .catch(e => {
        console.log(e)
        callback(e)
      })
    },
  insertStudent: (userData, callback) => {
    const query =
    `INSERT INTO 
      "classStudents" (student_id)
     VALUES
      ('${userData.student_id}')
      RETURNING *
      `;
     db.query(query)
    .then(res => callback(res))
    .catch(e => {
      console.log(e)
      callback(e)
    })
  },
    createGroup: (groupData,callback) => {
    const query =
    `INSERT INTO 
      groups (group_name,class_id) 
     VALUES 
      ('${groupData.groupName}','${groupData.classid}') 
      RETURNING id
      `;
     db.query(query)
    .then(res => callback(res.rows))
    .catch(e => {
      console.log(e)
      callback(e)
    })
  },
    insertMembers: (groupData,callback) => {
    const query =
    `INSERT INTO 
      group_members (group_id,user_id) 
     VALUES 
      ${groupData}
      `;
     db.query(query)
    .then(res => callback(res))
    .catch(e => {
      console.log(e)
      callback(e)
    })
  },
    listThesis: (filter,callback) => {
    const query =
    `select thesis.id,thesis_title,group_id,current_stage,abstract,current_stage,groups.class_id, class.adviser_id from thesis
      inner join groups on groups.id = group_id
      inner join class on class.id = groups.class_id
      where adviser_id = ${filter.adviserid} and current_stage = ${filter.currentstage}
      `;
     db.query(query)
    .then(res => callback(res))
    .catch(e => {
      console.log(e)
      callback(e)
    })
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
  },
  listByFacultyID: (filter,callback) => {
    const query =
    `SELECT
      *
    FROM
      classes
    WHERE
      adviser = ${filter.id}
    `;
    db.query(query)
    .then(res => callback(res.rows))
    .catch(e => {
      console.log(e);
    });
  }
}
module.exports = actions