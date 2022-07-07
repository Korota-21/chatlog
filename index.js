const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose } = require('mongoose');


const config = require('./config');

const passportJWT = require("./middlewares/passportJWT")()
const errorHandler = require('./middlewares/errorHandler')
const app = express();

app.use(cors());
const server = require('http').Server(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");
const socketRouter = require("./routes/socket.routes");
// Data baes connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useNewUrlParser: true })

app.use(passportJWT.initialize())

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', passportJWT.authenticate(), chatRoutes);
app.use('/api/message', passportJWT.authenticate(), messageRoutes);

app.use(errorHandler)

const port = process.env.PORT || 8000;
io.on('connection', (socket) => {
    socketRouter(socket, io)
})

server.listen(port, () => console.log(`listening on ${port}`));