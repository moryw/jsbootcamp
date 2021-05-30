const bcrypt = require('bcrypt')
const path = require('path')

const redis = require('redis');
const client = redis.createClient()

const express = require('express')
const app = express()

const session = require('express-session')
const RedisStore = require('connect-redis')(session)

app.use(
  session({
    store: new RedisStore({ client: client }),
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 36000000, //10 hours, in milliseconds
      httpOnly: false,
      secure: false,
    },
    secret: 'B4b3dI8gr8f00d',
  })
)

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  if (req.session.userid) {
    res.render('dashboard')
  } else {
    res.render('login')
  }
})

app.post('/', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.render('error', {
      message: 'Please give us both a username and password'
    })
    return
  }

  const saveSessionAndRenderDashboard = userid => {
    req.session.userid = userid
    req.session.save()
    res.render('dashboard')
  }

  client.hget('users', username, (err, userid) => {
    if (!userid) {
      // if new user, automatically sign them up
      client.incr('userid', async (err, userid) => {
        client.hset('users', username, userid)
        const saltRounds = 10
        const hash =  await bcrypt.hash(password, saltRounds)
        client.hset(`user:${userid}`, 'hash', hash, 'username', username)
        saveSessionAndRenderDashboard(userid)
      })
    } else {
      client.hget(`user:${userid}`, 'hash', async (err, hash) => {
        const passGood = await bcrypt.compare(password, hash)
        if (passGood) {
          saveSessionAndRenderDashboard(userid)
        } else {
          res.render('error', {
            message: "Incorrect Password!"
          })
          return
        }
      })
    }
  })
})

app.listen(3000, () => console.log('Server is running!!!'))
