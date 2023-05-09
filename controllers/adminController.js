const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const loadLogin = async(req,res)=>{
    try{

      res.render('login')

    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
  
      const userData = await User.findOne({ email: email }); // add 'await' before User.findOne
  
      if (userData) {
        const passwordMatch = await bcrypt.compare(password, userData.password);
  
        if (passwordMatch) {
          if (userData.is_admin === 0) {
            res.render('login', { snd: 'You are  not an admin ' }); // fix typo (',' instead of '.')
          } else {
            req.session.aduser_id = userData._id;
            res.redirect('/admin/home');
          }
        } else {
          res.render('login', { snd: ' password is incorrect' });
        }
      } else {
        res.render('login', { snd: 'Email or password is incorrect' });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

const loadDashboard = async(req,res)=>{
  try{
    const userData = User.findById({_id:req.session.aduser_id})
    res.render('home',{admin:userData});

  } catch (error){
    console.log(error.message);

  }
}

const logout = async(req,res)=>{
    try{
        req.session.aduser_id=null
        res.redirect('/admin');

    }catch (error){
        console.log(error.message);
    }
}


const adminDashboard = async(req,res)=>{
  try{
    const usersData = await User.find({is_admin:0});
    res.render('dashboard',{users:usersData});

  }catch (error){
    console.log(error.message);
  }
}

// edit user functionality

const editUserload = async(req,res)=>{
  try{
    const id = req.query.id;
    const userData = await User.findById({_id:id});
    if(userData){
      res.render('edit-user',{user:userData});
    }
    else{
      res.redirect('/admin/dashboard')
    }
    res.render('edit-user')

  } catch (error){
    console.log(error.message);
  }
}

// add new user work start

const newUserLoad = async(req,res)=>{
    try{
      res.render('new-user')

    } catch (error){
      console.log(error.message);
    }
}

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};


const addUser = async (req, res) => {
  try {
    if (!req.body.password) {
      throw new Error("Password is required.");
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
      res.render("new-user", {
        message:
          "Your new user has been successfully added.",
      });
    } else {
      res.render("new-user", {
        message: "Adding new user has been failed",
      });
    }
  } catch (error) {
    console.log(error);
  }
};


const updateUsers = async(req,res)=>{
  try{

    const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,is_verified:req.body.verify,}})
    res.redirect('/admin/dashboard');

  } catch (error){
    console.log(error.message);
  }
}

// delete user started

const deleteUser = async(req,res)=>{
  try{

    const id = req.query.id;
     await User.deleteOne({_id:id});
    res.redirect('/admin/dashboard');

  } catch (error){
    console.log(error.message);
  }
}



module.exports ={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    editUserload,
    newUserLoad,
    addUser,
    updateUsers,
    deleteUser
}
