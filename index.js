// require your server and launch it
const server = require('./api/server');

const port = 5000;

server.listen(5000, ()=>{
    console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});