// require('dotenv').config(); // load .env variables

// const { server } = require('./api/server.js');
const axios = require('axios');

//************** */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
// required jwtKey
const jwtKey =
  process.env.JWT_SECRET ||
  'add a .env file to root of project with the JWT_SECRET variable';

// quickly see what this file exports
module.exports = {
  authenticate,
};


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

// ADDING AUTHENTICATION
// function protect(req, res, next){
//   // ust jwt and read token string from Authorization header
//   const token = req.headers.authorization;

//   if(token){
//     jwt.verify(token, secret, (err, decodedToken) => {
//       if(err){
//         //token is invalid 
//         res.status(401).json({ message: "Invalid Token" });
//       } else {
//         //token is valid
//         console.log(decodedToken)
//         req.username = decodedToken.username;
//         next();
//       }
//     });
//   } else {
//     res.status(401).json({message: 'no token provided '});
//   }
// }

// GIVEN AUTHENTICATION
function authenticate(req, res, next) {
  const token = req.get('Authorization');

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {     //jwtKey
      if (err) return res.status(401).json(err);

      req.decoded = decoded;

      next();
    });
  } else {
    return res.status(401).json({
      error: 'No token provided, must be set on the Authorization Header',
    });
  }
}

server.get('/api/jokes', authenticate, (req, res) => {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
})


// server.get('/api/jokes', protect, (req, res) => {
//   db('users').select('id', 'username', 'password')
//   .then(users => {
//     res.json(users);
//   })
//   .catch(err => {
//     res.status(500).send(err);
//   })
// })

server.get('/', (req , res) => {
  res.send('Sprint Challenge Authentication...')
})

const port = process.env.PORT || 3300;

server.listen(port, () => {
  console.log(`\n=== Server listening on port ${port}\n`);
});
