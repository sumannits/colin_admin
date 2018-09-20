import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, Params } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { DashboardService } from '../../../services/dashboard.service';
import { DataTableResource } from 'angular-4-data-table';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  error: string;
  customerId: any;
  customerDet: object = {};
  items = [];
  itemCount = 0;
  public defaultRec:number=10;
  public allDataList = [];
  itemResource:any;

  constructor(
    private router: Router, 
    private activatedRoute:ActivatedRoute,  
    private customerService: CustomerService,
    private reportService: DashboardService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.customerId = params['id'];
        this.getIndividualCustomer(this.customerId);
        this.getAbuseList(this.customerId);
    });
   }

  ngOnInit() {
  }

  public getIndividualCustomer(Id){
    this.customerService.getIndividualCustomer(Id).subscribe(res=>{
      this.customerDet = res;
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getAbuseList(Id){
    //let filterActData = '{"is_delete":"false", "include":["customer"], "order" : "id desc"}';
    let filterActData = '{"where":{"is_delete":false, "customerId":'+Id+'}, "order" : "id desc"}';
    this.customerService.getInterestList('reports?filter='+filterActData).subscribe(res=>{
      this.items = [];
      //this.customerList=res;
      this.itemResource = new DataTableResource(res);
      this.itemResource.count().then(count => this.itemCount = count);
      this.items=res;
      this.allDataList=res;
      if(this.items.length<10){
        this.defaultRec=this.items.length;
      }
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public reloadItems(params) {
      this.itemResource.query(params).then(items => this.items = items);
  }

  public deleteReport(del_item){
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){  
      this.reportService.deleteReportData(del_item.id).subscribe(res=>{
      //this.reportService.updateData(data,del_item.id).subscribe(res=>{  
        this.getAbuseList(this.customerId);
      },err=>{

      })
    }
  }
}
