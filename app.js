var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
app.use('/js', express.static('static/js'));
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support url encoded bodies

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9813);

app.get('/',function(req,res){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      res.status(500);
      res.render('500');
      return;
    }
    for (var i in rows) {
      rows[i].date = dateFormat(rows[i].date, "mm-dd-yyyy");
      rows[i].unit = rows[i].lbs ? 'lbs' : 'kg';
    }
    context.records = rows;
    res.render('home', context);
  });
});

app.post('/',function(req,res){
  var results = {};
  var isLbs = false;
  if (req.body['unit'] == 'lbs') {
    isLbs = true;
  }

  if (req.body['op'] == "delete") {
    mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.body['id']], function(err, result){
    if(err){
      next(err);
      results.status = "failed";
      results.message = "DB Delete Failed with id " + req.body['id']; 
    } else {
      results.status = "success";
    }
    res.status(200).json(results);
  });
  } else if (req.body['op'] == "update") {
    mysql.pool.query("UPDATE workouts set `name` = ?,`reps` = ?,`weight` = ?,`date` = now(), `lbs` = ? WHERE id= ?", [req.body['name'],req.body['reps'],req.body['weight'],isLbs, req.body['id']], function(err, result){
      if(err){
        next(err);
        results.status = "failed";
        results.message = "DB Update Failed with id " + req.body['id']; 
      } else {
        results.status = "success";
        results.data = {};
        results.data.id = req.body['id'];
        results.data.name = req.body['name'];
        results.data.reps = req.body['reps'];
        results.data.weight = req.body['weight'];
        results.data.unit = req.body['unit'];
        results.data.date = dateFormat(new Date(), "mm-dd-yyyy");
      }
      res.status(200).json(results);
    });
  } else if (req.body['op'] == "insert") {
    mysql.pool.query("INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?,?,?,now(),?)", [req.body['name'],req.body['reps'],req.body['weight'],isLbs], function(err, result){
      if(err){
        next(err);
        results.status = "failed";
        results.message = "DB Insert Failed.";
      } else {
        results.status = "success";
        results.data = {};
        results.data.id = result.insertId;
        results.data.name = req.body['name'];
        results.data.reps = req.body['reps'];
        results.data.weight = req.body['weight'];
        results.data.unit = req.body['unit'];
        results.data.date = dateFormat(new Date(), "mm-dd-yyyy");
      }
      res.status(200).json(results);
    });
  } else {
    results.status = "failed";
    results.message = "Unsupported oporation.";
    res.status(200).json(results);
  }
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.hasResults = true;
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
