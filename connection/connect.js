const mongoose=require('mongoose')

const connect=()=>{
    mongoose.connect(`${process.env.URI}/testDatabase`)
    .then(()=>{
        console.log('Connected to database')
    })
    .catch(()=>{
        console.log('Error while connecting to db')
    })
}

module.exports=connect;