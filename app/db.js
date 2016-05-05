var mongodb = require('mongodb'),
  // 数据库连接缓存
  cache = {};

function connect(url, options) {
  var fns = [],
    status = 0,
    _db = cache[url];
  return function(f) {
    if (_db !== null && typeof _db === 'object') {
      f.call(null, _db);
      return;
    }
    fns.push(f);
    // 当有一个连接初始化请求时，挂起其他初始化请求
    // 连接池建立完后，使用该连接处理挂起的请求
    if (status === 0) {
      status = 1;
      mongodb.MongoClient.connect(url, options, function(err, db) {
        if (err) {
          throw err;
        }
        _db = cache[url] = db;
        for (var i = 0, len = fns.length; i < len; i++) {
          fns.shift().call(null, _db);
        }
      });
    }
  };
}

module.exports.connect = connect;
