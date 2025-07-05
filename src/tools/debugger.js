// src/tools/debugger.js

function debug(message, context = {}) {
  if (process.env.DEBUG === 'true') {
    console.log('[oxy-debug]', message, context);
  }
}

module.exports = debug;
