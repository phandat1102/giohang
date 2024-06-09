import { getFeaturedProductsByPage } from "../services/productWebService";
import { getProductById } from "../services/productService";

const handleGetLoginPage = (req, res) => {
    try {
        const user = req.session.user;
        return res.render("web/login", { title: 'Đăng nhập', user });

    } catch (error) {
        console.error('Error getting newest books:', error);
        return res.status(500).send('Internal Server Error');
    }
}

const handleGetRegisterPage = (req, res) => {
    try {
        const user = req.session.user;
        return res.render("web/register", { title: 'Đăng ký', user });

    } catch (error) {
        console.error('Error getting newest books:', error);
        return res.status(500).send('Internal Server Error');
    }
}

const handletGetHomePage = async (req, res) => {
    try {
        const user = req.session.user;
        const result = await getFeaturedProductsByPage(1, 6)
        if(result.EC === 0) {
            return res.render("index", { title: 'Trang chủ', user, products: result.DT.products });
        }
        else {
            return res.render("index", { title: 'Trang chủ', user, products: null });
        }

    } catch (error) {
        console.error('Error getting newest books:', error);
        return res.status(500).send('Internal Server Error');
    }
}

const handleGetProductDetailPage = async (req, res) => {
    try {
        const productId = req.params.id
        const user = req.session.user;
        const result = await getProductById(productId);
        if(result.EC === 0) {
            return res.render("web/product_detail", { title: 'Chi tiết sản phẩm', user, product: result.DT });
        }
        else {
            return res.render("web/product_detail", { title: 'Chi tiết sản phẩm', user, product: null });
        }

    } catch (error) {
        console.error('Error getting newest books:', error);
        return res.status(500).send('Internal Server Error');
    }
};

export { 
    handleGetLoginPage, 
    handleGetRegisterPage,
    handletGetHomePage,
    handleGetProductDetailPage
};