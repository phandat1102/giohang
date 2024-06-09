import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts'; // Import express-ejs-layouts

const configViewEngine = (app) => {
    try {

        // Định nghĩa thư mục public để phục vụ các tệp tĩnh
        app.use(express.static(path.join(__dirname, '..', 'public')));

        // Set the views directory and view engine
        app.set('views', path.join(__dirname, '..', 'views'));
        app.set('view engine', 'ejs');

        // Middleware để xác định layout dựa trên URL
        app.use((req, res, next) => {
            if (req.originalUrl.startsWith('/admin')) {
                // Nếu URL xuất phát từ /admin, sử dụng layout cho admin
                res.locals.layout = 'layout/admin_layout';
            } else {
                // Nếu không, sử dụng layout public
                res.locals.layout = 'layout/web_layout';
            }
            next();
        });

        // Use express-ejs-layouts middleware
        app.use(expressLayouts);

    } catch (error) {
        console.error('Error configuring view engine:', error);
        throw error; // Throw the error for handling elsewhere
    }
};

export default configViewEngine;
