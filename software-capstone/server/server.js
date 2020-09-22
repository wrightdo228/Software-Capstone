const express = require('express');
// const favicon = require('serve-favicon');
const next = require('next');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('../config/keys').atlasUri;
require('../models/User');
const userRoutes = require('./routes/userRoutes');

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
    const server = express();

    // server.use(favicon('path', options));
    server.use(bodyParser.json());
    await nextApp.prepare();
    await connectToDb();

    server.use('/api/user', userRoutes);

    // server.get('/post/:id/:title', (req, res) =>
    //     nextApp.render(req, res, '/post', {
    //         slug: req.params.slug,
    //     })
    // );

    server.get('*', (req, res) => handle(req, res));

    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`ready on port ${PORT}`);
    });
};

prepareApp().catch((ex) => {
    console.log(ex.stack);
    process.exit(1);
});
