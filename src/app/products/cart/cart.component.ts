import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import {  Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

 showPaypalStatus: boolean=false;

  showSuccess: boolean=false;

  public payPalConfig?: IPayPalConfig;

  discountClicked: boolean=false;

 offerClicked: boolean=false;

 paymentStatus: boolean=false;

 username:string='';
 houseno:string='';
 city:string='';
 state:string='';
 phoneno:string='';

   totalprice = 0; // hold total price
   // to hold all cart products
   allcart: any=[]
   cartcounts:string='';
  constructor(private api: ApiService,private fb: FormBuilder) { }

  addressForm = this.fb.group({
    username:['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    houseno:['', [Validators.required, Validators.pattern('[0-9]*')]],
    city:['' , [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    state :['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    phoneno:['', [Validators.required, Validators.pattern('[0-9]*')]],
  })
  ngOnInit(): void {

    this.api.getcart().subscribe((result:any) => {
      console.log(result); // array of products
      this.api.cartCount()
      this.allcart = result; // array of cart products
      // call cart total function
      this.getcartTotal()

      this.initConfig();
    },
    (result:any)=>{
      console.log(result.error);
    })
  }

  
    // delete wishlist product
    removeCart(id:any){
      this.api.deleteCart(id).subscribe((result:any) => {
        console.log(result); // remaining cart products
        this.allcart = result; // array of cart products
        this.api.cartCount()
      },
      (result:any)=>{
        alert(result.error)
      })                
    }

    // get cart total
    getcartTotal(){
      let total=0
      this.allcart.forEach((result:any) => {
        total+=result.grandTotal
        this.totalprice=Math.ceil(total)
      })
    }
    // increment cart
    incrementCart(id:any){
      this.api.incrementCartCount(id).subscribe((result:any) => {
        this.allcart = result; // array of cart products
        this.getcartTotal()
        this.cartcounts
      },
      (result:any)=>{
        alert(result.error)
      })
    }

    // decrement cart
    decrementCart(id:any){
      this.api.decrementCartCount(id).subscribe((result:any) => {
        this.allcart = result; // array of cart products
        this.getcartTotal()
        this.cartcounts
      },
      (result:any)=>{
        alert(result.error)
      })
    }

    submitPay(){
      if(this.addressForm.valid){
        this.username=this.addressForm.value.username||'';
        this.houseno=this.addressForm.value.houseno||'';
        this.city=this.addressForm.value.city||'';
        this.state=this.addressForm.value.state||'';
        this.phoneno=this.addressForm.value.phoneno||'';

        this.paymentStatus=true;
      }
      else{
        alert("Invalid form")
      }
    }

    offerClick(){
      this.offerClicked=true;
      this.discountClicked=true;
    }
    discount(value:any){
     this.totalprice=this.totalprice*(100-value)/100;
     this.offerClicked=false;
    }


    
    private initConfig(): void {
      this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details:any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
    }

    PaypalPay(){
      this.showPaypalStatus=true;
    }

    modalClose(){
      this.addressForm.reset()
      this.showPaypalStatus=false
      this.showSuccess=false
      this.paymentStatus=false
      this.discountClicked=false
    }
}

