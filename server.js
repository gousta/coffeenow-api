require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const shops = require('./shops.json')
const cfg = {
  port: process.env.PORT || 3000,
  mongo: {
    url: process.env.MONGODB_URI || '',
    options: { useNewUrlParser: true }
  }
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

// MIDDLEWARE
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
  .connect(cfg.mongo.url, cfg.mongo.options)
  .then(() => {
    console.info(`[MONGODB][OK] @ ${cfg.mongo.url}`)
  })
  .catch((err) => {
    console.error('[MONGODB][ERROR] @ ', err.message)
  })

// Start Server
app.listen(cfg.port, () => {
  console.info(`[SERVER][OK] @ ${cfg.port}`)
})
