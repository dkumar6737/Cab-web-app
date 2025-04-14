const mongoose = require('mongoose')

const paynentSchema = new mongoose.Schema({
    ride:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ride',
        required: true
    },
    totalfare:{
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('payment', paynentSchema)