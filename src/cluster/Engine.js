// src/cluster/Engine.js

const cluster = require('cluster');
const os = require('os');

function ClusterEngine(callback, instances = os.cpus().length) {
  if (cluster.isMaster) {
    console.log(`🧠 Master PID ${process.pid} running`);
    for (let i = 0; i < instances; i++) cluster.fork();

    cluster.on('exit', (worker) => {
      console.log(`❌ Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    callback();
  }
}

module.exports = ClusterEngine;
