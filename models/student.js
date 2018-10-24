const db = require('../db/db.js')

var actions = {
    addProposal: (thesisData,callback) => {
    const query =
    `INSERT INTO 
      thesis (thesis_title,group_id,current_stage,abstract) 
     VALUES 
      ('${thesisData.title}',${thesisData.groupid},'1','${thesisData.abstract}')
      `;
     db.query(query)
    .then(res => callback(res))
    .catch(e => {
      console.log(e)
      callback(e)
    })
  },
  studentProfile: (studentData, callback) => {
    const query =
    `SELECT
      users.first_name AS first_name, users.last_name AS last_name, users.student_number AS student_number, users.phone AS phone, users.email AS email
    FROM
      users
    WHERE
    `;
    db.query(query)
    .then(res => callback(res))
    .catch(e => {
      console.log(e)
      callback(e)
    })
  }
}
module.exports = actions