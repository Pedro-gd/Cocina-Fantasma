import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item';


@Component({
  selector: 'app-cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.css']
})
export class CartProductComponent implements OnInit {
  @Input() cartItem: CartItem;
  constructor() { }

  ngOnInit(): void {
  }

}
