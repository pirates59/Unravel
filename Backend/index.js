const express = require ("express")
const mongoose= require('mongoose')
const cors = require("cors")
const SignupModel = require ('./models/Signup')


const app= express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/fyp");

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    SignupModel.findOne({email: email})
    .then (user => {
        if(user) {
            if(user.password === password) {
            res.json("Success")
        } else{
            res.json("Password is incorrect ")
        }

}else{
    res.json("No record existed")
}

})
})


app.post('/register', (req, res) => {
    SignupModel.create(req.body)
    .then(signup => res.json(signup))
    .catch(err => re.json(err))

})
app.listen(3001, () => 
{
    console.log("Server is running")
})