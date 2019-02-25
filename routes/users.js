var express = require('express');
var router = express.Router();
var logger = require('../winston');
var database;

var init = function (db) {
  database = db;
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/login_using_mongodb', function (req, res) {
  logger.info("### /users/login_using_mongodb called...");
  res.render('login_using_mongodb', {
    title: 'MongoDB 이용한 로그인',
  });
});

var authUser = function (database, id, password, callback) {
  logger.info("## authUser called..");

  var users = database.collection('users');

  users.find({
    "id": id,
    "password": password
  }).toArray(function (err, docs) {
    if (err) {
      callback(err, null);
      return;
    }

    if (docs.length > 0) {
      logger.info(`## 아이디 [${id}], 비밀번호 [${password}] 가 일치하는 사용자 찾음.`);
      callback(null, docs);
    } else {
      logger.info("## 일치하는 사용자 찾지 못함.");
      callback(null, null);
    }
  });
}

router.post('/login_using_mongodb', function (req, res) {
  logger.info("### POST /users/login_using_mongodb called...");

  var id = req.body.id;
  var passwd = req.body.password;
  logger.info(`## id [${id}], passwd [${passwd}]`);

  if (database) {
    authUser(database, id, passwd, function (err, docs) {
      if (err) {
        throw err;
      }

      if (docs) {
        logger.info(`${JSON.stringify(docs)}`);

        res.render('login_success_using_mongodb', {
          title: 'mongodb 이용하여 로그인 성공',
          id: id,
          name: docs[0].name
        });
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h1>로그인 실패</h1>');
        res.write('<div><p>아이디와 비밀번호를 다시 확인하세요.</p></div>');
        res.write("<br><br><a href='/users/login_using_mongodb'>다시 로그인하기</a>");
        res.end();
      }
    });
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/html;charset=utf8'
    });
    res.write('<h2>데이터베이스 연결 실패</h2>');
    res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
    res.end();
  }
});

// 사용자를 추가하는 함수 
var addUser = function (database, id, password, name, callback) {
  logger.info(`addUser 호출됨:${id}, ${password}, ${name}`);

  var users = database.collection('users');

  users.insertMany([{
    "id": id,
    "password": password,
    "name": name
  }], function (err, result) {
    if (err) {
      callback(err, null);
      return;
    }

    if (result.insertedCount > 0) {
      logger.info(`사용자 레코드 추가됨 : ${result.insertedCount}`);
    } else {
      logger.info("추가된 레코드 없음.");
    }
    callback(null, result);
  });
}

// 사용자 추가 라우팅 
router.get('/addUser', function (req, res) {
  logger.info("### /users/addUser called...");
  res.render('addUser');
});

router.post('/addUser', function (req, res) {
  logger.info('POST /users/addUser 호출됨.');

  var id = req.body.id;
  var password = req.body.password;
  var name = req.body.name;

  logger.info(`요청 파라미터: ${id}, ${password}, ${name}`);

  if (!database) {
    res.writeHead(200, {
      'Content-Type': 'text/html;charset=utf8'
    });
    res.write('<h2>데이터베이스 연결 실패</h2>');
    res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
    res.end();
  }

  addUser(database, id, password, name, function (err, result) {
    if (err) {
      throw err;
    }
    if (result && result.insertedCount > 0) {
      logger.info(`${JSON.stringify(result)}`);

      res.writeHead(200, {
        'Content-Type': 'text/html;charset=utf8'
      });
      res.write('<h2>사용자 추가 성공</h2>');
      res.end();
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html;charset=utf8'
      });
      res.write('<h2>사용자 추가 실패</h2>');
      res.end();
    }
  });
});

module.exports = router;
module.exports.init = init;