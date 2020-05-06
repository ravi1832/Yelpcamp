var express=require('express');
var router=express.Router({mergeParams:true});
var Campground=require('../models/campground');
var Comment=require('../models/comment');
var middlewareObj=require('../middleware');
//comments new

router.get('/new',middlewareObj.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render('comments/new',{campground:campground});
        }
    })
   
})



router.post('/',middlewareObj.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
               if(err){
                   req.flash('error','Something went wrong');
                   console.log(err)
               }
               else{
                   comment.author.id=req.user._id;
                   comment.author.username=req.user.username;
                   comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success','Successfully added comment');
                    res.redirect('/campgrounds/'+campground._id);
               }
           })
        }
    })
})



router.get('/:comment_id/edit',middlewareObj.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err || !foundCampground){
            req.flash('error','Campground not found');
            res.redirect('back');
        }
        else{
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if(err){
                    req.redirect('back');
                }
                else{
                    res.render('comments/edit',{comment:foundComment,campground_id:req.params.id});
                }
            })
        }
    })
    
        
    });

router.put('/:comment_id',middlewareObj.checkCommentOwnership,function(req,res){
   
        Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err){
            if(err){
                req.redirect('/');
            }
            else{
               res.redirect('/campgrounds/'+req.params.id);
            }
        })
            
        });
        

router.delete('/:comment_id',middlewareObj.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            req.flash('success','Comment deleted');
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
})



module.exports=router;