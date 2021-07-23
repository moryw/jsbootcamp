const express = require('express')
const mongo = require('mongodb').MongoClient

const app = express()

app.use(express.json())

const mongoURL = 'mongodb://localhost:27017'

let db, trips, expenses

mongo.connect( mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db("tripcost")
    trips = db.collection("trips")
    expenses = db.collection('expenses')

  }
)

app.post('/trip', (req, res) => {
  // get the name and save it to DB
  // requires { name }
  const name = req.body.name
  trips.insertOne({ name: name }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err })
      return
    }

    console.log(result)
    res.status(200).json({ ok: true })

  })
})

app.get('/trips', (req, res) => {
  // get a list of all the current saved trips
})

app.post('/expense', (req, res) => {
  // add an expense to a trip
  // requires { trip, date, amount, category, description }
})

app.get('expenses', (req, res) => {
  // gets a list of expenses for a specific trip
  // requires { trip }
})

app.listen(3000, () => console.log('Server is running...'))
