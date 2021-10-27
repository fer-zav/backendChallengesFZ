module.exports = {
  apps: [
    {
      name: 'forkApp',
      script: './src/ej30.js',
      // instances: "8",
      // exec_mode: "fork", //esto ANDA
      watch: true,
      autorestart: true,
      args: '--puerto=8081 -mode=fork',
    },
    {
      name: 'clusterApp',
      script: './src/ej30.js',
      // instances: "8",
      // exec_mode: "cluster", //esto NO ANDA, comentandolo defaultea a fork y funciona
      watch: true,
      autorestart: true,
      args: '--puerto=8082 -mode=cluster',
    },
  ],
};
