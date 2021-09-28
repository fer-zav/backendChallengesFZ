export const options = {
    staging: {
        client: 'mysql',
        connection: {
            database: 'carts',
            host: '127.0.0.1',
            user: 'root',
            password: '',
        },
        migrations: {
            directory: '/db/migrations',
        },
        seeds: {
            directory: "/db/seeds",
        }
    },

    development: {
        client: 'sqlite3',
        connection: {
            filename: process.env.SQLITE_FILENAME || './devCarts.sqlite3'
        },
        migrations: {
            directory: '/db/migrations',
        },
        seeds: {
            directory: '/db/seeds',
        },
        useNullAsDefault: true,
    },
}
