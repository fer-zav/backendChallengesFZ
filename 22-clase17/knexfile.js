// Update with your config settings.

module.exports = {

  staging: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },

  development: {
    client: 'mysql',
    connection: {
      database: 'productos',
      host: "localhost",
      user: 'root',
      password: '',
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + "/db/seeds"
    }
  },
};
