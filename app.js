var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var seedDB=require('./seeds.js');
var Comment=require('./models/comment.js');
var Campground=require('./models/campground.js');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var User=require('./models/user');
var methodOverride=require('method-override');
var flash=require('connect-flash');

var commentRoutes=require('./routes/comments');
var campgroundRoutes=require('./routes/campgrounds');
var indexRoutes=require('./routes/index');

//seedDB();

mongoose.connect('mongodb+srv://ravi1:ravi1@firstcluster-qhq8d.mongodb.net/test?retryWrites=true&w=majority',{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set('view engine','ejs');

app.use(require('express-session')({
    secret:"Once again ravi wins",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride('_method'));

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    next();
});


app.use('/',indexRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds',campgroundRoutes);

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running");
})