const express=require('express');
const router=express.Router();
const User=require('../models/userModel')
const AuthMiddleware=require('../middleware/AuthMiddleware')

router.post('/register',async (req,res)=>{
    try{
    const {name,email,password,phone}=req.body;
    if(!email || !password || !name || !phone){
        return res.status(400).json({message:"Enter all fields"})
    }
    const emailExisting=await User.findOne({email});
    if(emailExisting){
        return res.status(400).json({message:'Email already exist'})
    }
    const user=User.create({
        name,
        email,
        password,
        phone
    })
    const userStored=await User.find({email})
    if(!userStored){
        res.status(400).json({message:'Error while registering user'})
    }
    res.status(200).json({message:'User registerd Successfully'})
    }
    catch(error){
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(error => error.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.log(error)
    }
})

router.post('/login',async(req,res)=>{
    try{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:'Enter all fields'})
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message:'Invalid Credentials'})
    }
    const pass=await user.comparePass(password)
    if(!pass){
        return res.status(400).json({message:'Invalid Credentials'})
    }
    const token=user.generateAccessToken(user);
    res
    .cookie('accessToken',token,{
        httpOnly:true,
        maxAge: 9000000000
    })
    .status(200).json({message:'Logged in successfully'})
}
catch(error){
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(error => error.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    console.log(err)
}
})

router.get('/getuser',AuthMiddleware,async(req,res)=>{
    const users=await User.find();
    return res.status(200).json({users}) 
})

router.get('/getuser/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    const user=await User.findById({_id:id});
    res.status(200).json({user})
    }
    catch(error){
        console.log(error)
    }
})

// router.patch('/getuser/:id',async(req,res)=>{
//     const {id}=req.params;
//     try{
//     const user=await User.findById({_id:id});
//     if(!user){
//         return res.status(400).json({message:'User already exist'})
//     }

//     Object.keys(req.body).forEach((key)=>{
//         // if(req.body[key]!==undefined){
//         user[key]=req.body[key]
//         // }
//     })

//     await user.save();

//     return res.status(200).json({message:'User updated successfully'})
// }
// catch(error){
//     if (error.name === 'ValidationError') {
//         const messages = Object.values(error.errors).map(error => error.message);
//         return res.status(400).json({ message: messages.join(', ') });
//     }
//     return res.status(500).json({message:'Internal server error'})
// }
// })

router.patch('/getuser/:id',async(req,res)=>{
    const {id}=req.params;
    const updates=req.body;
    try{
    const user=await User.findByIdAndUpdate({_id:id},updates,{new:true});
    
    await user.save();

    return res.status(200).json({message:'User updated successfully'})
}
catch(error){
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(error => error.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    return res.status(500).json({message:'Internal server error'})
}
})

router.delete('/delete/:id',async(req,res)=>{
    const {id}=req.params;
    try{
    const user=await User.findByIdAndDelete({_id:id})
    if(!user){
        return res.status(400).json({message:'User not found'})
    }
    return res.status(200).json({message:'User deleted successfully'})
} 
catch(error){
    console.log(error)
}
})

module.exports=router;