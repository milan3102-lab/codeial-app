// Require necessary modules and configurations
const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const db = require('./config/mongoose');
const passportLocal = require('./config/passport-local-strategy');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const passportGoogle=require('./config/passport-google-oauth2-stratejy');

const app = express();
const port = 8001;

// Set up SASS middleware for CSS compilation
app.use(
    sassMiddleware({
        src: './assets/scss',
        dest: './assets/css',
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    })
);

// Set up EJS layout engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware for parsing request bodies and cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(
    session({
        name: 'codeial',
        secret: 'blahsomething',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 100 // 100 minutes
        },
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost/codeial_development',
            autoRemove: 'disabled'
        })
    })
);

// Initialize Passport and flash middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Use custom middleware to set flash messages and current user
app.use(customMware.setFlash);
app.use(customMware.setCurrentUser);

// Set static files directory for CSS and JS
app.use(express.static('./assets'));
// make uploads path available to browser
app.use('/uploads',express.static(__dirname + '/uploads'));
// Set up routes
app.use('/', require('./routes'));

// Start the server
app.listen(port, (err) => {
    if (err) {
        console.error(`Error: ${err}`);
        return;
    }
    console.log(`Server is running on port ${port}`);
});
