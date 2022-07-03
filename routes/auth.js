const router = require('express').Router();
const User = require('../model/User')
const md5 = require('md5')
const { registerValidation, loginValidation, addProductValidation, updateProductValidation } = require('../validation')
const jwt = require('jsonwebtoken')


//regsitration route
router.post('/registration', (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) {
        res.send(error.details[0].message);
    }
    else {
        User.findOne({ email: req.body.email }, (error, foundUser) => {
            if (foundUser) {
                res.status(200).send("user already exists");
            } else {
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: md5(req.body.password),
                    place: req.body.place
                })
                newUser.save();
                res.status(201).send("successfully registered")
            }
        })
    }
})

//login route
router.post('/login', (req, res) => {
    const { error } = loginValidation(req.body)

    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        User.findOne({ email: req.body.email }, (error, foundUser) => {
            if (error) {
                res.send(error)
            }
            else {
                if (foundUser) {
                    if (foundUser.password === md5(req.body.password)) {
                        const id = { id: foundUser.id }
                        const accessToken = jwt.sign(id, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                        const refreshToken = jwt.sign(id, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

                        foundUser.tokens.push(refreshToken)
                        foundUser.save();
                        res.cookie('jwt', refreshToken, { httpOnly: true });
                        res.status(200).send(accessToken);


                    }
                    else {
                        res.status(400).send("Invalid password")
                    }
                }
                else {
                    res.status(401).send("User doesnot exist ")
                }
            }
        })
    }
})


module.exports = router;