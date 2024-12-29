import mongoose,{Schema} from "mongoose";

const subscriptionScehma=new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // one who is subscribing
        required: true
    },
    channel:{
        type: Schema.Types.ObjectId, // one to whom subscriber is subscribing
        required:true
    }
},{timestamps: true})

export const Subscription= mongoose.model("Subscription", subscriptionScehma);