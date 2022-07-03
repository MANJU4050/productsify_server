require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../model/User')


const handleLogout = (req, res) => {

    const cookies = req.cookies;
    
    if (!cookies) {
        res.sendStatus(204);
    } else {
       
        if (!cookies.jwt) {
            res.sendStatus(204);
        } else {
            const refreshToken = cookies.jwt;
           
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    res.sendStatus(204);
                } else {
                   
                    const id = decoded.id;
                    User.findById(id, (err, foundUser) => {
                       

                        if (foundUser) {
                            if (foundUser.tokens.length > 0) {
                                const filteredTokens = foundUser.tokens.filter(tkn => { tkn !== refreshToken })
                                foundUser.tokens = filteredTokens;
                                foundUser.save();
                                res.clearCookie('jwt', { httpOnly: true });
                                return res.sendStatus(204);
                            } else {
                                res.clearCookie('jwt', { httpOnly: true });
                                return res.sendStatus(204);
                            }
                        }else{
                            res.clearCookie('jwt', { httpOnly: true });
                                return res.sendStatus(204);

                        }

                    })


                }

            });

        }
    }


}

module.exports = { handleLogout }