const bcrypt = require('bcrypt');
const path = require('path');

const redis = require('redis');
const client = redis.createClient()

const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.render('error', {
      message: 'Please give us both a username and password'
    })
  }

  client.hget('users', username, (err, userid) => {
    if (!userid) {
      client.incr('userid', async (err, userid) => {
        client.hset('users', username, userid)
        const saltRounds = 10
        const hash =  await bcrypt.hash(password, saltRounds)
        client.hset(`user:${userid}`, 'hash', hash, 'username', username)
      })
    } else {

    }
  })

  res.end()
})

app.listen(3000, () => console.log('Server is running!!!'))
