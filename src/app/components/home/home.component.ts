import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  myScriptElement: HTMLScriptElement;
  products: Product[] = [];
  mostrar = false;
  constructor(
    private productService: ProductService
  ) { }

  ngOnInit( ): void {
    this.llamarjs();
    this.loadProducts();
  }

  loadProducts(): void {
    this.products = this.productService.getProducts();
  }

  llamarjs(){
    this.myScriptElement = document.createElement("script");
    this.myScriptElement.src = "../../../assets/js/home.js";
     document.body.appendChild(this.myScriptElement);
  }
}
