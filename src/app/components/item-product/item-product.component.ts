import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { MessageService } from 'src/app/service/pago.service';

@Component({
  selector: 'app-item-product',
  templateUrl: './item-product.component.html',
  styleUrls: ['./item-product.component.css']
})
export class ItemProductComponent implements OnInit {
  @Input() product: Product;

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  addToCart():void {
    this.messageService.sendMessage(this.product);
  }

}
