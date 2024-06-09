import { addCategory, getCategoriesPerPage, getCategoryById, editCategory  } from '../services/categoryService';

const handleGetAdminAddCategoryPage = (req, res) => {
    try {
        const user = req.session.user;
        return res.render("admin/category/add_edit_category", { title: 'Add Category', user, category: null, isEdit: false });
    } catch (error) {
        console.error('Error getting newest books:', error);
        return res.status(500).send('Internal Server Error');
    }
}

const handleCreateANewCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        if (categoryData.imageBase64) {
            categoryData.image = categoryData.imageBase64;
            delete categoryData.imageBase64; // Xóa trường imageBase64 sau khi đã sử dụng
        }
        const result = await addCategory(categoryData);

        if (result.EC === 0) {
            res.redirect('/admin/list-categories?page=1&limit=3');
        } else {
            const category = {};
            res.render('admin/category/add_edit_category', { error: result.EM, title: 'Add Category', category });
        }
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).send('Internal Server Error');
    }
};

const handleGetCategoriesPerPage = async (req, res) => {
    try {
        const { page, limit } = req.query; // Lấy trang và giới hạn từ query parameters
        const data = await getCategoriesPerPage(page, limit);
        const user = req.session.user;
        res.render("admin/category/list_categories", { title: 'List Category', user, dataCategories: data.DT, error: data.EM });

    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const handleGetAdminEditCategoryPage = async (req, res) => {
    try {
        const categoryId = req.params.id; // Lấy id của category từ phần đường dẫn URL
        const result = await getCategoryById(categoryId); // Gọi hàm lấy chi tiết danh mục từ service

        // Kiểm tra nếu không tìm thấy danh mục
        if (result.EC !== 0) {
            return res.status(404).send('Category not found');
        }
        // Render trang add_edit_category.ejs và truyền dữ liệu category vào template
        const user = req.session.user;
        return res.render("admin/category/add_edit_category", { title: 'Edit Category', user, category: result.DT, isEdit: true });
    } catch (error) {
        console.error('Error getting category details:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const handleEditACategory = async (req, res) => {
    try {
        const { categoryId, name, description, imageBase64 } = req.body; // Lấy thông tin category từ request body
        const result = await editCategory(categoryId, name, description, imageBase64); // Gọi service để chỉnh sửa category

        if (result.EC === 0) {
            res.redirect('/admin/list-categories?page=1&limit=3'); // Chuyển hướng đến trang danh sách category sau khi chỉnh sửa thành công
        } else {
            res.render('admin/add_edit_category', { error: result.EM, title: 'Edit Category' });
        }
    } catch (error) {
        console.error('Error editing category:', error);
        res.status(500).send('Internal Server Error');
    }
};


export { 
    handleGetAdminAddCategoryPage, 
    handleCreateANewCategory,
    handleGetCategoriesPerPage,
    handleGetAdminEditCategoryPage,
    handleEditACategory
};
