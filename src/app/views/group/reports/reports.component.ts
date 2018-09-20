import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../../../services/group.service';
import { DashboardService } from '../../../services/dashboard.service';
import { DataTableResource } from 'angular-4-data-table';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  error: string;
  groupId: any;
  groupDet: object = {};
  items = [];
  itemCount = 0;
  public defaultRec:number=10;
  public allDataList = [];
  itemResource:any;

  constructor(
    private router: Router, 
    private activatedRoute:ActivatedRoute,  
    private groupService: GroupService,
    private reportService: DashboardService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params['id'];
        this.getIndividualEvent(this.groupId);
        this.getAbuseList(this.groupId);
    });
   }

  ngOnInit() {
  }

  public getIndividualEvent(Id){
    this.groupService.getIndividualGroup(Id).subscribe(res=>{
      this.groupDet = res;
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getAbuseList(Id){
    let filterActData = '{"where":{"is_delete":false, "notification_pid":'+Id+', "type": {"inq": ["1", "2", "3", "6"]}}, "include":["customer"], "order" : "id desc"}';
    this.groupService.getFilterDataList('reports?filter='+filterActData).subscribe(res=>{
      this.items = [];
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
        this.getAbuseList(this.groupId);
      },err=>{

      })
    }
  }
  
}
