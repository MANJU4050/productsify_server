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
            REFRESH_TOKEN_SECRET = '96ea520fceff48464581a7753f4f828c49d1dc333afb92220015bdfbc15c0676bc5662ee00d65e812c6f69ecac2f1a029d93127105d9a618b10eb8d45c4b8e4f'
            jwt.verify(refreshToken,REFRESH_TOKEN_SECRET, (err, decoded) => {
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
                                    ACCESS_TOKEN_SECRET = '172c6ea01f5b1e5e2e2d25813175ef788d26e873096a2fa6e4956a66119851a905f917b63ffe672889d67521240a4f272da2ef6a3ca87ea287e03596926787ec'
                                    const accessToken = jwt.sign({ id: id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

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
