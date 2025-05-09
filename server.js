const express = require("express")
const mongoose = require("mongoose")
const contactModel = require("./contactModel")
const validator = require("validator")


const app = express()
const PORT = 8000
const URI = "mongodb+srv://rahul:12345@cluster0.zrlma3o.mongodb.net/contactManager"


app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect(URI).
then(()=> console.log("db is connected"))
.catch((error)=> console.log(error))


// api for fetching all contacts 
app.get("/api/contact",async(req,res)=>{


    try{

        const allContact = await contactModel.find()

        console.log(allContact)

        return res.send({
            status:200,
            message:"all contact fetched succesfully",
            data:allContact
        })

    }
    catch(error){
        return res.send({
            status:500,
            message:"database error",
            error
        })
    }

})

// api for addig new contact

app.post("/api/contact/create_contact",async(req,res)=>{

    const {username,name,email,phone} = req.body


    if(phone.length !== 10){
        return res.send({
            status:401,
            message:'contact number is not valid'
        })
    }

    if(!validator.isEmail(email)){
        return res.send({
            status:401,
            message:"email address is not valid"
        })
    }

    try{

        const contactObj = new contactModel({
            username,
            name,
            email,
            phone
        })

        const contactDb = await contactObj.save()

        return res.send({
            status:201,
            message:"contact added succesfully",
            data:contactDb
        })



    }
    catch(error){
        return res.send({
            status:500,
            message:"database error",
            error
        })
    }



})

// api for deleting the contact

app.post("/api/contact/delete_contact",async(req,res)=>{

    const {username} = req.body
    console.log(username)

    if(!username){
        return res.send({
            status:400,
            message:"username is not valid"
        })
    }

    try{

        const deleteContact = await contactModel.findOneAndDelete({username:username})
        console.log(deleteContact)
        return res.send({
            status:200,
            message:"contact deleted succesfully",
            data:deleteContact
        })

    }
    catch(error){
        return res.send({
            status:500,
            message:"database error",
            error
        })
    }



})

// api for updating the contact 

app.post("/api/contact/update_contact",async(req,res)=>{

    const {id,...newfields} = req.body

    if(!id){
        return res.send({
            status:400,
            message:"id is not valid"
        })
    }

    try{

        const updateDb = await contactModel.findByIdAndUpdate(id,{
            $set:newfields},
            {
                $new:true
            }
        )

        if(!updateDb){
            return res.send(updateDb)
        }

        return res.send({
            status:200,
            message:"contact updated succesfully",
            data:updateDb
        })


    }
    catch(erorr){
        return res.send({
            status:500,
            message:"database error",
            error
        })
    }

})




app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})