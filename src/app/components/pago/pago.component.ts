import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

  firstFormGroup = this._formBuilder.group({
    direccion: ['', Validators.required],
    nombreC: ['', Validators.required],
    telefono: ['', Validators.required],
  });
  
  sucursales = [{"id": 1, "Direccion": "minivan", "nombre": "Sucursal 1",},{"id": 2,"Direccion": "minivan","nombre": "Sucursal 2",}];

  cartItems = [];
  total = 0;

  public payPalConfig?: IPayPalConfig;
  
  labelPosition: 1 |2| 0 = 0;

  constructor
  (    
    private messageService: MessageService,
    private storageService: StorageService,
    private _formBuilder: FormBuilder
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
          data.payer.email_address,
          data.purchase_units[0].items,
          data.purchase_units[0].amount.value
        );
        alert(data.payer.address.address_line_1.toString())
        this.emptyCart();
        //this.spinner.hide();
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions,JSON.stringify(data));
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Pago cancelado',
          showConfirmButton: false,
          timer: 50000
        })
      },
      onError: err => {
        console.log('OnError', err);
        alert(err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions,JSON.stringify(data));
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

  
  openModal(email,items, amount): void {
    let item='';
    let i =1;
    items.forEach(element => {
     item+='Articulo '+i+'.- '+element.name+' - '+element.quantity+' unidades'+'<br/>';
     i++;
    });
   Swal.fire({
     position: 'top-end',
     icon: 'success',
     title: 'Pago realizado por '+email,
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
  openModalTienda(): void {
    let sucursal='sucursal 1';
    let items= this.getItemsList();
    let amount = this.getTotal();
    let item='';
    let i =1;
    items.forEach(element => {
     item+='Articulo '+i+'.- '+element.name+' - '+element.quantity+' unidades'+'<br/>';
     i++;
    });
   Swal.fire({
     position: 'top-end',
     icon: 'success',
     title: 'Pago realizado ',
     html: 'Articulos <br/>'+item+'<br/> Total:'+amount.toString()+'<br/>'+'Recoger pedido en '+sucursal,
     showConfirmButton: false,
     timer: 50000
   })
   console.log(items);
   // const modalRef = this.modalService.open(ModalComponent);
    //modalRef.componentInstance.items = items;
    //modalRef.componentInstance.amount = amount;
  }

  prueba(event: Event): any {
    event.preventDefault();
    if (this.firstFormGroup.valid) {
      const value = this.firstFormGroup.value;
      alert(value.direccion+' '+value.nombreC+' '+value.telefono);
    }
  }
}





