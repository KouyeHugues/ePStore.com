const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.newUser = (req, res, next) => {
    if(req.method == "POST"){
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.redirect('/users'))
                .catch(error => res.status(400).json({
                    error
                }))
        })
        .catch(error => res.status(500).json({
            error
        }))
    } else{
        res.render('user/new_html', {title: "Nouvel utilisateur"})
       }
    
};

module.exports.getOneUser = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({
            "ID unknown": req.params.id
        })
    }
   if(req.method == "GET"){
    User.findOne({
        _id: req.params.id
    })
    .then(user => {
        res.send(user),
        res.redirect('/users')})
    .catch(error => res.status(404).json({
        error
    }))
   }
};
// .select("-password");

module.exports.getAllUsers = (req, res, next) => {
    if(req.method == "GET"){
    User.find()
        .then(users => res.render('user/index_html', { users}))
        .catch(error => res.status(400).json({
            error
        }))
    }


};

module.exports.updateUser = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({
            "ID unknown": req.params.id
        })
    }
    if(req.method == "POST"){
    User.updateOne({
            _id: req.params.id
        }, {
            ...req.body,
            _id: req.params.id
        })
        .then(() => res.redirect("/users"))
        .catch(error => res.status(400).json({
            error
        }))
    } else{
        res.render('user/edit_html', {title: "Nouvel utilisateur"})
       }
};

module.exports.deleteUser = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({
            "ID unknown": req.params.id
        })
    }
    if( req.method == "GET"){
        User.deleteOne({
            _id: req.params.id
        })
        .then(() => res.redirect("/users"))
        .catch(error => res.status(400).json({
            error
        }))
    }
};