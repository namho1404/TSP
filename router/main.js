var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'people_db'
});
connection.connect();

const bodyParser = require('body-parser');

module.exports = function(app)
{
    app.use(bodyParser.urlencoded({ extended: false}));
    app.get('/',function(req,res){
        console.log("home page");
        res.render('index.html')
    });
    app.get('/add',function(req,res){
        console.log("add page");
        res.render('add.html')
    });
    app.post('/add', function (req, res) {
        var name = req.body.name
        var age = req.body.age
        var gendor = req.body.gendor
        var wiwr = req.body.wiwr
        var wiwt = req.body.wiwt
        var phone = req.body.phone

        var sql= 'INSERT INTO user (name, age, gendor, WIWR, WIWT, phone) VALUES (?, ?, ?, ?, ?, ?)';

        connection.query(sql, [name, parseInt(age), parseInt(gendor), wiwr, wiwt, phone], function (err, result) {
            if(err){
                console.log(err);
                res.status(500).send('Internal Sever Error');
            }
            res.redirect('/');
        });
    });
    app.get('/view',function(req,res){
        connection.query('SELECT * from user', function(err,rows){
            if(!err){
                console.log("view page");
                res.render('view.ejs',{data:rows})}
            else
                console.log('Error while performing query.',err)
        });
    });
}