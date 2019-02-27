const express = require('express')
const fs = require('fs')
const path = require('path')
const url = require('url')
const app = express()
const port = 4000

app.use('/imgs', express.static('imgs'))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/folders/list', (req, res) => {
  var source = url.parse(req.url, true).query.source || 'imgs'
  var files = fs.readdirSync(source)
  if (url.parse(req.url, true).query.isFile) {
    res
    .status(200)
    .json(files.filter(file => file != '.DS_Store').map(item => `http://localhost:4000/${source}/${item}`))
  } else {
    res
      .status(200)
      .json(files.filter(file => file != '.DS_Store'))
  }
})

app.get('/sub_folders/list', (req, res) => {

  res
    .status(200)
    .json()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
