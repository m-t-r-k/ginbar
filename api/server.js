// api/server.js

const express = require("express")
const app = express()
const cors = require("cors")
const data = require('./data.json')
const tastinginfos = require('./tastinginfo-data.json')
const gins = require('./gin-data.json')
const cocktails = require('./cocktail-data.json')

app.use(cors())

app.listen(3000, () => {
  console.log("app listening on port 3000")
})

app.get("/", function(req, res) {
    res.send(data)
})

app.get("/tastinginfos/", function(req, res) {
    res.send(tastinginfos)
})

app.get("/gins/", function(req, res) {
    res.send(gins)
})

app.get("/gins/:ginId", function(req, res) {
    let gin = gins.find(item => item.id === req.params.ginId)
    res.send(gin)
})

app.get("/cocktails/", function(req, res) {
    res.send(cocktails)
})