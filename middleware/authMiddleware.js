const jwt = require("jsonwebtoken")
const registModel = require("../Schemas/Register")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const chkTokenExists = (req, res, next)=>{
    try{
        const cookie = req.headers.cookie
        if(cookie){
            next();
        }
        else{
            return res.status(404).json('No Token Found, Please Login first')
        }
    }
    catch(err){
        res.status(500).json('Internal server Error, plese refresh or try again later')
    }
}

const verifyToken = (req, res, next) =>{
    try{
        const cookies = req.headers.cookie;
        const token= cookies.split("=")[1]
        if (!token){
            return res.status(404).json('No Token Found')
        }
        else{
            jwt.verify(String(token), JWT_SECRET_KEY, async (err, user)=>{
                if (err){
                    return res.status(401).json('Invalid or expired token,Please login again')
                }
                else{
                    const chkTokenExpired = await registModel.findOne({_id : user.id})
                    if(chkTokenExpired.tokens.length == 1 && chkTokenExpired.tokens[0].token == token){

                        req.id = user.id
                        next();
                    }
                    else{
                        return res.status(401).json('Invalid or expired token, Please login again')
                    }
                }
            })
        }
    }
    catch(err){
        res.status(404).json({})
    }
}


module.exports = {
    chkTokenExists,
    verifyToken
};