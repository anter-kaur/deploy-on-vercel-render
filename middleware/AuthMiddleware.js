const jwt=require('jsonwebtoken')

const AuthMiddleware=(req,res,next)=>{
    
    const token=req.cookies.accessToken;
    console.log('token=>>',token)
    try{
    const tokenverified=jwt.verify(token,process.env.JWT_ACCESS_TOKEN)
    console.log('token verified--->>>',tokenverified)
    console.log('User registered')
    next();
    }
    catch(error){
        console.log(error)
    }
}

module.exports=AuthMiddleware;