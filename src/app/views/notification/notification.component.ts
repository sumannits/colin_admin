import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DataTableResource } from 'angular-4-data-table';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  itemResource:any;
  items = [];
  itemCount = 0;
  public defaultRec:number=10;

  constructor(
    private reportService: DashboardService
  ) { }

  ngOnInit() {
    this.allReport();
  }


  public allReport(){
    let filterActData = '{"is_delete":"false", "include":["customer"], "order" : "id desc"}';
    this.reportService.getFilterDataList('reports?filter='+filterActData).subscribe(res=>{
      this.itemResource = new DataTableResource(res);
      this.itemResource.count().then(count => this.itemCount = count);
      this.items=res;
      if(this.items.length<10){
        this.defaultRec=this.items.length;
      }
      //console.log(res);
    },err=>{
      //this.error = "Error Occured, please try again"
    });
  }

  public reloadItems(params) {
      this.itemResource.query(params).then(items => this.items = items);
  }

  public deleteReport(del_item){
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){  
      this.reportService.deleteReportData(del_item.id).subscribe(res=>{
      //this.reportService.updateData(data,del_item.id).subscribe(res=>{  
        this.allReport();
      },err=>{

      })
    }
  }

}
