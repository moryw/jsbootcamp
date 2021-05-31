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
    client.hkeys('users', (err, users) => {
      res.render('dashboard', {
        users,
      })
    })
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

  const saveSessionAndRenderDashboard = (userid) => {
    req.session.userid = userid
    req.session.save()
    res.redirect('/')
  }

  const handleSignup = (username, password) => {
    client.incr('userid', async (err, userid) => {
      client.hset('users', username, userid)
      const saltRounds = 10
      const hash =  await bcrypt.hash(password, saltRounds)
      client.hset(`user:${userid}`, 'hash', hash, 'username', username)
      saveSessionAndRenderDashboard(userid)
    })
  }

  const handleLogin = (userid, password) => {
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

  client.hget('users', username, (err, userid) => {
    if (!userid) { // If new user, automatically sign them up
      handleSignup(username, password)
    } else { // Login user
      handleLogin(userid, password)
    }
  })
})

app.get('/post', (req, res) => {
  if (req.session.userid) {
    res.render("post")
  } else {
    res.render("login")
  }
})

app.post('/post', (req, res) => {
  if (!req.session.userid) {
    res.render('login')
    return
  }

  const { message } = req.body

  client.incr('postid', async (err, postid) => {
    client.hmset(
      `post: ${postid}`,
      'userid', req.session.userid,
      'message', message,
      'timestamp', Date.now()
    )
    res.redirect('/')
  })

})

app.post('/follow', (req, res) => {
  if (!req.session.userid) {
    res.render("login")
    return
  }

  const { username } = req.body

  client.hget(
    `user:${req.session.userid}`,
    'username',
    (err, currentUsername) => {
      client.sadd(`following:${currentUsername}`, username)
      client.sadd(`followers:${username}`, currentUsername)
    }
  )

  res.redirect('/')

})

app.listen(3000, () => console.log('Server is running!!!'))
