// src/models/BillDetail.js
import mongoose from 'mongoose';

const billDetailSchema = new mongoose.Schema({
    billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
    product: {
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String },
        image: { type: String }
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

module.exports = mongoose.model('BillDetail', billDetailSchema);
