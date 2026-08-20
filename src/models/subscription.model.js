import mongoose,{Schema} from "mongoose";

const subsciptionSchema =new Schema ({
    subscriber:{
        type:Schema.Types.ObjectId,//one who  is subscribing
        ref: "User"
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})


export const subsciption = mongoose.model("subsciption",subsciptionSchema)