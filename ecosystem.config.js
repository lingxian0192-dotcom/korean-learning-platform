module.exports = {
  apps : [{
    name   : "api-server",
    script : "./apps/server/dist/src/main.js",
    instances : "max",
    exec_mode : "cluster",
    env: {
      PORT: 3001,
      NODE_ENV: "production"
    }
  }]
}
