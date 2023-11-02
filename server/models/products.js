import mongoose from 'mongoose';


const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true   
    },
    price:{
        type:Number,
        required:true
    },
   image:[String],
   category:[String],
   rating:Number,
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
   }
  
})



const Product=mongoose.model('Product',productSchema)

export default Product;