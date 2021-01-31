const express = require('express');
// const favicon = require('serve-favicon');
require('dotenv').config();
const next = require('next');
const passport = require('passport');
const bodyParser = require('body-parser');
require('../models/Post');
require('../models/Repost');
require('../models/User');
require('../models/Favorite');
require('../models/PostCollection');
require('../models/CollectionFavorite');
require('./handlers/passport');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const collectionRoutes = require('./routes/collectionRoutes');

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const daysInMilliseconds = 1000 * 60 * 60 * 24 * 30; // 30 days

const checkNotAuthenticated = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/');
    }
};

const checkAuthenticated = async (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.status) {
            if (req.user.status === 'banned') {
                return res.redirect('/banned');
            }
        } else {
            const User = mongoose.model('User');

            await User.findOneAndUpdate(
                { _id: req.user._id },
                { status: 'active' },
            );
        }

        next();
    } else {
        return res.redirect('/login');
    }
};

const adminCheck = (req, res, next) => {
    const { role } = req.user;
    if (role === 'admin' || role === 'super-admin') {
        next();
    } else {
        return res.redirect('/');
    }
};

const connectToDb = async () => {
    const database = await mongoose.connect(process.env.ATLAS_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    console.log('Connected to database');

    return database;
};

const prepareApp = async () => {
    const app = express();
    const database = await connectToDb();
    // app.use(favicon('path', options));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(
        session({
            cookie: { maxAge: daysInMilliseconds },
            secret: process.env.COOKIE_SECRET,
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({
                mongooseConnection: database.connection,
            }),
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());
    await nextApp.prepare();

    app.use('/api/account', accountRoutes);
    app.use('/api/authentication', authRoutes);
    app.use('/api/post', postRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/collection', collectionRoutes);

    app.get('/', checkAuthenticated, (req, res) =>
        nextApp.render(req, res, '/'),
    );

    app.get('/profile', checkAuthenticated, (req, res) =>
        nextApp.render(req, res, '/profile'),
    );

    app.get('/featured', checkAuthenticated, (req, res) =>
        nextApp.render(req, res, '/featured'),
    );

    app.get('/user/:username', checkAuthenticated, (req, res) =>
        nextApp.render(req, res, '/user', {
            username: req.params.username,
        }),
    );

    app.get('/favorites/:username', checkAuthenticated, (req, res) =>
        nextApp.render(req, res, '/favorites', {
            username: req.params.username,
        }),
    );

    app.get('/search/:searchParams', checkAuthenticated, (req, res) =>
        nextApp.render(req, res, '/search', {
            searchParams: req.params.searchParams,
        }),
    );

    app.get('/post/:postId', checkAuthenticated, (req, res) =>
        nextApp.render(req, res, `/post/${req.params.postId}`),
    );

    app.get('/following/:username', checkAuthenticated, (req, res) =>
        nextApp.render(req, res, `/following/${req.params.username}`),
    );

    app.get('/followers/:username', checkAuthenticated, (req, res) =>
        nextApp.render(req, res, `/followers/${req.params.username}`),
    );

    app.get('/login', checkNotAuthenticated, (req, res) =>
        nextApp.render(req, res, '/login'),
    );

    app.get('/register', checkNotAuthenticated, (req, res) =>
        nextApp.render(req, res, '/register'),
    );

    app.get('/admin', checkAuthenticated, adminCheck, (req, res) =>
        nextApp.render(req, res, '/admin'),
    );

    app.get('*', (req, res) => handle(req, res));

    app.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`ready on port ${PORT}`);
    });
};

prepareApp().catch((ex) => {
    console.log(ex.stack);
    process.exit(1);
});
