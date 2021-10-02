const Application = require('../models/application.model');
const Uder = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');
const {
    promisify
} = require('util');
const pipeline = promisify(require('stream').pipeline);


//Application controller

module.exports.newAppl = (req, res, next) => {
    if (req.method == "POST") {
    let fileName;

    if (req.file !== null) {
        try {
            if (
                req.file.detectedMimeType != "image/jpg" &&
                req.file.detectedMimeType != "image/png" &&
                req.file.detectedMimeType != "image/jpeg"
            )
                throw Error("invalid file");

            if (req.file.size > 2000000) throw Error("max size");
        } catch (error) {
            return res.status(400).json({
                error
            });
        }
        fileName = req.body.title + Date.now() + ".jpg";

        pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../public/upload/${fileName}`
            )
        );
    }

    const newAppl = new Application({
        title: req.body.title,
        codeName: req.body.codeName,
        link: req.body.link,
        description: req.body.description,
        viewed: [],
        screenshot: req.file !== null ? "./upload/" + fileName : "",
        author: req.body.author,
        reason: req.body.reason,
        mentor: req.body.mentor,
        download: req.body.download,
        visitor: [],
        comment: [],
        category: req.body.category,
        quality: req.body.quality
    });
    try {
        newAppl.save()
        return res.redirect('/applications/index')
    } catch (error) {
        return res.status(400).json({
            error
        })
    }
   }
   else{
    res.render('application/new_html', {title: "Nouvelle application"})
   }
};

module.exports.getOneAppl = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({
            "ID unknown": req.params.id
        })
    }

    if(req.method == "GET"){
        Application.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.render('application/show_html', {docs})
            } else {
                res.status(404).json({
                    err
                })
            }
        },
    
        Application.findByIdAndUpdate(
            req.params.id, {
                $addToSet: {
                    viewed: req.body.id
                }
            }, {
                new: true
            },
            (err, docs) => {
                if (!err) {
                    res.render('application/show_html', {docs})
                } else {
                    res.status(400).send(err)
                }
            }
        )
        )
    }

};

module.exports.updateAppl = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({
            "ID unknown": req.params.id
        })
    }
     if(req.method == "POST"){
        let fileName;

    if (req.file !== null) {
        try {
            if (
                req.file.detectedMimeType != "image/jpg" &&
                req.file.detectedMimeType != "image/png" &&
                req.file.detectedMimeType != "image/jpeg"
            )
                throw Error("invalid file");

            if (req.file.size > 2000000) throw Error("max size");
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                error
            });
        }
        fileName = req.body.title + Date.now() + ".jpg";

        pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../public/upload/${fileName}`
            )
        );
    }


        const updatedRecord = {
            title: req.body.title,
            codeName: req.body.codeName,
            link: req.body.link,
            description: req.body.description,
            author: req.body.author,
            reason: req.body.reason,
            mentor: req.body.mentor,
            download: req.body.download,
            category: req.body.category,
            quality: req.body.quality,
            screenshot: req.file !== null ? "./upload/" + fileName : ""
        }
        Application.findByIdAndUpdate(
            req.params.id, {
                $set: updatedRecord
            }, {
                new: true
            },
            (err, docs) => {
                if (!err) res.redirect('/applications/index')
                else  res.status(400).json({
                    err
                })
    
            }
        )
    } 
    else{
        res.render('application/edit_html', {title: "Modification de l'application"})
       }
};

module.exports.getAllAppl = (req, res, next) => {
    if(req.method == "GET"){
        Application.find((err, docs) => {
            if (!err) {
                res.render('application/index_html', {docs})
            } else {res.status(400).json({err})
            }
        }).sort({createdAt: -1})
    
    }
   
};

module.exports.getAllApplHome = (req, res, next) => {
    if(req.method == "GET"){
        Application.find((err, docs) => {
            if (!err) {
                res.render('application/home_html', {docs})
            } else {res.status(400).json({err})
            }
        }).sort({createdAt: -1})
    
    }
   
};

module.exports.deleteAppl = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({
            "ID unknown": req.params.id
        })
    }
    if(req.method == "GET"){
        Application.findByIdAndRemove(
            req.params.id,
            (err, docs) => {
                if (!err) {
                    res.redirect("/applications/index")
                } else {
                    res.status(400).json({
                        err
                    })
                }
            }
        )
    }
    

};

module.exports.viewed = (req, res, newt) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({
            "ID unknown": req.params.id
        })
    }

    if(req.method == "GET"){
        try {
            Application.findByIdAndUpdate(
                req.params.id, {
                    $addToSet: {
                        viewed: req.body.id
                    }
                }, {
                    new: true
                },
                (err, docs) => {
                    if (!err) {
                        res.send(docs)
                    } else {
                        res.status(400).send(err)
                    }
                }
            )
        } catch (error) {
            return res.status(400).send(error)
        }
    }
   

};

module.exports.visitor = (req, res, newt) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({
            "ID unknown": req.params.id
        })
    }
    if(req.method == "GET"){
        try {
            Application.findByIdAndUpdate(
                req.params.id, {
                    $addToSet: {
                        visitor: req.body.id
                    }
                }, {
                    new: true
                },
                (err, docs) => {
                    if (!err) {
                        res.send(docs)
                    } else {
                        res.status(400).send(err)
                    }
                }
            )
        } catch (error) {
            return res.status(400).send(error)
        }
    }
    

};


//comment-Appl controller
// module.exports.commentAppl = (req, res, next) => {
//     if (!ObjectID.isValid(req.params.id)) {
//         return res.status(400).json({
//             "ID unknown": req.params.id
//         })
//     }
//     if(req.method== "POST"){
//         Application.findByIdAndUpdate(
//             req.params.id, {
//                 $push: {
//                     comments: {
//                         commenterId: req.body.commenterId,
//                         commenterPseudo: req.body.commenterPseudo,
//                         text: req.body.text,
//                         timestamps: new Date().getTime()
//                     }
//                 }
//             }, {
//                 new: true
//             },
//             (err, docs) => {
//                 if (!err) res.status(201).json({message: "Commentaire envoyé!"})
//                 else res.send(err)
//             }
//         )
//     }else{
//         res.render('application/comment_html')
//     }
// };

// module.exports.updateCommentAppl = (req, res, next) => {
//     if (!ObjectID.isValid(req.params.id)) {
//         return res.status(400).json({
//             "ID unknown": req.params.id
//         })
//     }
//     if(req.method == "POST"){    
//         try {
//             return Application.findById(req.params.id, (err, docs) => {
//                 const theComment = docs.comments.find((comment) =>
//                     comment._id.equals(req.body.commentId)
//                 );
    
//                 if (!theComment) return res.status(404).send("Comment not found");
//                 theComment.text = req.body.text;
    
//                 return docs.save((err) => {
//                     if (!err) return res.status(200).send(docs);
//                     return res.status(500).send(err);
//                 });
//             });
//         } catch (err) {
//             return res.status(400).send(err);
//         }
//     }
//     else{
//         res.render('application/edit-comment_html')
//     }
// };

// module.exports.deleteCommentAppl = (req, res, next) => {
//     if (!ObjectID.isValid(req.params.id)) {
//         return res.status(400).json({
//             "ID unknown": req.params.id
//         })
//     }
//    if(req.method == "GET"){
//     try {
//         return Application.findByIdAndUpdate(
//             req.params.id, {
//                 $pull: {
//                     comments: {
//                         _id: req.body.commentId
//                     }
//                 }
//             }, {
//                 new: true
//             },
//             (err, docs) => {
//                 if (!err) res.status(201).json({
//                     message: "Commentaire supprimé!"
//                 })
//                 else res.send(err)
//             }
//         )
//     } catch (error) {
//         res.send(error)
//     }
//    }

// };