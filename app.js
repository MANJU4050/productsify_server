require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')



app.use(cors({credentials: true,
    origin: 'https://productapi.netlify.app',
    methods: ['GET', 'POST','PUT','PATCH','DELETE']
}));


//importing routes
const authRoute = require('./routes/auth')
const apiRoute = require('./routes/api') 
const refreshRoute = require('./routes/refresh')
const logoutRoute = require('./routes/logout')

//middlewares
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// connection establishment
const DB_CONNECT = "mongodb+srv://MANJUNATH:fg99FQ6gZYdezunH@cluster0.m7wnd.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(DB_CONNECT,{ useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("succesfully connected to database");
    }
})

//calling routes
app.use('/auth',authRoute)
app.use('/api',apiRoute)
app.use('/refresh',refreshRoute)
app.use('/logout',logoutRoute)

//port
app.listen(process.env.PORT, () => {
    console.log("server started at 4000");
})


