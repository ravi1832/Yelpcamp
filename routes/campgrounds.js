var express=require('express');
var router=express.Router({mergeParams:true});
var Campground=require('../models/campground');
var Comment=require('../models/comment');
var middlewareObj=require('../middleware');



router.get('/',function(req,res){

       

     Campground.find({},function(err,allCampgrounds){
         if(err){
             console.log(err);
         }
         else{
            res.render('campgrounds/index',{campgrounds: allCampgrounds});
         }
     });
    
});

router.get('/new',middlewareObj.isLoggedIn,function(req,res){

    res.render('campgrounds/new');
});



router.get('/:id',function(req,res){

    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err || !foundCampground){
          req.flash('error','Campground not found');
          res.redirect('back');
       } 
       else{
          
        res.render('campgrounds/show',{campground:foundCampground });
       }
    })
   
})

router.post('/',middlewareObj.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.url;
    var price=req.body.price;
    var description=req.body.description;
    var author={
        id:req.user._id,
        username: req.user.username
    }
    var newCampground={name: name,image: image,price:price,description: description,author:author};
    Campground.create(
        newCampground
        ,function(err,campground){
            if(err){
                console.log(err)
            }
            else{
                res.redirect('/campgrounds');
            }
        }
    );
    
});

//edit campground

router.get('/:id/edit',middlewareObj.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,found){
        if(err || !found){
            req.flash('error','Campgrond Not found');
            res.redirect('back');
        }
        else{
            res.render('campgrounds/edit',{campground:found});
        }
    })
  
})

router.put('/:id',middlewareObj.checkCampgroundOwnership,function(req,res){
    
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
       if(err){
           res.redirect('/campgrounds');
       }
       else{
           res.redirect('/campgrounds/'+ req.params.id );
       }
   })
});

//destroy
router.delete('/:id',middlewareObj.checkCampgroundOwnership,function(req,res){

    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect('/campgrounds');
        }
    });
    res.redirect('/campgrounds');

})







module.exports=router;