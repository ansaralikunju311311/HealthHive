import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    roomId : {
        type:String,
        required:true
    },
    message : {
        type:String,
    },
    senderId : {
        type:String,
        required:true
    },
    recieverId : {
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