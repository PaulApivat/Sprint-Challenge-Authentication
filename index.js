require('dotenv').config(); // load .env variables

const { server } = require('./api/server.js');

server.get('/', (req , res) => {
  res.send('Sprint Challenge Authentication...')
})

const port = process.env.PORT || 3300;
server.listen(port, () => {
  console.log(`\n=== Server listening on port ${port}\n`);
});
