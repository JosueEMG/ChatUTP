const express =  require('express')
const app =  express()
const path = require('path')
const socketIO = require('socket.io')
const morgan = require('morgan')

app.set('port', process.env.PORT || 3000)
app.set('view engine', '.ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'))

app.get('/', (req, res) => {

    res.render('index')
})

const server = app.listen(app.get('port'), () => {

    console.log(`Server on port: ${app.get('port')}`)
})

const io = socketIO(server)

io.on('connect', (socket) => {

    console.log(`Socket has been connected: ${socket.id}`)

    socket.broadcast.emit('chat:onConnection', socket.id)

    socket.on('chat:message', data => {
        console.log(data)
        io.sockets.emit('chat:message', data)
    })

    socket.on('disconnect', () => {
        console.log(`Socket is not connected: ${socket.id}`)
        socket.broadcast.emit('chat:onDisconnection', socket.id)
    })

    socket.on('chat:typing', data => {

        socket.broadcast.emit('chat:typing', data)
    })

})