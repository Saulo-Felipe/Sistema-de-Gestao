const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('azjfgsms', 'azjfgsms', 'foQUTkO5aTYkpCoUkiG1k4IsJCn9kmk2', {
  host: 'kashin.db.elephantsql.com',
  dialect: 'postgres'
})

module.exports = sequelize