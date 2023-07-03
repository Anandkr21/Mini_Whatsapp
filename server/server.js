const express = require('express');
const app = express();
const {msgModel} = require('./model/msgModel')
const {connection} = require('./config/db')

app.use(express.json());

const user = require('./route/userRoute')

require('dotenv').config();
const port = process.env.PORT || 8080

// ======================================================
const moment = require('moment');
const {Server} = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

const users = {}
var count =0;

// basic route for checking
app.get('/',(req,res) =>{
    res.send('Welcome to Group Chat Application.');
})

app.use('/api', user)

io.on("connection", (socket) =>{
    console.log('user connected');
    socket.on('new-user-joined', async(name) =>{
        try {
            count+=1;
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name);
            io.emit('user-online', count);
            const msg = new msgModel({
                sender:name.sender,
                content:name.content
            })
            await msg.save();
        } catch (error) {
            console.error(error)
        }
    });

    socket.on('send', (message) =>{
        socket.broadcast.emit('receive', {
            message:message,
            name: users[socket.id]
        });
    });

    socket.on('disconnect', (message) =>{
        console.log('user disconnect');
        socket.broadcast.emit('leave', users[socket.id])
        delete users[socket.id]
        count--
        if(count<0){
            count = 0;
        }
        io.emit('user-online', count)
    });
});

server.listen(port, async() =>{
    try {
        await connection;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Unable to connect with DB');
    }
    console.log(`Server is running on port http://localhost:${port}`);
})