const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors')
const express = require('express');
const app = express();
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes')
const cookieParser = require('cookie-parser')
const captainRoutes = require('./routes/captain.routes')
const mapsRoutes = require('./routes/maps.routes')
const rideRoutes = require('./routes/ride.routes')
const paymentRoutes = require('./routes/payment.routes')
const adminRoutes = require('./routes/admin.routes')
const chatRoutes = require('./routes/chat.routes')
const Fs = require('fs')
const rfs = require('rotating-file-stream')
const path = require('path')
// const rideCaptainRoutes = require('./routes/rideCaptain.routes')

// require('socket.io')

connectToDb();

app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:3000',  // Frontend URL
//     credentials: true
// }));
 


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

const logStream = rfs.createStream((time, index) =>{
    if(!time) return 'log.txt'; //Default file name
    const date = new Date(time);
    return `log-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.txt`;
},{
    interval: '1d', // Rotate daily
    path: path.join(__dirname, 'log'), // Directory to save logs
    maxSize: '10M', // Maximum file size
})

app.use((req, res, next) => {
    const logEntry = `\n${Date.now()} ${req.method} ${req.url} ${new Date().toString()}\n`;
    logStream.write(logEntry);

    next();
});

app.get('/',(req,res)=>{
    res.send('Helllo World')
})
app.use('/user',userRoutes)
app.use('/captain',captainRoutes)
app.use('/maps',mapsRoutes)
app.use('/rides',rideRoutes)
app.use('/payment',paymentRoutes)
app.use('/admin',adminRoutes)
app.use('/chat',chatRoutes)
// app.use('/rideCaptain',rideCaptainRoutes)




module.exports = app;