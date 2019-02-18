var express = require('express');
var router = express.Router();
var logger = require('../winston');

router.get('/login', function (req, res, next) {
  logger.info("GET /process/login 처리중...");

  res.render('login', {
    title: 'Post파라미터 예제 (로그인)'
  });
});

router.post('/login', function (req, res, next) {
  logger.info("POST /process/login 처리중...");

  var id = req.body.id || req.query.id;
  var password = req.body.password || req.query.password;

  logger.info("#### id:" + req.body.id);
  logger.info("#### password:" + req.body.password);

  // res.send("login result. id:" + id + ", password:" + password);

  res.render('login_result', {
    title: '서버에서 응답한 결과',
    id: id,
    password: password
  });
});

router.get('/login/:name', function (req, res) {
  logger.info("GET /process/login/:name 처리중..");

  var queryName = req.query.id;
  var name = req.params.name;

  logger.info("### queryName:" + queryName);
  logger.info("### param name:" + name);

  //  res.send("/login/:name is processed.");
  res.render('login_name', {
    title: 'URL 파라미터 사용 결과',
    name: name
  });
});

router.get('/setUserCookie', function (req, res) {
  logger.info("### /process/setUserCookie called...");

  res.cookie('user', {
    id: 'mike',
    name: '소녀시대',
    authorized: true
  });

  res.redirect('/process/showCookie');
});

router.get('/showCookie', function (req, res) {
  logger.info("### /process/showCookie called...");
  res.send(req.cookies);
});

router.get('/product', function (req, res) {
  logger.info("### /process/product called...");

  if (req.session.user) {
    res.redirect('/product');
  } else {
    res.redirect('/process/login2');
  }
});

router.get('/login2', function (req, res, next) {
  logger.info("GET /process/login2 처리중...");

  res.render('login2', {
    title: '세션을 사용한 로그인 페이지'
  });
});

router.post('/login2', function (req, res, next) {
  logger.info("POST /process/login2 처리중...");

  var id = req.body.id || req.query.id;
  var password = req.body.password || req.query.password;

  logger.info("#### id:" + req.body.id);
  logger.info("#### password:" + req.body.password);

  if (req.session.user) {
    logger.info('이미 로그인되어 상품 페이지로 이동합니다.');
    res.redirect('/product');
  } else {
    req.session.user = {
      id: id,
      name: '트와이스',
      authorized: true
    };
  }

  res.render('login_result2', {
    title: '로그인 성공',
    id: id,
    password: password
  });
});

router.get('/logout', function (req, res) {
  logger.info("POST /process/logout called...");

  if (req.session.user) {
    logger.info("로그아웃합니다.");
    req.session.destroy(function (err) {
      if (err) {
        throw err;
      }

      logger.info("## 세션을 삭제하고 로그아웃되었습니다.");
      res.redirect('/process/login2');
    });
  } else {
    logger.info("아직 로그인되지 않았습니다.");
    res.redirect('/process/login2');
  }
});

module.exports = router;