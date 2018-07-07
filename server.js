const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const shops = require('./shops.json')
const cfg = {
  port: process.env.PORT || 3000
}

// CORS
app.use(cors())

// JSON
app.use(bodyParser.json())

// URLENCODED
app.use(bodyParser.urlencoded({ extended: false }))

// CUSTOM RESPONSES
app.use((req, res, next) => {
  res.responseWithError = (error, data) => {
    return res.json({status: 'error', error: error, data: data})
  }

  res.responseWithData = (data) => {
    return res.json({status: 'ok', data: data})
  }

  next()
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.responseWithData()
})

app.get('/shops', (req, res) => {
  res.responseWithData(shops)
})

app.post('/order', (req, res) => {
  const { shopId, productId} = req.body;

  console.log(shopId, productId);
})

// Start Server
app.listen(cfg.port, () => {
  console.info(`[CN][SERVER] is running on port ${cfg.port}`)
})
