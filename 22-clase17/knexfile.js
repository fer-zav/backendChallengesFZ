// Update with your config settings.

const options = {
  staging: {
    client: 'sqlite3',
    connection: {
      filename: process.env.SQLITE_FILENAME || './dev.sqlite3'
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
    useNullAsDefault: true,
  },

  development: {
    client: 'mysql',
    connection: {
      database: 'products', //ok, no funcionaba porque no estaba creada la base de datos "productos" -_-
      host: '127.0.0.1',
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
}
module.exports = {
  options
};
