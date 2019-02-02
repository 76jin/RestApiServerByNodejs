var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.send('respond in sample directory.');
  res.render('sample/index', {
    title: 'Express sample',
    url_home: 'sample/index'
  });
});

router.get('/param-name', function (req, res, next) {
  var paramName = req.query.name;

  res.render('sample/param-name', {
    title: 'Get 파라미터 예제',
    name: paramName
  });
});

module.exports = router;