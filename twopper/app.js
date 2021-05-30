const path = require('path');
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
  res.render('success')
  res.end()
})

app.listen(3000, () => console.log('Server is running!!!'))
