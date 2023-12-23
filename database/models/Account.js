import mongoose from "mongoose"

const AccountSchema = new mongoose.Schema({
    fullName: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    phoneNumber: {
        type: String,
    },
    birthDate: {
        type: Date,
    },
    role: { 
        type: Number, 
        required: true,
        default: 1 
    } // 1: ward officials, 2: District officials, 3: Department of Culture and Sports officials
}, {
    versionKey: false
})

export default mongoose.model('Account', AccountSchema, 'accounts')