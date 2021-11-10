const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

const MedSchema = new mongoose.Schema(
    {
        c_name:String,
        c_batch_no:String,
        d_expiry_date:Date,
        n_balance_qty:Number,
        c_packaging:String,
        c_unique_code:String,
        c_schemes:String,
        n_mrp:Number,
        c_manufacturer:String,
        hsn_code:String,
        d_created_on:{ type: Date, default: Date.now }
    }
)
MedSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('MedSchema', MedSchema)