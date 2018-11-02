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
  studentProfile: (filter, callback) => {
    const query =
    `SELECT
      *
    FROM
      users
    WHERE id = '${filter.id}'
    `;
    db.query(query)
    .then(res => callback(res))
    .catch(e => {
      console.log(e)
      callback(e)
    })
  },
  studentGroup: (filter,callback) => {
    const query = `
    SELECT * FROM "group_members" WHERE group_members.member_name = '${filter.id}'
    `;
    db.query(query)
    .then(res => callback(res.rows))
    .catch(e => {
      console.log(e)
      callback(e)
    })
  }
}
module.exports = actions