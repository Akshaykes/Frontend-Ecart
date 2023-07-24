import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

 
 
  transform(allProducts:any[],searchKey:string,propName:string): any[]{

    const result:any[]=[]; 
 
     if(!allProducts || searchKey=='' || propName==''){
       return allProducts;
     }
 
     allProducts.forEach((item:any)=>{
       if(item[propName].trim().toLowerCase().includes(searchKey.toLowerCase().trim())){
         result.push(item)
       }
     })
     return result;
   }

}
