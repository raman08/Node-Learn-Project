const http = require('http');

const routes = require('./routes');

console.log(routes);

const server = http.createServer(routes);

server.listen(3000);