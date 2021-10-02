const Comment = require('../models/comment.model');
const Application = require('../models/application.model');
const ObjectID = require('mongoose').Types.ObjectId;
const { json } = require('body-parser');

module.exports.newComment = (req, res, newt) =>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).json({"ID unknown": req.params.id})
    }

    if( req.method == "POST"){
        const comment = new Comment(
            {
                commentPseudo: req.body.commentPseudo,
                message: req.body.message
            }
        )
       try {

            comment.save()
                .then(() => res.redirect('/applications/home'))
        
            Application.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        comments: comment._id
                    }
                },
                {new: true},
                (error, docs) =>{
                    if(!error) res.status(201)
                }

            )

       } catch (error) {
           console.log(error)
            //res.status(400).send(error);
       }

    }
    else{
        return res.render('comment/new_html', {title: "Nouveau commentaire"})
    }

};

module.exports.updateComment = (req, res, next) =>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).json({"ID unknown": req.params.id})
    }

    if(req.method == "POST"){
    try {
            const commentupdated = {
                message: req.body.message
            }
            Comment.findByIdAndUpdate(
                req.params.id,
                {
                    $set: commentupdated
                },
                {new: true},
                () =>{
                    res.redirect('/applications/all-comments')
                }
            )
    } catch (error) {
        console.log(error)
        //res.status(400).json({error})
    }
    }
    else{
        return res.render('comment/edit_html', {title:"Modification du commentaire"})
    }
};

module.exports.allComment = (req, res, next) =>{
    if(req.method == "GET"){
        Comment.find((error, comments) =>{
            if(!error){
                res.render('comment/index_html', {comments})
            }else{
                res.status(404).json({ error})
            }
        })}
};  

module.exports.getOneComment = (req, res, next)=>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).json({"ID unknown": req.params.id})
    }
    if(req.method == 'GET'){
        Comment.findById(
            req.params.id,
            (error, comment)=>{
                if(!error){
                    res.render('comment/home_html', {comment})
                }else{
                    res.send(error)
                }
            }
        )
    }
    
};

module.exports.deleteComment = (req, res, next) =>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).json({"ID unknown": req.params.id})
    }

    if(req.method == "GET"){
        try {
             Comment.findByIdAndRemove(
                 req.params.id,
                 (error, comment) =>{
                     if(!error) commentDelete(comment._id);
                 }
             )
             const commentDelete= (commentId) => Application.findByIdAndUpdate(
                 req.params.id,
                 {$pull: {
                     comments: commentId
                 }},
                 {new: true},
                 (error ) =>{
                     if(!error)  res.redirect('/applications/all-comments')
                 }
             )

        } catch (error) {
            console.log(error)
            //res.status(500).json({ error })
        }
    }
}