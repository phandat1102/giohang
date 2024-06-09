import CartItem from './cartItem';

class Cart {
    constructor() {
        this.items = [];
        this.totalPrice = 0; // Thêm thuộc tính totalPrice
    }

    addItem(productId, name, image, price, quantity) {
        const existingItemIndex = this.items.findIndex(item => item.productId === productId);
        if (existingItemIndex !== -1) {
            this.items[existingItemIndex].quantity += quantity;
        } else {
            const newItem = new CartItem(productId, name, image, price, quantity);
            this.items.push(newItem);
        }
        this.calculateTotalPrice(); // Tính lại tổng giá trị sau khi thêm hoặc cập nhật item
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.calculateTotalPrice(); // Tính lại tổng giá trị sau khi xóa item
    }

    updateItemQuantity(productId, changeAmount) {
        const itemToUpdate = this.items.find(item => item.productId === productId);
        if (itemToUpdate) {
            const newQuantity = itemToUpdate.quantity + changeAmount;
            // Đảm bảo số lượng không âm
            if (newQuantity >= 0) {
                itemToUpdate.quantity = newQuantity;
                // Cập nhật lại tổng giá trị sau khi cập nhật số lượng
                this.calculateTotalPrice();
            }
        }
    }

    calculateTotalPrice() {
        this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItems() {
        return this.items;
    }

    clearCart() {
        this.items = [];
        this.totalPrice = 0; // Reset tổng giá trị khi xóa giỏ hàng
    }
}

module.exports = Cart;
