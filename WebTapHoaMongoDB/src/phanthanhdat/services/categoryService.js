import Category from '../models/categorySchema';

const addCategory = async (categoryData) => {
    try {
        const newCategory = new Category(categoryData);
        await newCategory.save();

        return {
            EM: 'Category added successfully!',
            EC: 0
        };
    } catch (error) {
        console.error('Error adding category:', error);
        return {
            EM: 'Failed to add category',
            EC: -1
        };
    }
};

const getCategoriesPerPage = async (page, limit) => {
    try {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        // Lấy tổng số danh mục
        const totalCategories = await Category.countDocuments();
        // Tính tổng số trang
        const totalPages = Math.ceil(totalCategories / limitNumber);
        // Lấy danh sách danh mục phân trang
        const categories = await Category.find().skip(skip).limit(limitNumber);
        return {
            EM: 'get categories successfully',
            EC: 0,
            DT: {
                categories,
                totalPages // Trả về tổng số trang cùng với danh sách danh mục
            }
        };
    } catch (error) {
        console.error('Error getting categories:', error);
        return {
            EM: 'Failed to get categories',
            EC: -1
        };
    }
};

const getCategoryById = async (categoryId) => {
    try {
        // Sử dụng categoryId để tìm kiếm category trong cơ sở dữ liệu
        const category = await Category.findById(categoryId);

        // Trả về category nếu tìm thấy
        return {
            EM: 'get category by id successfully',
            EC: 0,
            DT: category
        };
    } catch (error) {
        console.error('Error getting category by id:', error);
        return {
            EM: 'Failed to get categories',
            EC: -1
        };
    }
};

const editCategory = async (categoryId, name, description, imageBase64) => {
    try {
        // Tìm category cần chỉnh sửa trong database
        const category = await Category.findById(categoryId);
        if (!category) {
            return {
                EM: 'Category not found',
                EC: -1
            };
        }
        // Cập nhật thông tin category
        category.name = name;
        category.description = description;
        category.image = imageBase64;
        // Lưu thay đổi vào database
        await category.save();
        return {
            EM: 'Category edited successfully',
            EC: 0
        };
    } catch (error) {
        console.error('Error editing category:', error);
        return {
            EM: 'Failed to edit category',
            EC: -1
        };
    }
};

const getAllCategories = async () => {
    try {
        const categories = await Category.find();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
    }
};

export { 
    addCategory,
    getCategoriesPerPage,
    getCategoryById,
    editCategory,
    getAllCategories
};
