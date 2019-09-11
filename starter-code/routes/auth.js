const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const User = require("../Models/User");

/// render the signup and passrd

router.get("/signup", (req, res) =>{
  res.render("signup.hbs");
});

router.get("/login", (req, res) =>{
  res.render("login.hbs");
});
""
router.post("/signup", (req,res,next)=> {
   const username = req.body.username;
   const password = req.body.password;

   //checking the passwrd
   //checking the username is not empty

   if(password.length < 4){
     res.render("signup", {message: "short passwrd"});
     return;
   }

   if(username === ""){
    res.render("signup", {message: "user name cant be empty"});
    return;
  }

  // chcking the same user name ache kina
  //username:username == looking into the db with thid keyword :the name from line 29
  User.findOne({ username: username }).then(found => {
    if (found !== null) {
      res.render("signup", { message: "This username is already taken" });
    } else {
      // we can create a user with the username and password pair
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then(dbUser => {
          res.redirect("/");
        })
        .catch(err => {
          next(err);
        });
    }
  });

});


router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }).then(found => {
    if (found === null) {
      // no user in the collection has this username
      res.render("login", { message: "Invalid credentials" });
      return;
    }
    if(bcrypt.compareSync(password, found.password)) {
      // password and hash match
    req.session.user = found;
      console.log("login", req.session.user);
      res.redirect("/main");
    } else {
      res.render("login", {
         message: "Invalid credentials" 
        });
    }
  });
});

module.exports = router;