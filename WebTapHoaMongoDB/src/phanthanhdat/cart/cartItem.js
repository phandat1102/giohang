class CartItem {
    constructor(productId, name, image, price, quantity) {
        this.productId = productId;
        this.name = name;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
    }
}

module.exports = CartItem;
