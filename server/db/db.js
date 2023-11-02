import mongoose from "mongoose";
const url='mongodb+srv://project_2:Prakash%401998@project2.05fzboj.mongodb.net/project2?retryWrites=true&w=majority'
const databse=()=>{
mongoose.connect(url, {
  useNewUrlParser: true,
//   useUnifiedTopology: true,
}).then(()=>console.log("db connected")).catch((err)=>console.log(err))
}
export default databse;