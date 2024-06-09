import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    specialProduct: { type: Boolean },
    newProduct: { type: Boolean },
    category: { 
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        name: { type: String }
    },
    manufactureDate: { type: Date },
    description: { type: String },
    image1: { type: String},
    image2: { type: String},
    image3: { type: String},
});

module.exports = mongoose.model('Product', productSchema);
