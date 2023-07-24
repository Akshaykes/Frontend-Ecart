import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  searchKey:string='';
  // to hold all array of products
  allProducts: any=[];
  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.getAllProducts().subscribe((result:any) => {
      console.log(result); // array of products
      this.allProducts = result;
      
    })
   // this.searchKey=this.api.searchKey
   this.api.searchKey.subscribe((result:any)=>{
     this.searchKey=result
     console.log(this.searchKey);
   })
   
    
  }
}
