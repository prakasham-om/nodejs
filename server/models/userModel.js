import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import crypto from 'crypto';
import validator from "validator";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"],
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password must be Eight Charecter"]
    },
    
    image:{
        type:String,
        //required:true
    },

   passwordChangeDate:Date,
   role:{
    type:String,
    required:true,
    enum:['admin','user'],
    default:'user'
   },
   passwordResetToken:String,
   passwordResetExpires:Date

})




userSchema.pre('save',function (next){
    if(this.isModified('password')){
          this.password=bcrypt.hashSync(this.password,10);
    }
    next();
    
})


userSchema.methods.toJSON= function(){
    const user=this.toObject(); 
    delete user.password;
    return user;
}


userSchema.methods.verifyPassword= function(jwtTimestamp){
  if(this.passwordChangeDate){
    const changeDate=parseInt(this.passwordChangeDate.getDate()/1000);
    return changeDate > jwtTimestamp;
  }
  return false;
}


userSchema.methods.generatePasswordResetToken= function(){
    const resetToken=crypto.randomBytes(20).toString('hex');
    this.passwordResetToken=resetToken;
    this.passwordResetExpires=Date.now()+30000;
    return resetToken;

}

const userModel=mongoose.model('User',userSchema);



export default userModel;