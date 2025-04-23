const client = require("../models/client-model")

const clientApi = async (req,res)=>{
    try {
        const {villaName,location,guest,bedroom,bathroom,checkin,checkout} = req.body
        console.log("router is created for client")
        const clientData = await client.create({
            villaName,
            location,
            guest,
            bedroom,
            bathroom,
            checkin,
            checkout
        })
        console.log("Client data saved:", clientData);
        return res.status(201).json({ msg: "New data added successfully", data: clientData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }


}
const clientdata = async (req,res)=>{
try {
    const response = await client.find()
    if(!response){
        res.status(404).json({msg:"no data found"})
        return
    }
    res.status(200).json({msg:response})
} catch (error) {
    console.log(`services : ${error}`)
}
}
module.exports={clientApi,clientdata}; 
