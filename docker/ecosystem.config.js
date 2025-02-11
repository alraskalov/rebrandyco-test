module.exports = {
    apps: [
        {
            name: 'api-gateway',
            script: './services/gateway/dist/main.js',
            instances: 'max',
            exec_mode: 'cluster',
            watch: false,
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'users-service',
            script: './services/users-service/dist/main.js',
            instances: 'max',
            exec_mode: 'cluster',
            watch: false,
            env: {
                NODE_ENV: 'production',
                DB_URL: 'postgres://user:password@users-db:5432/users_db',
            },
        },
        {
            name: 'comments-service',
            script: './services/comments-service/dist/main.js',
            instances: 'max',
            exec_mode: 'cluster',
            watch: false,
            env: {
                NODE_ENV: 'production',
                DB_URL: 'postgres://user:password@comments-db:5432/comments_db',
            },
        },
    ],
};