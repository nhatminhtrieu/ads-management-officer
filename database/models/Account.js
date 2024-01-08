import mongoose from "mongoose"
import District from "./District.js"
import Ward from "./Ward.js"

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
    },
    password:{
        type:String,
        required: true
    },
    account_link:{
        type: Array,
        default: [],
    },
    createdat: { 
        type: Date, 
        default: Date.now,
        required: true
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    dob: {
        type: Date,
    },
    fav_list: {
        type: Array,
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: District,
        default: null,
    },
    ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Ward,
        default: null,
    },
    role: { 
        type: Number, 
        default: 3,
        required: true,
    }, // 1: ward officials, 2: District officials, 3: Department of Culture and Sports officials
    status: {
        type: Number,
        default: 1,
        required: true,
    } // 1: active, 0: inactive, -1: deleted
}, {
    versionKey: false
})

export default mongoose.model('Account', AccountSchema, 'accounts')