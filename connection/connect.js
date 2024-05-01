const mongoose=require('mongoose')

const connect=()=>{
    mongoose.connect(process.env.URI)
    .then(()=>{
        console.log('Connected to database')
    })
    .catch((error)=>{
        console.log('Error while connecting to db',error)
    })
}

module.exports=connect;