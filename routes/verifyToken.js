const jwt = require('jsonwebtoken');
require('dotenv').config();

const verify =  (req, res, next) =>{
    

    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    ACCESS_TOKEN_SECRET = '172c6ea01f5b1e5e2e2d25813175ef788d26e873096a2fa6e4956a66119851a905f917b63ffe672889d67521240a4f272da2ef6a3ca87ea287e03596926787ec'
    jwt.verify(token,ACCESS_TOKEN_SECRET,
        (err, decoded)=>{
            if(err) return res.sendStatus(403); //Invalid token
            req.user= decoded;
            next(); 
        })
 
}

module.exports = {verify}
