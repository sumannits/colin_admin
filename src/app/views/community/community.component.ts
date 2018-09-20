import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CommunityService } from '../../services/community.service';
import { DataTableResource } from 'angular-4-data-table';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  itemResource:any;
  items = [];
  itemCount = 0;
  public defaultRec:number=10;
  public allDataList = [];

  constructor(private router: Router, private communityService: CommunityService) { 

  }

  ngOnInit() {
    this.getAllCommunities();
    //this.getAllFaqs();
  }

  public getAllCommunities(){
    this.communityService.getCommunity().subscribe(res=>{
      this.items = [];
      //this.customerList=res;
      this.itemResource = new DataTableResource(res);
      this.itemResource.count().then(count => this.itemCount = count);
      
      res.forEach((val: any) => {
        this.communityService.getUserList('NodeUsers/count?where={"community_id":'+val.id+'}').subscribe(res=>{
          val.tot_user = res.count;
        },err=>{
          
        })
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

  public deleteCommunity(id){
    //console.log(id);
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){      
      this.communityService.deleteCommunity(id).subscribe(res=>{
        this.getAllCommunities();
      },err=>{

      })
      let DeljsonData = {"community_id":id};
      this.communityService.deleteAllGrpInterestData(DeljsonData).subscribe(res=>{
        
      },err=>{

      });
      this.communityService.deleteAllGrpUserData(DeljsonData).subscribe(res=>{
        
      },err=>{

      });

      this.communityService.deleteAllCustNodeUserData(DeljsonData).subscribe(res=>{
        
      },err=>{

      });
    }
  }


  public CustomSearch(data: any){
    let searchVal=data.target.value;
    if(searchVal !=''){
      this.items=this.searchPipe(this.allDataList, searchVal);
    }else{
      this.getAllCommunities();
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
