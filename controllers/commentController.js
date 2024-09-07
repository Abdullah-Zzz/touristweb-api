const schema = require('../Schemas/comments')
const userModel = require('../Schemas/Register')
const tripSchema = require('../Schemas/trips')

const addComment = async (req, res) => {
    try {
        const id = req.params.id
        const { comment, rating } = req.body
        if (!comment) return res.status(404).json('No comment Found');
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; 
        let dd = today.getDate();
        const userID = req.id
        const userDetails = await userModel.findById(userID)
        const chkTripExits = await tripSchema.findOne({ "mainData.packages.id": id })
        if (chkTripExits) {
            const chkComments = await schema.findOne({ id })
            if (chkComments) {
                await schema.findByIdAndUpdate(chkComments._id, { $push: { comments: [{ comment: comment, createdBy: userDetails.name, createdAt: `${dd}/${mm}/${yyyy}`, rating: rating }] } }, { new: true })
                res.status(200).json("Comment Added")
            }
            else {
                const newComment = new schema({ id, comments: [{ comment: comment, createdBy: userDetails.name, createdAt: `${dd}/${mm}/${yyyy}`, rating: rating }] })
                await newComment.validate()
                await newComment.save()
                return res.status(200).json("Comment Added")
            }
        }
        else {
            return res.status(404).json("invalid id")
        }
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json('Please Enter Correct Data');
        }
        else return res.status(500).json('internal server error')
    }
}

const getComments = async (req, res) => {
    const id = req.params.id
    const chkComments = await schema.findOne({ id })
    if (chkComments) {
        res.status(200).json(chkComments)
    }
    else {
        res.status(404).json('No comments')
    }
}

module.exports = {
    addComment,
    getComments
}