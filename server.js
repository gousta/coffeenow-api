const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const shops = require('./shops.json')
const cfg = {
  port: process.env.PORT || 3000,
  mongoDBConnectionString: process.env.MONGODB_URI || ''
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

app.use((req, res, next) => {
  console.info(`[HTTP][${req.method}] ${req.originalUrl}`)
  next()
})

// ROUTES
app.get('/', (req, res) => {
  res.responseWithData()
})

app.get('/shops', (req, res) => {
  res.responseWithData(shops)
})

app.post('/order', (req, res) => {
  const { shopId, productId} = req.body;

  console.log(req.body);
  console.log(shopId, productId);
  res.responseWithData(req.body);
})

// MONGO
mongoose
  .connect(cfg.mongoDBConnectionString)
  .then(() => {
    console.info(`[MONGODB][CONNECT][OK] @ ${cfg.mongoDBConnectionString}`)
  })
  .catch((err) => {
    console.error('[MONGODB][CONNECT][ERROR] @ ', err.message)
  })

// Start Server
app.listen(cfg.port, () => {
  console.info(`[SERVER][OK] @ ${cfg.port}`)
})
