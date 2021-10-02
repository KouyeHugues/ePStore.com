const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('../routes/user.route');

module.exports.register = (req, res, next) => {

    if (req.method == "POST") {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.redirect('/users/login'))
                .catch(error => res.status(400).json({
                    error
                }))
        })
        .catch(error => res.status(500).json({
            error
        }))
    } else {
        res.render('user/register_html', {
            title: "Insciption",
            msg: "Veuillez entrer vos informations"
        })
    }
};

module.exports.login = (req, res, next) => {
    if (req.method == "POST") {
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (!user) {
                return res.render('user/login_html', {msg: "Utilisateur non trouvé"})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.render('user/login_html', {msg: "Mot de passe incorrect !"})
                    }
                    res.redirect('/applications/home')
                    res.status(200).json({
                        userID: user._id,
                        token: jwt.sign({
                                userID: user._id
                            },
                            process.env.TOKEN_SECRET, {
                                expiresIn: "24h"
                            }
                        )
                    })
                    
                    
                })
                .catch(error => res.status(500).json({
                    error
                }))
        })
        .catch(error => res.status(500).json({
            error
        }))
    } else {
        res.render('user/login_html', {
            title: "Connexion",
        })
    }
};

module.exports.logout = (req, res) => {
    if(req.method == 'GET'){
        res.status(200).json({
            token: jwt.sign({
                },
                process.env.TOKEN_SECRET, {
                    expiresIn: "1"
                }
            )
        })
    res.redirect('/applications/home');
    }
    
};