import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../models/productSchema';
import UserModel from '../models/userSchema';
import BillDetailModel from '../models/billDetailSchema';
import BillModel from '../models/billSchema';
import CategoryModel from '../models/categorySchema';
import GroupModel from '../models/groupSchema';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected');

        // Tạo các bảng nếu chưa tồn tại
        await Promise.all([
            ProductModel.init(),
            UserModel.init(),
            BillDetailModel.init(),
            BillModel.init(),
            CategoryModel.init(),
            GroupModel.init()
        ]);

        console.log('Tables initialized successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

module.exports = connectDB;
