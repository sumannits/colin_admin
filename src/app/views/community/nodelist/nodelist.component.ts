import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommunityService } from '../../../services/community.service';
import { DataTableResource } from 'angular-4-data-table';

@Component({
  selector: 'app-nodelist',
  templateUrl: './nodelist.component.html',
  styleUrls: ['./nodelist.component.scss']
})
export class NodelistComponent implements OnInit {
  public communityId: any;
  public error:any;
  public communityDetails: object = {};
  itemResource:any;
  items = [];
  itemCount = 0;
  public defaultRec:number=10;
  public allDataList = [];

  constructor(
    private router: Router, 
    private activatedRoute:ActivatedRoute, 
    private communityService: CommunityService
  ) { 
    this.activatedRoute.params.subscribe((params: Params) => {
        this.communityId = params['id'];        
        this.getCommunityDet(this.communityId);
        this.getAllNodes();
    });
  }

  ngOnInit() {
  }

  public getCommunityDet(Id){
    this.communityService.getIndividualCommunity(Id).subscribe(res=>{
        this.communityDetails=res;
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getAllNodes(){
    this.communityService.getFilterData('community_nodes?filter={"where":{"community_id":'+this.communityId+'}, "include":["grpuser", {"grpinterest": ["interest"]}], "order" : "id desc"}').subscribe(res=>{
      this.items = [];
      this.itemResource = new DataTableResource(res);
      this.itemResource.count().then(count => this.itemCount = count);
      res.forEach((val: any) => {
        val.tot_user = val.grpuser.length;
      });
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

  public deleteNode(id){
    //console.log(id);
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){      
      this.communityService.deleteNode(id).subscribe(res=>{
        this.getAllNodes();
      },err=>{

      })
      this.communityService.getUserNodeListByCommunity(id).subscribe((res4)=>{
        if (res4.length > 0) {
          this.communityService.deleteCustomerNode(res4[0].id).subscribe((res2) => {

          })
        }
      })
      let DeljsonData = {"node_id":id};
      this.communityService.deleteAllNodeInterestData(DeljsonData).subscribe(res=>{
        
      },err=>{

      });
      this.communityService.deleteAllNodeUserData(DeljsonData).subscribe(res=>{
        
      },err=>{

      });
    }
  }


  public CustomSearch(data: any){
    let searchVal=data.target.value;
    if(searchVal !=''){
      this.items=this.searchPipe(this.allDataList, searchVal);
    }else{
      this.getAllNodes();
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
                  if (item.grpinterest[nestedproperty].interest.name.toString().toLowerCase().includes(toCompare)) {
                      return true;
                  }
                  if (item.grpinterest[nestedproperty].interest.description.toString().toLowerCase().includes(toCompare)) {
                      return true;
                  }
                }
              }
          }
          return false;
      });
  }
}
