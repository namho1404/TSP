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
        res.render('index.html')
    });
    app.get('/add',function(req,res){
        res.render('add.html')
    });
    app.get('/control',function(req,res){
        res.render('control.html')
    });
    app.get('/list',function(req,res){
        connection.query('SELECT * from user', function(err,rows){
            if(!err){
                res.render('list.ejs',{data:rows})}
            else
                console.log('Error while performing query.',err)
        });
    });

    app.post('/add', function (req,res) {
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
    app.get('/delete/:id', function (req,res) {
        connection.query('DELETE FROM user WHERE id = ?',[req.params.id],
            function (err, result) {
                if (err) {
                    console.log('delete Error');
                } else {
                    console.log('delete id = %d', req.params.id);
                    res.redirect('/view');
                }
            }
        )
    })
    app.get('/control/control1', function (req,res) {
        /*
        connection.query('DELETE FROM user WHERE id = ?',[req.params.id],
            function (err, result) {
                if (err) {
                    console.log('delete Error');
                } else {
                    console.log('delete id = %d', req.params.id);
                    res.redirect('/view');
                }
            }
        )
        */
        console.log('ID 재정렬')
    })
    app.get('/control/control2', function (req,res) {
        console.log('파트너 매칭')
    })
}