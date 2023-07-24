import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  // to hold particular product id
  productId: any;
  // to hold all array of product
  product: any = {};
  constructor(private viewActivatedRoute: ActivatedRoute, private api: ApiService) { }
  // Activatedroute is to get the path parameter from route

  ngOnInit(): void {
    this.viewActivatedRoute.params.subscribe((data: any) => {
      console.log(data); // id:
      console.log(data.id);
      this.productId = data.id;
      // view particular product details
      this.api.viewProduct(this.productId).subscribe((result: any) => {
        console.log(result); // array of products
        this.product = result;
      })
    })
  }

  // addtowishlist
  addtowishlist() {
    const { id, title, price, image } = this.product;
    // api call
    this.api.addtowishlist(id, title, price, image).subscribe((result: any) => {
      alert(result)
    },
      (result: any) => {
        alert(result.error)
      })
  }

  // addtocart
  addtocart(product: any) {
    Object.assign(product, { quantity: 1 })
    console.log(product);

    // // api call
    this.api.addtocart(product).subscribe((result: any) => {
      this.api.cartCount()
      alert(result) // added to cart
    },
      (result: any) => {
        alert(result.error) // error
      })
  }
}
