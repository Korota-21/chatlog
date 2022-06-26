const path = require('path')
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose } = require('mongoose');
const config = require('./config');

const app = express();

app.use(cors());

// Data baes connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useNewUrlParser: true })

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`listening on ${port}`));