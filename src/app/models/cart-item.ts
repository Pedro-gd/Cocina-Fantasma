import { Product } from "./product";

export class CartItem {
    productId: number;
    productName: string;
    productPrice: number;
    qty: number;
    imageUrl: string;

    constructor(product: Product) {
        this.productId = product.id;
        this.productName = product.name;
        this.productPrice = product.price;
        this.qty = 1;
        this.imageUrl = product.imageUrl;
    }
}
