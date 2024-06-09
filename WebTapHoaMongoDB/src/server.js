import express from 'express';
import dotenv from 'dotenv';
import configViewEngine from './config/configViewEngine.js';
import router from './routes/routes.js';
import connectDB from './config/connectDB.js';
import bodyParser from 'body-parser';
import session from 'express-session';


dotenv.config();
// Create an Express application
const app = express();

// Kết nối đến MongoDB
connectDB();

// Middleware để cho phép express đọc dữ liệu JSON
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configure view engine
configViewEngine(app);

app.use(session({
    secret: 'KEY_SESSION',
    resave: false,
    saveUninitialized: true
}));

// Use router middleware
app.use('/', router);

// Start the server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
