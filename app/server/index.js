const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

//Initialize application
const app = express();
const port = 3000;

// Connect to mongoose
mongoose.connect('mongodb://mongo:27017')
  .then(() => {
      console.log('MongoDb Connected... ')
  })
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

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