const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const randormstring = require("randomstring");

const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};
const insertUser = async (req, res) => {
  try {

    if (!req.body.password) {
      throw new Error("Password is required.");
    }

    const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.render("registration", {
            messege:"Email already registered",
          });
        }
        if(!req.body.name || req.body.name.trim().length === 0) {
          return res.render("registration", {
              messege: "Please Enter valid name",
          });
        }
       
 

    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mno,
      password: spassword,
      is_admin: 0,
    });


    console.log(user);
    const userData = await user.save();
    
    

    if (userData) {
      res.render("registration", {
        messege1:
          "Your registration has been successful.",
      });
    } else {
      res.render("registration", {
        message: "Your registration has been failed",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// login user method started

const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        req.session.user_id = userData._id;
        res.redirect("/home");
      } else {
        res.render("login", { message: "pasword is incorrect" });
      }
    } else {
      res.render("login", { message: "email and pasword is incorrect" });
    }
  } catch (error) {
    console.log(error);
  }
};

const loadHome = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = async (req, res) => {
  try {
    req.session.user_id=null;
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};



module.exports = {
  loadRegister,
  insertUser,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout
 
};
