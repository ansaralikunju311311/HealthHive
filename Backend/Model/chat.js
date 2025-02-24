import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    roomId : {
        type:String,
        required:true
    },
    messages : {
        type:String,
    },
    senderId : {
        type:String,
        required:true
    },
    recieverId : {
        type:String,
        require:true
    }
},{
    timestamps:true
})
const Chat = mongoose.model('Chat',chatSchema);
export default Chat;