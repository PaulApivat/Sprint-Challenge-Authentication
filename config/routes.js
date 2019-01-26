const axios = require('axios');

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

function generateToken(user){
  const payload = {
    username: user.username
  };
  const secret = 'backtothefuture';
  const options = {
    expiresIn: '1h',
    jwtid: '12345'
  }
  return jwt.sign(payload, secret, options);
}

function register(req, res) {
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
}

function login(req, res) {
  // implement user login
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)){
        //generate a token
        const token = generateToken(user);
        //attach token to the response
        res.status(200).json({ token });
      } else {
        res.status(404).json({ err: "invalid username or password"});
      }
    })
    .catch(err => {
      res.status(500).send(err);
    })
}

function getJokes(req, res) {
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
}
