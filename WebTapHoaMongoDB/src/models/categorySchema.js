import mongoose from 'mongoose';

const cagtegorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String}
});

module.exports = mongoose.model('Category', cagtegorySchema);
