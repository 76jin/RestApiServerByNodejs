var express = require('express');
var router = express.Router();

router.get('/login', function (req, res, next) {
  console.log("GET /process/login 처리중...");

  res.render('login', {
    title: 'Post파라미터 예제 (로그인)'
  });
});

router.post('/login', function (req, res, next) {
  console.log("POST /process/login 처리중...");

  var id = req.body.id || req.query.id;
  var password = req.body.password || req.query.password;

  console.log("#### id:", req.body.id);
  console.log("#### password:", req.body.password);

  // res.send("login result. id:" + id + ", password:" + password);

  res.render('login_result', {
    title: '서버에서 응답한 결과',
    id: id,
    password: password
  });
});

router.get('/login/:name', function (req, res) {
  console.log("GET /process/login/:name 처리중..");

  var queryName = req.query.id;
  var name = req.params.name;

  console.log("### queryName:", queryName);
  console.log("### param name:", name);

  //  res.send("/login/:name is processed.");
  res.render('login_name', {
    title: 'URL 파라미터 사용 결과',
    name: name
  });
});

router.get('/setUserCookie', function (req, res) {
  console.log("### /process/setUserCookie called...");

  res.cookie('user', {
    id: 'mike',
    name: '소녀시대',
    authorized: true
  });

  res.redirect('/process/showCookie');
});

router.get('/showCookie', function (req, res) {
  console.log("### /process/showCookie called...");
  res.send(req.cookies);
});

module.exports = router;