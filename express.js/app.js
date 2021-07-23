const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/time', (req, res) => {
  if (req.query.moment === 'now') {
    console.log(true)
  } else {
    console.log(false)
  }

  let result = {}

  for (const key in req.query) {
    console.log(`${key} = ${req.query[key]}`)
    result[key] = req.query[key]
  }

  res.json(result)
})
app.get('/math', (req, res) => {
  res.sendStatus(200)
})
app.listen(5001, () => console.log('Server ready'))
