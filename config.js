const config = {
  development: {
    // db: {
    //   database: 'storedb',
    //   user: 'postgres',
    //   password: 12345,
    //   host: 'localhost',
    //   port: 5432
    // },
     db: {
       database: 'd5a60mtlvdgsct',
       user: 'ehvgkglerjdend',
       password: '972133cb973818e3dabdebd6dcd0416bcf2365f02309518b74718ebbb935a959',
       host: 'ec2-54-225-97-112.compute-1.amazonaws.com',
       port: 5432,
       ssl: true
     },
    nodemailer: {

    }
  },
  production: {
    db: {
      database: process.env.DB_DB,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      ssl: true
    },
    nodemailer: {

    }
  }
};

module.exports = process.env.NODE_ENV === 'production' ? config.production : config.development;

//heroku pg:psql postgresql-animate-56327 --app pupcoe-thesis-management-t6
