import Cart from '../cart/cart';
import { getProductById } from '../services/productService';
import { createBill } from '../services/billService';

// Khởi tạo một giỏ hàng
const cart = new Cart();

// Thêm sản phẩm vào giỏ hàng
exports.addItemToCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const result = await getProductById(productId);
        
        if (result.EC !== 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const { name, image1, discountedPrice } = result.DT;
        // Thêm sản phẩm vào giỏ hàng
        cart.addItem(productId, name, image1, discountedPrice, 1);
        // Tạo một đối tượng cart mới từ các thuộc tính của đối tượng cart trước đó
        const cartData = {
            items: cart.getItems(),
            totalPrice: cart.totalPrice 
        };
        const user = req.session.user;
        return res.render("web/cart_detail", { title: 'Cart detail', user, cart: cartData });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeItemFromCart = async (req, res) => {
    try {
        const productId = req.params.id;
        // Gọi hàm xóa sản phẩm khỏi giỏ hàng trong đối tượng Cart
        cart.removeItem(productId);
        // Cập nhật lại thông tin giỏ hàng sau khi xóa
        const cartData = {
            items: cart.getItems(),
            totalPrice: cart.totalPrice 
        };
        const user = req.session.user;
        return res.render("web/cart_detail", { title: 'Cart detail', user, cart: cartData });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Tăng số lượng sản phẩm trong giỏ hàng
exports.increaseItemQuantity = async (req, res) => {
    try {
        const productId = req.params.id;
        // Gọi hàm tăng số lượng sản phẩm trong giỏ hàng trong đối tượng Cart
        cart.updateItemQuantity(productId, 1);
        // Cập nhật lại thông tin giỏ hàng sau khi tăng số lượng
        const cartData = {
            items: cart.getItems(),
            totalPrice: cart.totalPrice 
        };
        const user = req.session.user;
        return res.render("web/cart_detail", { title: 'Cart detail', user, cart: cartData });
    } catch (error) {
        console.error('Error increasing item quantity:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Giảm số lượng sản phẩm trong giỏ hàng
exports.decreaseItemQuantity = async (req, res) => {
    try {
        const productId = req.params.id;
        // Gọi hàm giảm số lượng sản phẩm trong giỏ hàng trong đối tượng Cart
        cart.updateItemQuantity(productId, -1);
        // Cập nhật lại thông tin giỏ hàng sau khi giảm số lượng
        const cartData = {
            items: cart.getItems(),
            totalPrice: cart.totalPrice 
        };
        const user = req.session.user;
        return res.render("web/cart_detail", { title: 'Cart detail', user, cart: cartData });
    } catch (error) {
        console.error('Error decreasing item quantity:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.handleGetCartPage = (req, res) => {
    try {
        const cartData = {
            items: cart.getItems(),
            totalPrice: cart.totalPrice 
        };
        const user = req.session.user;
        return res.render("web/cart_detail", { title: 'Cart detail', user, cart: cartData });
    } catch (error) {
        console.error('Error decreasing item quantity:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.handleGetConfirmPage = (req, res) => {
    try {
        const cartData = {
            items: cart.getItems(),
            totalPrice: cart.totalPrice 
        };
        if(!cartData.items) {
            return;
        }
        const user = req.session.user;
        if(!user) {
            return res.redirect('/login');
        }
        return res.render("web/confirm_order", { title: 'Confirm Order', user, cart: cartData });
    } catch (error) {
        console.error('Error decreasing item quantity:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.handlePlaceOrder = async (req, res) => {
    try {
        // Lấy thông tin giỏ hàng từ session
        const cartData = {
            items: cart.getItems(),
            totalPrice: cart.totalPrice 
        };

        // Lấy thông tin người dùng từ session
        const user = req.session.user;

        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!user) {
            return res.redirect('/login');
        }

        // Lấy thông tin từ form
        const { fullname, phone, address, paymentMethod } = req.body;

        // Tạo dữ liệu hóa đơn
        const billData = {
            totalPrice: cartData.totalPrice,
            saleDate: new Date(),
            user: {
                _id: user._id,
                fullname: fullname || user.fullname,
                phone: phone || user.phone,
                address: address || user.address
            },
            paymentType: paymentMethod,
            status: 'Pending'
        };

        // Lấy thông tin sản phẩm từ giỏ hàng
        const billDetailData = cartData.items.map(item => ({
            product: {
                _id: item.productId,
                name: item.name,
                image: item.image
            },
            price: item.price,
            quantity: item.quantity
        }));

        // Gọi service để tạo hóa đơn
        const result = await createBill(billData, billDetailData);

        // Xử lý kết quả từ service
        if (result.EC === 0) {
            // Hóa đơn được tạo thành công, xóa thông tin giỏ hàng từ session
            req.session.cart = null;
            return res.render('web/order_success', { title: 'Result Order', user });
        } else {
            // Có lỗi khi tạo hóa đơn
            return res.status(500).json({ message: result.EM });
        }
    } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};