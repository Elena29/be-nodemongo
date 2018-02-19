const express = require('express');
const exphbs = require('express-handlebars');

//Initialize application
const app = express();
const port = 3000;

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// Mongo client
const client = require('mongodb').MongoClient;

app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {title});
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});