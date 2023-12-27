import mongoose from "mongoose"

const AccountSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    fullname: {
        type:String,
    },
    email: {
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    account_link:{
        type: Array,
    },
    createdat: { 
        type: Date, 
        default: Date.now,
        required: true
    },
    phone: {
        type: String,
    },
    dob: {
        type: Date,
    },
    fav_list: {
        type: Array,
    },
    area:{
        type: String,
    },
    role: { 
        type: Number, 
        default: 3,
        required: true,
    } // 1: ward officials, 2: District officials, 3: Department of Culture and Sports officials
}, {
    versionKey: false
})

export default mongoose.model('Account', AccountSchema, 'accounts')