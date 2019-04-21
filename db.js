const mongoose = require('mongoose');

exports.connect = (url, done) => {
  mongoose.connect(url, { useCreateIndex: true, useNewUrlParser: true }).then(
    () => done(),
    err => done(err)
  );
};