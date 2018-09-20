import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CustomerService } from '../../../services/customer.service';
import { DataTableResource } from 'angular-4-data-table';

@Component({
  selector: 'app-allcustomer',
  templateUrl: './allcustomer.component.html',
  styleUrls: ['./allcustomer.component.scss']
})
export class AllcustomerComponent implements OnInit {
  customerList=[];
  itemResource:any;
  items = [];
  itemCount = 0;
  public defaultRec:number=10;
  public allDataList = [];

  constructor(private router: Router, private customerService: CustomerService) { }

  ngOnInit() {
    this.getAllCustomers();
  }


  public getAllCustomers(){
    this.customerService.getCustomer().subscribe(res=>{
      this.items = [];
      this.itemResource = new DataTableResource(res);
      this.itemResource.count().then(count => this.itemCount = count);
      this.items=res;
      this.allDataList=res;
      if(this.items.length<10){
        this.defaultRec=this.items.length;
      }
    })
  }

  public reloadItems(params) {
    //console.log(params);
      this.itemResource.query(params).then(items => this.items = items);
  }

  public deleteCustomer(id){
    //console.log(id);
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){      
      this.customerService.deleteCustomer(id).subscribe(res=>{
        this.customerService.getCustomerNodsList(id).subscribe((res1)=>{
          if(res1.length>0)
          {
            this.customerService.deleteCustomerNode(res1[0].id).subscribe((res2)=>{

            })
          }
        })
        this.getAllCustomers();
      },err=>{

      })
    }
  }

  public changeStatus(customer){    
    //console.log(customer);
    let customer_status
    if(customer.is_active){
      customer_status = {
        is_active:0
      }
    }else{
      customer_status = {
        is_active:1
      }
    }    
    const confirmMessage = confirm('Do you want to change status?')
    if(confirmMessage ){      
      this.customerService.editCustomer(customer_status,customer.id).subscribe(res=>{
        this.getAllCustomers();
      },err=>{
      })
    }
  }


  public CustomSearch(data: any){
    let searchVal=data.target.value;
    //console.log(searchVal);
    if(searchVal !=''){
      this.items=this.searchPipe(this.allDataList, searchVal);
    }else{
      this.getAllCustomers();
    }
  }

  public searchPipe(items, sdata){
      const /** @type {?} */ toCompare = sdata.toLowerCase();
      return items.filter(function (item) {
          for (let /** @type {?} */ property in item) {
              if (item[property] === null) {
                  continue;
              }
              if (item[property].toString().toLowerCase().includes(toCompare)) {
                  return true;
              }
              if (item.grpinterest.length > 0) {
                for (let /** @type {?} */ nestedproperty in item.grpinterest) {
                  if (item.grpinterest[nestedproperty].interest_text && item.grpinterest[nestedproperty].interest_text != null && item.grpinterest[nestedproperty].interest_text.toString().toLowerCase().includes(toCompare)) {
                      return true;
                  }
                  if(item.grpinterest[nestedproperty].interestId != null){
                    if (item.grpinterest[nestedproperty].interest.name && item.grpinterest[nestedproperty].interest.name != null && item.grpinterest[nestedproperty].interest.name.toString().toLowerCase().includes(toCompare)) {
                        return true;
                    }
                    
                    if (item.grpinterest[nestedproperty].interest.description !='' && item.grpinterest[nestedproperty].interest.description !== null && toCompare != null) {
                        if (item.grpinterest[nestedproperty].interest.description.toString().toLowerCase().includes(toCompare)) {
                            return true;
                        }
                    }
                  }
                }
              }
          }
          return false;
      });
  }
}
