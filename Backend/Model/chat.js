import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    roomId : {
        type:String,
        required:true
    },
    message : {
        type:String,
    },
    doctorId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true
    },
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    sender : {
        type:String,
    },
    date : {
        type:String,
    },
    reciever : {
        type:String,
    }
},{
    timestamps:true
})
const Chat = mongoose.model('Chat',chatSchema);
export default Chat;