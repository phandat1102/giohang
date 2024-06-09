import { getAllCategories, getCategoryById } from "../services/categoryService"; 
import { createProduct, getProductsByPage, getProductById, editProduct } from "../services/productService";

const handleGetAdminAddProductPage = async (req, res) => {
    try {
        const user = req.session.user;
        const categories = await getAllCategories();
        return res.render("admin/product/add_edit_product", { title: 'Add Product', user, product: null, isEdit: false, categories });
    } catch (error) {
        console.error('Error getting newest books:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const handleCreateANewProduct = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { name, price, discountedPrice, categoryId, manufactureDate, description } = req.body;
         // Xác định giá trị của các checkbox và chuyển đổi thành boolean
         const specialProduct = req.body.specialProduct === 'on';
         const newProduct = req.body.newProduct === 'on';
         
         const resultCategoryById = await getCategoryById(categoryId);
         const category = {
            _id: resultCategoryById.DT._id,
            name: resultCategoryById.DT.name
        };

         // Lấy giá trị chuỗi base64 của các hình ảnh từ các trường input ẩn
         const image1 = req.body.imageBase641;
         const image2 = req.body.imageBase642;
         const image3 = req.body.imageBase643;

        // Gọi hàm từ ProductService để thêm mới sản phẩm
        const result = await createProduct({ name, price, discountedPrice, specialProduct, newProduct, category, manufactureDate, description, image1, image2, image3 });
        if(result.EC === 0) {
            res.redirect('/admin/list-products?page=1&limit=3');
        }
        else {
            // res.render("admin/product/add_edit_product", { title: 'Add Product', user, product: null, isEdit: false, categories });
            res.redirect('/admin/add-product');
        }
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).send('Internal Server Error');
    }
}

const handleGetAdminListProductPage = async (req, res) => {
    try {
        const { page, limit } = req.query; 
        const user = req.session.user;
        // Lấy danh sách sản phẩm theo trang
        const result = await getProductsByPage(page, limit);

        if (result.EC === 0) {
            const dataProducts = result.DT;
            return res.render("admin/product/list_products", { title: 'Add Product', user, dataProducts });
        } else {
            console.error('Error getting products by page:', result.EM);
            return res.status(500).send('Internal Server Error');
        }
    } catch (error) {
        console.error('Error getting newest books:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const handleGetAdminEditProductPage = async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await getProductById(productId);

        if (result.EC !== 0) {
            return res.status(404).send('Product not found');
        }
        const user = req.session.user;
        const categories = await getAllCategories();
        return res.render("admin/product/add_edit_product", { title: 'Edit Product', user, categories, isEdit: true, product: result.DT});
    } catch (error) {
        console.error('Error product details:', error);
        return res.status(500).send('Internal Server Error');
    }
}

const handleEditAProduct = async (req, res) => {
    try {
        const { productId, name, price, discountedPrice, categoryId, manufactureDate, description } = req.body;
         // Xác định giá trị của các checkbox và chuyển đổi thành boolean
         const specialProduct = req.body.specialProduct === 'on';
         const newProduct = req.body.newProduct === 'on';
         
         const resultCategoryById = await getCategoryById(categoryId);
         const category = {
            _id: resultCategoryById.DT._id,
            name: resultCategoryById.DT.name
        };

        const image1 = req.body.imageBase641;
        const image2 = req.body.imageBase642;
        const image3 = req.body.imageBase643;

        const result = await editProduct(productId, name, price, discountedPrice, specialProduct, newProduct, category, manufactureDate, description, image1, image2, image3);
        if(result.EC ===0) {
            res.redirect('/admin/list-products?page=1&limit=3');
        }
        else {
            res.redirect('/admin/edit-product');
        }

    } catch (error) {
        console.error('Error editing category:', error);
        res.status(500).send('Internal Server Error');
    }
}

export { handleGetAdminAddProductPage, 
    handleCreateANewProduct, 
    handleGetAdminListProductPage,
    handleGetAdminEditProductPage,
    handleEditAProduct
}