const express = require('express');
const mongoose = require('mongoose');
const path=require('path');
require('dotenv').config();
const app = express();
const PORT = 5983;
app.use(express.json()); //middleware
app.use(express.static(path.join(__dirname,'public'))); //middleware
const mongoURI=process.env.MONGO_URI;
//connect to MongoDB
mongoose.connect(mongoURI)
.then(()=>console.log('connected to mongo'))
.catch(err=>console.error('error connecting to MongoDB:',err));
const userSchema = new mongoose.Schema({
    name:String,
    email: String,
    password: String
});
const User = mongoose.model('User',userSchema);
app.get('/users',(req,res)=>{
    User.find({})
    .then(users => res.json(users))
    .catch(err => res.status(500).json({message: err.message }));
});

//post route
app.post('/users', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
    .then(newUser =>res.status(201).json(newUser))
    .catch(err =>res.status(400).json({message: err.message}));
});
app.put('/users/:id',(req,res)=>{
    const userId = req.params.id;
    const updateData = {
        name: req.body.name,
        email:req.body.email,
        password: req.body.password
    };
    User.findByIdAndUpdate(userId,updateData,{new:true})
        .then(updatedUser => {
            if(!updatedUser){
                res.status(404).json({message: 'User not found'});
            }
            else{
                res.json(updatedUser);
            }
        })
    .catch(err => res.status(404).json({message: err.message}));
});
app.delete('/users/:id',(req,res)=>{
    const userId = req.params.id;
    User.findByIdAndDelete(userId)
    .then(deletedUser => {
        if(!deletedUser){
            return res.status(404).json({message: 'User not found'});
        }
        else{
            res.json({message: 'User deleted successfully'});
        }
    })
    .catch(err => res.status(404).json({message: err.message}));
});


app.listen(PORT,() =>{
    console.log('server is running');
});