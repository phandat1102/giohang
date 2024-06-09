import Product from '../models/productSchema';
import { format } from 'date-fns';
// Hàm xử lý thêm mới sản phẩm
const createProduct = async (productData) => {
    try {
        const newProduct = new Product(productData);
        // Lưu sản phẩm mới vào database
        const savedProduct = await newProduct.save();
        // Trả về sản phẩm vừa được lưu
        return {
            EM: 'create a new product successfully',
            EC: 0,
            DT: savedProduct
        }
    } catch (error) {
        console.error('Error adding product:', error);
        return {
            EM: 'Failed to add product',
            EC: -1
        };
    }
};

const getProductsByPage = async (page, limit) => {
    try {
        // Sử dụng phương thức skip và limit của Mongoose để phân trang
        const products = await Product.find().skip((page - 1) * limit).limit(limit).lean();
        // Định dạng lại ngày sản xuất của từng sản phẩm
        products.forEach(product => {
            product.manufactureDate = format(product.manufactureDate, "dd/MM/yyyy");
        });
        // Đếm tổng số sản phẩm
        const totalCount = await Product.countDocuments();
        // Tính tổng số trang
        const totalPages = Math.ceil(totalCount / limit);
        // Trả về danh sách sản phẩm và thông tin phân trang
        return {
            EC: 0,
            DT: {
                products,
                totalPages,
                currentPage: page
            }
        };
    } catch (error) {
        console.error('Error getting products by page:', error);
        return {
            EM: 'Failed to get products by page',
            EC: -1
        };
    }
};

const getProductById = async (productId) => {
    try {
        const product = await Product.findById(productId);

        return {
            EM: 'get product by id successfully',
            EC: 0,
            DT: product
        };
    } catch (error) {
        console.error('Error getting product by id:', error);
        return {
            EM: 'Failed to get categories',
            EC: -1
        };
    }
};

const editProduct = async (productId, name, price, discountedPrice, specialProduct, newProduct, category, manufactureDate, description, image1, image2, image3) => {
    try {
        // Tìm category cần chỉnh sửa trong database
        const product = await Product.findById(productId);
        if (!product) {
            return {
                EM: 'Product not found',
                EC: -1
            };
        }
        product.name = name;
        product.price = price;
        product.discountedPrice = discountedPrice;
        product.specialProduct = specialProduct;
        product.newProduct = newProduct;
        product.category = category;
        product.manufactureDate = manufactureDate;
        product.description = description;
        product.image1 = image1;
        product.image2 = image2;
        product.image3 = image3;
        // Lưu thay đổi vào database
        await product.save();
        return {
            EM: 'Product edited successfully',
            EC: 0
        };
    } catch (error) {
        console.error('Error editing Product:', error);
        return {
            EM: 'Failed to edit Product',
            EC: -1
        };
    }
};

export { createProduct, getProductsByPage, getProductById, editProduct }