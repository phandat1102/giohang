import Product from '../models/productSchema';
import { format } from 'date-fns';

const getFeaturedProductsByPage = async (page, limit) => {
    try {
        // Sử dụng phương thức find của Mongoose để lấy danh sách sản phẩm nổi bật
        const products = await Product.find({ specialProduct: true })
                                      .select('name price discountedPrice specialProduct newProduct category manufactureDate description image1')
                                      .skip((page - 1) * limit)
                                      .limit(limit)
                                      .lean();
                                      
        // Định dạng lại ngày sản xuất của từng sản phẩm
        products.forEach(product => {
            product.manufactureDate = format(product.manufactureDate, "dd/MM/yyyy");
        });
        // Đếm tổng số sản phẩm nổi bật
        const totalCount = await Product.countDocuments({ specialProduct: true });
        // Tính tổng số trang
        const totalPages = Math.ceil(totalCount / limit);
        // Trả về danh sách sản phẩm nổi bật và thông tin phân trang
        return {
            EC: 0,
            DT: {
                products,
                totalPages,
                currentPage: page
            }
        };
    } catch (error) {
        console.error('Error getting featured products by page:', error);
        return {
            EM: 'Failed to get featured products by page',
            EC: -1
        };
    }
};

export { getFeaturedProductsByPage };
