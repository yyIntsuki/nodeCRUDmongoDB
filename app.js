var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var db_url = 'mongodb://Admin:passw0rd@ds261253.mlab.com:61253/ncmd'
var db = mongoose.connection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Sets Express' View Engine to Embedded Javascript(ejs).
app.set('view engine', 'ejs');

// Connects to database.
mongoose.connect(db_url, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// Starts server.
app.listen(3000, function(){
    console.log('Server up and running at port 3000');
});

// Redirects user to Index page for '/'.
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// Saves user's input from HTML form to the database collection "products".
app.post('/create', function(req, res){
    db.collection('products').save(req.body, function(err, result){
        if(err) return console.log(err)
        res.redirect('/');
    });
});

// Renders ejs to show database results.
app.get('/', function(req, res){
    db.collection('products').find().toArray(function(err, result){
        // console.log(result) // For resting purposes.
        if(err) return console.log(err);
        res.render('index.ejs', {products: result})
    });
});