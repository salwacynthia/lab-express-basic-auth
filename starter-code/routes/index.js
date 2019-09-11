const express = require('express');
const router  = express.Router();

/* home page e back krche */
  router.get('/', (req, res, next) => {
  res.render('index');

  const user = req.session.user;
  console.log(user);
  res.render('main', {user});
});


// checks the login part
const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next()
    } else {
      res.redirect('/main')
    }
  };
};

router.get('/main', loginCheck(), (req, res, next) => {
  res.render('main');
})

router.get('/private', loginCheck(), (req, res, next) => {
  res.render('private');
})
module.exports = router;
