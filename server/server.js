const express = require('express');
const app = express();
const {connection} = require('./config/db')

app.use(express.json());

const user = require('./route/userRoute')


require('dotenv').config();
const port = process.env.PORT || 8080

app.use('/api', user)

app.get('/',(req,res) =>{
    res.send('welcome')
})


app.listen(port, async() =>{
    try {
        await connection;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Unable to connect with DB');
    }
    console.log(`Server is running on port http://localhost:${port}`);
})