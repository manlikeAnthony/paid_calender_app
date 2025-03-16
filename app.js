require('dotenv').config()
require('express-async-errors')
require('./utils/scheduleTasks')

const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
//pakages
const cookieParser = require('cookie-parser');

// database
const connectDB = require('./database/connect')
//middleware
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found')
const {webhook} = require('./controllers/paymentController')
//routes
const authRouter = require('./routes/authRoutes')
const taskRouter = require('./routes/taskRoutes')
const paymentRouter = require('./routes/paymentRoutes')

app.post('/api/v1/payment/webhook', express.raw({ type: 'application/json' }), webhook);

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api/v1/auth' , authRouter)
app.use('/api/v1/task' , taskRouter)
app.use('/api/v1/payment' , paymentRouter)

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)
const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(PORT , console.log(`app is listening on port ${PORT}...`))
    } catch (error) {
        console.log('Failed to connect to database' , error)
    }
}
const now = new Date(Date.now());
console.log(now)
start()