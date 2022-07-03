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
                        ACCESS_TOKEN_SECRET = '172c6ea01f5b1e5e2e2d25813175ef788d26e873096a2fa6e4956a66119851a905f917b63ffe672889d67521240a4f272da2ef6a3ca87ea287e03596926787ec'
                        REFRESH_TOKEN_SECRET = '96ea520fceff48464581a7753f4f828c49d1dc333afb92220015bdfbc15c0676bc5662ee00d65e812c6f69ecac2f1a029d93127105d9a618b10eb8d45c4b8e4f'

                        const accessToken = jwt.sign(id, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                        const refreshToken = jwt.sign(id, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

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