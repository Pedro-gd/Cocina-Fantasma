import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item';


@Component({
  selector: 'app-cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.css']
})
export class CartProductComponent implements OnInit {
  @Input() cartItem: CartItem;

  @Output() messageEvent = new EventEmitter<number>();
  @Output() messageEventR = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }
  sendIdSum() {
    this.messageEvent.emit(this.cartItem.productId);
  }
  sendIdRes() {
    this.messageEventR.emit(this.cartItem.productId);
  }

}
