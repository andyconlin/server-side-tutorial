const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static('public'))

var db
var mongoUrl = 'mongodb+srv://<user>:<password>@<url>/test?retryWrites=true&w=majority'
MongoClient.connect(mongoUrl, (err, client) => {
  if (err) return console.log(err)
  db = client.db('server-side-tutorial')
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})


app.get('/', (req,res) => {
  //var cursor = db.collection('quotes').find()
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
    console.log(result)
  })
  //res.render(view, locals)
  //res.sendFile(__dirname + '/index.html')
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})


app.put('/quotes', (req,res) => {
  db.collection('quotes').findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


app.delete('/quotes', (req,res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
    (err, result) => {
      if (err) return res.send(500, err)
      res.send({message: 'A darth vadar quote got deleted'})
    })
})
