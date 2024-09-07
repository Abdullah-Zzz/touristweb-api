const model = require("../Schemas/Register")
const jwt = require("jsonwebtoken")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const PASS = process.env.PASS
const EMAIL = process.env.EMAIL
const nodeMailer = require('nodemailer')

const getUser = async (req, res, next) => {
    try {
        const userId = req.id;
        const user = await model.findById(userId, { password: 0, tokens: 0 })
        if (!user) {
            return res.status(404).json("User Doesnot Exists")
        }
        return res.status(200).json(user)

    }
    catch (err) {
        return res.status(500).json('Internal server error ')
    }


}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const chkExists = await model.findOne({ email })
        if (chkExists) {

            const JWT_TOKEN = jwt.sign({ id: chkExists._id, }, JWT_SECRET_KEY, {
                expiresIn: "10min"
            })
            await model.findByIdAndUpdate(chkExists._id, { tokens: [{ token: JWT_TOKEN, signedAt: Date.now().toString() }] })

            const oldTokens = chkExists.tokens

            if (oldTokens) {
                oldTokens.filter(t => {
                    const diff = Date.now() - parseInt(t.signedAt) / 1000
                    if (diff < 600) {
                        return t
                    }
                }
                )
            }

            if (password === chkExists.password) {
                res.setHeader('Set-Cookie', `myCookie=${JWT_TOKEN}; Max-Age=600; Path=/; Secure`);
                res.status(200).json({
                    message: "Logged In",
                    token:JWT_TOKEN
                })

            }
            else {
                res.status(401).json('Incorrect password')
            }
        }
        else if (!chkExists) {
            res.status(404).json('User doesnot exists.')
        }
    }
    catch (err) {
        res.status(500).json("internal server error")
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const data = new model({
            name,
            email,
            password
        });
        const alreadyExists = await model.findOne({ email });

        if (alreadyExists) {
            res.status(409).json('User already exists')
        }
        else {
            await data.validate()
            await data.save()
            res.status(200).json('OK')
        }

    } catch (error) {
        if (err.name === 'ValidationError') {
            return res.status(400).json('Please Enter Correct Data');
        }
        res.status(500).json('Internal server error.');
    }
}

const logout = async (req, res) => {
    try {
        const userID = req.id
        await model.findByIdAndUpdate(userID, { tokens: [] })
        res.clearCookie('myCookie', { path: '/' })
        return res.status(200).json("OK")
    }
    catch (err) {
        res.status(500).json("internal server error")
    }

}
const routeLogin = async (req, res) => {
    try {
        res.status(200).json('not logged in')
    }
    catch (err) {
        res.status(500).json("internal server error")
    }
}
const sendEmail = async (req, res) => {
    try {
        const { email } = req.body
        const userExists = await model.findOne({ email })
        if (!email) {
            res.status(404).json('No Email provided')
        }
        if (!userExists) {
            res.status(404).json('User not found')
        }
        else {
            const token = jwt.sign({ id: userExists._id }, JWT_SECRET_KEY, {
                expiresIn: '1d'
            })
            await model.findByIdAndUpdate(userExists._id, { resetlink: { token: token } })
            const transporter = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    user: EMAIL,    
                    pass: PASS
                }
            })
            const mailOptions = {
                from: EMAIL,
                to: email,
                subject: 'Reset Pass',
                text: `http://localhost:5173/${userExists._id}/${token}`
            }
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    res.status(404).json('Email Not Found')
                }
                else {
                    res.status(200).json('The email will be sent to your account if you are registered with us')
                }
            })
        }
    }
    catch (err) {
        res.status(500).json('Internal server error')
    }
}
const resetPass = async (req, res) => {
    try {
        const { id, token } = req.params
        const { password, confirmPass } = req.body
        let decodeId = String
        if (password && password != confirmPass) {
            return res.status(409).json('Passwords donot matach.')
        }
        else {
            try {
                const user = await jwt.verify(String(token), JWT_SECRET_KEY)
                decodeId = user.id
            } catch (err) {
                return res.status(403).json('Not Authorized')
            }
            const userDetails = await model.findById(decodeId)
            if (!userDetails) {
                return res.status(404).json("Invalid Token, please generate a new reset link.")
            }
            else {
                if (userDetails.resetlink.token == token) {
                    await model.findByIdAndUpdate(id, { password: password })
                    await model.findByIdAndUpdate(id, { resetlink: {} })
                    return res.status(200).json('Password Changed')
                }
                else {
                    return res.status(404).json("Link already used, please generate a new reset link.")
                }

            }
        }
    }
    catch (err) {
        res.status(500).json('Internal server error')
    }
}
const protectRouteResetPass = async (req, res) => {
    try {
        const { id, token } = req.params
        let user = Object
        try {
            user = await jwt.verify(String(token), JWT_SECRET_KEY)
        }
        catch (err) {
            return res.status(401).json('not a valid token')
        }
        if (id == user.id) {
            const userDetails = await model.findById(id) 
            if (Object.keys(userDetails.resetlink).length == 1 && userDetails.resetlink.token == token) {
                return res.status(200).json('OK')
            }
            else {
                return res.status(403).json('Link already used')
            }
        }
        else {
            return res.status(401).json('Invalid id')

        }

    }
    catch (err) {
        return res.status(500).json('internal server error')
    }
}
module.exports = {
    getUser,
    loginUser,
    registerUser,
    logout,
    routeLogin,
    sendEmail,
    resetPass,
    protectRouteResetPass
};
