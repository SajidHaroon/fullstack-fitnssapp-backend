const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const UserController = require('./controllers/UserController')
const routes = require('./routes')
const path = require('path')
const http  = require('http')
const socketio = require('socket.io')


const app = express()
const server = http.Server(app)
const io = socketio(server)
const PORT  = process.env.PORT || 8000


if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()   // check condition if its a locl one
}



// app.get('/', (req,res) => {
//     res.send('Hello from express app! and now its updated')
// })

// app.post('/', (req,res) => {
    //     res.send('Got a post request')
    // })
    
// app.get('/register', (req,res) => {
    //     res.send("Welcome to Register")
    //     //console.log("Register page")
    // })

    // app.post('/register', UserController.store)

    try {
        mongoose.connect(process.env.MONGO_DB_CONNECTION,{
            useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    console.log('MongoDB connected successfully')
} catch (error) {
    console.log(error)
    
}

//Web socket
const connectedUsers = {}   // Memory for server to store users
io.on('connection', socket => {
    //console.log('User is connected with: ', socket.id)
    const {user} = socket.handshake.query
    connectedUsers[user] = socket.id
    //console.log(socket.handshake.query)
    io.emit('mojo', {data: 'hello-world'})
})


app.use((req, res, next) => {                        // another form of middleware like we do in routes.js
    req.io = io
    req.connectedUsers = connectedUsers
    return next()
})

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/files', express.static(path.resolve(__dirname,"..","files")))


server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})


// app.listen(PORT, () => {
    //     console.log(`Listening on ${PORT}`)
// })

// Mongoo DB connection string
// mongodb+srv://sharoon:<password>@cluster0.begjf.mongodb.net/<dbname>?retryWrites=true&w=majority
// username: temp, temp321
// sharoon, project9214




// User is connected with:  rVrn5JT99kijN5YtAAAB
// {
//   user: '5f5764d644548e36d07c95a0',
//   EIO: '3',
//   transport: 'polling',
//   t: 'NHjV_3_'
// }