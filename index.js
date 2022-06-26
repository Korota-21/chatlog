const path = require('path')
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose } = require('mongoose');

const config = require('./config');

const passportJWT = require("./middlewares/passportJWT")()
const errorHandler = require('./middlewares/errorHandler')

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(cors());

// Data baes connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useNewUrlParser: true })

app.use(passportJWT.initialize())

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', passportJWT.authenticate(), chatRoutes);
app.use(errorHandler)

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`listening on ${port}`));