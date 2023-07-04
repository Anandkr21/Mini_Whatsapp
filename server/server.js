const express = require('express');
const app = express();
const user = require('./route/userRoute');
const { MessModel } = require('./model/msg');
const { connection } = require('./config/db');

app.use(express.json());

require('dotenv').config();
const port = process.env.PORT || 8080

// ======================================================
// server creation
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

// basic route for checking
app.get('/', (req, res) => {
    res.send('Welcome to Group Chat Application.');
})

// main route
app.use('/api', user)


const users = {}
var count = 0;
let uname = '';

io.on("connection", (socket) => {
    socket.on('new-user-joined', async (name) => {
        console.log(name);
        try {
            count += 1;
            users[socket.id] = name;
            uname = name;

            // broadcasting msg to all connected user
            socket.broadcast.emit('user-joined', name);
            io.emit('user-online', count);
        } catch (error) {
            console.error(error)
        }
    });

    socket.on('send', async (message) => {
        // checking user available or not
        let user = await MessModel.find({ name: users[socket.id] })
        console.log("user", user);
        if (user.length == 0) {
            await MessModel.insertMany({ name: users[socket.id], msg: message })
        }
        else {
            // if user exist, store new message and updating
            let id = user[0]._id;
            let allmsg = user[0].msg;
            allmsg.push(message);
            await MessModel.findByIdAndUpdate({ "_id": id }, { "msg": allmsg });
        }
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });

    });
    
    // disconnection handling here
    socket.on('disconnect', (message) => {
        console.log('user disconnect');
        socket.broadcast.emit('leave', users[socket.id])
        delete users[socket.id]
        count--
        if (count < 0) {
            count = 0;
        }
        io.emit('user-online', count)
    });
});



// connecting with server and database
server.listen(port, async () => {
    try {
        await connection;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Unable to connect with mongoDB');
    }
    console.log(`Server is running on port http://localhost:${port}`);
})


