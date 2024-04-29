const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already exist"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    phone:{
        type:Number,
        required:[true,'Phone no. is required']
    }

})

userSchema.pre('save',async function(next){
    this.password=await bcrypt.hashSync(this.password,10)
    next();
})

userSchema.methods.comparePass=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(user){
    return jwt.sign(
        {id:user._id},
        process.env.JWT_ACCESS_TOKEN,
        {expiresIn:'2d'}
    )
}


module.exports=mongoose.model('User',userSchema)