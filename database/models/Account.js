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
    provider: {
        type: String,
        default: 'department', // department, facebook, google
        required: true
    },
    createdat: { 
        type: Date, 
        default: Date.now 
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