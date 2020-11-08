const dev = process.env.NODE_ENV !== 'production';

module.exports = {
    atlasUri:
        'mongodb+srv://donneil123:R045ErdaKdENvAhF@capstone.me91q.mongodb.net/Capstone?retryWrites=true&w=majority',
    baseUrl: dev ? 'http://localhost:3000' : 'https://placehodler.com',
};
