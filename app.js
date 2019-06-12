const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()
const routes = require('./routes')
const port = 3000

app.use(cors())

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => res.send('App is working'))

app.use('/', routes)

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = {
  app
}
