const express = require('express');
// const favicon = require('serve-favicon');
const next = require('next');
const passport = require('passport');
const bodyParser = require('body-parser');
require('../models/Comment');
require('../models/Post');
require('../models/User');
require('./handlers/passport');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const db = require('../config/keys').atlasUri;
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const daysInMilliseconds = 1000 * 60 * 30;

const connectToDb = async () => {
    const database = await mongoose.connect(db, {
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
            secret: 'woot',
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

    // app.get('/:username', (req, res) =>
    //     nextApp.render(req, res, '/', {
    //         username: req.params.username,
    //     })
    // );

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
