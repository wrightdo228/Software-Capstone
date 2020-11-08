const express = require('express');
// const favicon = require('serve-favicon');
const next = require('next');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const db = require('../config/keys').atlasUri;
require('../models/User');
const userRoutes = require('./routes/userRoutes');
require('./handlers/passport');
const authRoutes = require('./routes/authRoutes');

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_DEV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const connectToDb = async () => {
    await mongoose.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });

    console.log('connected to database');
};

const prepareApp = async () => {
    const app = express();

    // app.use(favicon('path', options));
    app.use(bodyParser.json());
    app.use(
        session({
            cookie: { maxAge: 60000 },
            secret: 'woot',
            resave: false,
            saveUninitialized: false,
        }),
    );
    await nextApp.prepare();
    await connectToDb();

    app.use(flash());
    app.use('/api/user', userRoutes);
    app.use('/api/authentication', authRoutes);

    // app.get('/post/:id/:title', (req, res) =>
    //     nextApp.render(req, res, '/post', {
    //         slug: req.params.slug,
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
