var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_lishan',
  password        : 'lsSt@9813',
  database        : 'cs290_lishan'
});

module.exports.pool = pool;
