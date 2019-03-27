var mysql = require('mysql');
var smysql = require('sync-mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'people_db'
});
connection.connect();

var sconnection = new smysql({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'people_db'
})

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
            if(!err)
                res.render('list.ejs',{data:rows})
            else
                console.log('Error while performing query.',err)
        });
    });
    app.post('/add', function (req,res) {
        var name = req.body.name
        var age = req.body.age
        var gendor = req.body.gendor
        var wiwl = req.body.wiwl
        var wiwt = req.body.wiwt
        var phone = req.body.phone

        var sql= 'INSERT INTO user (name, age, gendor, WIWL, WIWT, phone) VALUES (?, ?, ?, ?, ?, ?)';

        connection.query(sql, [name, parseInt(age), parseInt(gendor), wiwl, wiwt, phone], function (err, result) {
            if(err){
                console.log(err);
                res.status(500).send('Internal Sever Error');
            }
            res.redirect('/');
        });
    });
    app.get('/delete/:id', function (req,res) {
        connection.query('DELETE FROM user WHERE id = ?',[req.params.id], function (err, result) {
            if (err) {
                console.log('Error while performing query.',err)
            } else {
                console.log('delete id = %d', req.params.id);
                res.redirect('/list');
            }
        })
    })
    app.get('/partner/:id/:partner', function (req,res) {
        connection.query('UPDATE user SET partner = ? WHERE id = ?',[req.params.partner,req.params.id], function (err, result) {
            if (err) {
                console.log('Error while performing query.',err)
            } else {
                console.log('edit id = %d -> partner = %d / step1', req.params.id, req.params.partner);

                connection.query('UPDATE user SET matched = 1 WHERE id = ?',[req.params.id], function (err, result) {
                    if (err) {
                        console.log('Error while performing query.',err)
                    } else {
                        console.log('edit id = %d -> partner = %d / step2', req.params.id, req.params.partner);
                        res.redirect('/');
                    }
                })
            }
        })
    })
    app.get('/control/control1', function (req,res) {
        connection.query('ALTER TABLE user AUTO_INCREMENT=1;', function(err,rows){
            if(err)
                console.log('Error while performing query.',err)
            else {
                console.log('ID 재정렬 step1')

                connection.query('SET @COUNT = 0;', function(err,rows){
                    if(err)
                        console.log('Error while performing query.',err)
                    else {
                        console.log('ID 재정렬 step2')

                        connection.query('UPDATE user SET id = @COUNT:=@COUNT+1;', function(err,rows){
                            if(err)
                                console.log('Error while performing query.',err)
                            else {
                                console.log('ID 재정렬 step3')
                                res.redirect('/')
                            }
                        })
                    }
                })
            }
        })
    })
    app.get('/control/control2', function (req,res) {
        connection.query('UPDATE user SET partner = 0', function(err,rows){
            if(err)
                console.log('Error while performing query.',err)
            else {
                console.log('파트너 삭제 step1')

                connection.query('UPDATE user SET matched = 0', function(err,rows){
                    if(err)
                        console.log('Error while performing query.',err)
                    else {
                        console.log('파트너 삭제 step2')
                        res.redirect('/')
                    }
                })
            }
        })
    })
    app.get('/control/control3', function (req,res) {
        var num = sconnection.query('SELECT id from user')
        console.log('클릭')
        for (var count = 0; count < num.length; count++)
        {
            var rows = sconnection.query('SELECT * from user')
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].matched == 0) {
                    for (var j = 0; j < rows.length; j++) {
                        if (rows[j].matched == 0 && rows[j].WIWT == rows[i].WIWL && rows[j].WIWL == rows[i].WIWT) {
                            console.log('/partner/' + i + '/' + j)
                            sconnection.query('UPDATE user SET partner = ' + rows[i].id + ' WHERE id = ' + rows[j].id)
                            console.log('1')
                            sconnection.query('UPDATE user SET matched = 1 WHERE id = ' + rows[j].id)
                            console.log('2')
                            sconnection.query('UPDATE user SET partner = ' + rows[j].id + ' WHERE id = ' + rows[i].id)
                            console.log('3')
                            sconnection.query('UPDATE user SET matched = 1 WHERE id = ' + rows[i].id)
                            console.log('4')
                            break
                        }
                    }
                }
            }
        }

/*






                                    changePartner(rows, i, j, function(res){
                                        end = res
                                        console.log(i+' '+ j + ' 1')
                                    })
                                    end = 0
                                    changePartner(rows, j, i, function(res){
                                        end = res
                                        console.log(i+' '+ j + ' 2')
                                    })
                                    break

        }
        res.redirect('/');
    }

*/
    })
}