require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../model/User')


const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;

    if (!cookies) {
        res.sendStatus(401);
    }
    else {
        if (!cookies.jwt) {
            res.sendStatus(401);
        } else {

            const refreshToken = cookies.jwt;
            jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    res.sendStatus(403);

                } else {
                    id = decoded.id

                    User.findById(id, (err, foundUser) => {
                        if (!foundUser) {
                            res.sendStatus(401);
                        } else {
                            if (!foundUser.tokens) {
                                res.sendStatus(401)
                            } else {

                                const tokens = [...foundUser.tokens];


                                if (tokens.includes(refreshToken)) {
                                    const accessToken = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

                                    res.send(accessToken)
                                }

                            }
                        }
                    })
                }

            });


        }
    }


}

module.exports = { handleRefreshToken }
