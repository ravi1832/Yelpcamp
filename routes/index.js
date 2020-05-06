var express=require('express');
var router=express.Router();
var passport=require('passport');
var User=require('../models/user');
var middlewareObj=require('../middleware');

// root route
router.get('/',function(req,res){
    res.render('campgrounds/landing');
})

// register route
router.get('/register',function(req,res){
    res.render('register');
})


//register post route
router.post('/register',function(req,res){

var newUser=new User({username:req.body.username});

  User.register(newUser,req.body.password,function(err,user){
      if(err){
         req.flash('error',err.message);
        return res.redirect('/register');
      }
      
        passport.authenticate('local')(req,res,function(){
            req.flash('success','Welcome to Yelpcamp '+user.username);
            res.redirect('/campgrounds');
        });
      
           
  });
});

//login route

router.get('/login',function(req,res){
    res.render('login');
})

router.post('/login',passport.authenticate('local',
{
    successRedirect:'/campgrounds',
    failureRedirect: '/login'
}),
function(req,res){
    
});


router.get('/logout',function(req,res){
    req.logout();
    req.flash('success','Successfully logged out');
    res.redirect('/campgrounds');
})




module.exports=router;