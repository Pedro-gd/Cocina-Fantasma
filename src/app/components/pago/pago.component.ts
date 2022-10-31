import { Component, OnInit } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { CartItem } from 'src/app/models/cart-item';
import { Product } from 'src/app/models/product';
import { MessageService } from 'src/app/service/pago.service';
import { StorageService } from 'src/app/service/storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  cartItems = [];
  total = 0;
  public payPalConfig?: IPayPalConfig;
  constructor
  (    
    private messageService: MessageService,
    private storageService: StorageService,
  ) 
  {   }

  ngOnInit(): void {
    this.initConfig();
    if (this.storageService.existsCart()) {
      this.cartItems = this.storageService.getCart();
    }
    this.getItem();
    this.total = this.getTotal();
  }

  getItem(): void {
    this.messageService.getMessage().subscribe((product: Product) => {
      let exists = false;
      this.cartItems.forEach(item => {
        if (item.productId === product.id) {
          exists = true;
          item.qty++;
        }
      });
      if (!exists) {
        const cartItem = new CartItem(product);
        this.cartItems.push(cartItem);
      }
      this.total = this.getTotal();
      this.storageService.setCart(this.cartItems);
    });
  }
  getItemsList(): any[] {
    const items: any[] = [];
    let item = {};
    this.cartItems.forEach((it: CartItem) => {
      item = {
        name: it.productName,
        quantity: it.qty,
        unit_amount: {value: it.productPrice, currency_code: 'MXN'}
      };
      items.push(item);
    });
    return items;
  }
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'MXN',
      clientId: environment.clientId,
      // tslint:disable-next-line: no-angle-bracket-type-assertion
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'MXN',
            value: this.getTotal().toString(),
            breakdown: {
              item_total: {
                currency_code: 'MXN',
                value: this.getTotal().toString()
              }
            }
          },
          items: this.getItemsList()
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        //this.spinner.show();
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point',
        JSON.stringify(data));
        this.openModal(
          data.purchase_units[0].items,
          data.purchase_units[0].amount.value
        );
        this.emptyCart();
        //this.spinner.hide();
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        return actions.order.capture().then(function(details) {
          // This function shows a transaction success message to your buyer.
          alert('Transaction completed by ' + details.payer.name.given_name);
        });
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  getTotal(): number {
    let total = 0;
    this.cartItems.forEach(item => {
      total += item.qty * item.productPrice;
    });
    return +total.toFixed(2);
  }

  emptyCart(): void {
    this.cartItems = [];
    this.total = 0;
    this.storageService.clear();
  }

  deleteItem(i: number): void {
    this.cartItems.splice(i, 1);
    this.total = this.getTotal();
    this.storageService.setCart(this.cartItems);
  }

  incrementoId(id:number):void{
    this.cartItems.forEach(item => {
      if (item.productId === id) {
        item.qty++;
      }
    });
    this.total = this.getTotal();
    this.storageService.setCart(this.cartItems);
  }

  decrementoId(id:number){
    let exist=false;
    this.cartItems.forEach(item => {
      if (item.productId === id) {
        if(item.qty>1){
          item.qty--;
        }
      }
    });
    this.total = this.getTotal();
    this.storageService.setCart(this.cartItems);
  }

  
  openModal(items, amount): void {
    let item='';
    let i =1;
    items.forEach(element => {
     item+='Articulo '+i+'.- '+element.name+' - '+element.quantity+' unidades'+'<br/>';
     i++;
    });
   Swal.fire({
     position: 'top-end',
     icon: 'success',
     title: 'Pago realizado',
     html: 'Articulos <br/>'+item+'<br/> Total:'+amount.toString(),
     showConfirmButton: false,
     timer: 50000
   })
   console.log(items);
   // const modalRef = this.modalService.open(ModalComponent);
    //modalRef.componentInstance.items = items;
    //modalRef.componentInstance.amount = amount;
  }
message:number;
  receiveIdSum($event) {
    this.message = $event
    this.incrementoId(this.message);
  }
  receiveIdRes($event) {
    this.message = $event
    this.decrementoId(this.message);
  }
  showModal(items, amount){
    let item;
     items.forEach(element => {
      item+=element.name+'\n';
     });
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Pago realizado',
      html: 'Articulos </br>'+item+'</br> Total:'+amount.toString(),
      showConfirmButton: false,
      timer: 50000
    })
  }
}





