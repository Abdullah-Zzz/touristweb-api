const tripModel = require("../Schemas/trips")
const reservationModel = require("../Schemas/reservation")
const customPackgeModel =  require("../Schemas/customTrip")
const registModel =  require("../Schemas/Register")
const customPackageReservationSchema = require("../Schemas/customPackageReservation")
const { ObjectId } = require('mongoose').Types;

const tripsRequest= async (req, res, next) =>{
    try
    {const tours =  await tripModel.find()
    res.status(200).json(tours)}
    catch(err){
        return res.status(500).json("Internal Server Error");
    }
} 
const tripInfo = async (req, res)=>{

    const {productId, packageId} = req.params;
    try{
        const data = await tripModel.findOne({"mainData.packages.id":packageId},{"mainData.packages.$" :1})
        if(data){
            res.status(200).json(data)
        }       
        else{
            res.status(404).json("not Found")
        }
    }
    catch(err){
        return res.status(500).json("Internal Server Error");    }   

    
}
const booked = async (req,res) =>{
    try{
    const {name, number, people, packageName,transportation,date} = req.body;
    const userInfo = await registModel.findById(req.id)
    const data = new reservationModel({
        email:userInfo.email,
        name:name,
        number:number,
        people: people,
        packageName :packageName,
        transportation :transportation,
        date:date
    });
        if(!name || !number || !people || !packageName || !transportation){
            res.status(404).json("Invalid Input")
        }
        else{
            const isReserved = await reservationModel.findOne({number : number})
            if(isReserved && isReserved.packageName == packageName){
                res.status(409).json("already reserved using this number")
            }
            else{
                await data.validate()
                await data.save()
                res.status(200).json("Booked!")
            }
        } 
    }
    catch(err){
        if (err.name === 'ValidationError') {
            return res.status(400).json('Please Enter Correct Data');
        }
        return res.status(500).json("Internal Server Error");    
    }
}
const packages = async (req, res) =>{
    try{

        const {productId } = req.params;
        const data =  await tripModel.findOne({"mainData.id":productId},{"mainData.$" :1})
        if (data){
            res.status(200).json(data)
        }
        else{
            res.status(404).json("not Found")
        }
    }
    catch(err){
        return res.status(500).json("Internal Server Error");
    }
     
}
const toursInProvince = async (req,res) =>{
    const {productId} = req.params;
    try{
        const data = await tripModel.findOne({_id : productId})
        if(data){
            res.status(200).json(data)
        }
        else{
            res.status(404).json("not found")
        }
    }
    catch(Err){
        return res.status(500).json("Internal Server Error");
    }
}
const CustomPackageData = async (req,res) =>{
    try{
    const data = await customPackgeModel.find()
    res.status(200).json(data)
    }
    catch(err){
        return res.status(500).json("Internal Server Error");
    }

}
const CustomPackageReservation = async(req,res) => {
    try{
        const {userInfo, packageInfo} = req.body
        const userDetails = await registModel.findById(req.id)
        userInfo['email'] = userDetails.email
        const data = new customPackageReservationSchema({userInfo, packageInfo})

        if(!userInfo || !packageInfo){
            res.status(404).json("data not Found, please enter the required info")
        }           
        else{   
           await data.validate();
           await data.save();
           return res.status(200).json("Booked");
        }
    }
    catch(err){
        if (err.name === 'ValidationError') {
            return res.status(400).json('Please Enter Correct Data');
        }
        return res.status(500).json("Internal Server Error");
    }
}


module.exports = {
    tripsRequest,
    tripInfo,
    booked,
    packages,
    toursInProvince,
    CustomPackageData,
    CustomPackageReservation
};