// require('dotenv').config(); // load .env variables

// const { server } = require('./api/server.js');


//************** */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const knex = require('knex');
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(cors());
const secret = 'backtothefuture'; // not hardcoded, env variable

function generateToken(user){
  const payload = {
    username: user.username
  };
  //const secret = 'backtothefuture';
  const options = {
    expiresIn: '1h',
    jwtid: '12345'
  }
  return jwt.sign(payload, secret, options);
}
//****************** */

server.post('/api/register', (req, res) => {
    // implement user registration
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);
    creds.password = hash;

    db('users')
      .insert(creds)
      .then(ids => {
        const id = ids[0];

        //find user id
        db('users')
          .where({id})
          .first()
          .then(user => {
            const token = generateToken(user);
            res.status(201).json({ id: user.id, token })
          })
          .catch(err => res.status(500).send(err));
      })
      .catch(err => {
        res.status(500).send(err);
      });
})

server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
      .where({ username: creds.username })
      .first()
      .then(user => {
          if(user && bcrypt.compareSync(creds.password, user.password)) {
              // generate a token
              const token = generateToken(user);

              // attach that token to the response
              res.status(200).json({ token });
          } else {
              res.status(404).json({ err: "invalid username or password"});
          }
      })
      .catch(err => {
          res.status(500).send(err);
      })
});


server.get('/', (req , res) => {
  res.send('Sprint Challenge Authentication...')
})

const port = process.env.PORT || 3300;

server.listen(port, () => {
  console.log(`\n=== Server listening on port ${port}\n`);
});
