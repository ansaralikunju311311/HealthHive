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
        type:String,
        required:true
    },
    userId : {
        type:String,
        require:true
    },
    sender : {
        type:String,
        // required:true
    },
    date : {
        type:String,
        // required:true
    },
    reciever : {
        type:String,
        // required:true
    }
},{
    timestamps:true
})
const Chat = mongoose.model('Chat',chatSchema);
export default Chat;