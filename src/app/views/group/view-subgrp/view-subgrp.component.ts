import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { GroupService } from '../../../services/group.service';
import { DataTableResource } from 'angular-4-data-table';

@Component({
  selector: 'app-view-subgrp',
  templateUrl: './view-subgrp.component.html',
  styleUrls: ['./view-subgrp.component.scss']
})
export class ViewSubgrpComponent implements OnInit {
  public groupId: any;
  public detailsData: object={};
  public error:any;
  itemResource:any;
  items = [];
  itemCount = 0;
  public defaultRec:number=10;
  public allDataList = [];

  constructor(
    private router: Router, 
    private activatedRoute:ActivatedRoute,  
    private groupService: GroupService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params['id'];        
        this.getGroupDet(this.groupId);
    });
   }

  ngOnInit() {
  }

  public getGroupDet(Id){
    this.groupService.getIndividualGroup(Id).subscribe(res=>{
        this.detailsData=res;
        this.getSubGrpList(Id);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getSubGrpList(PgrpId){
    let filterUserData = '{"where":{"is_pgroup_id":'+PgrpId+'}, "include":[{"grpinterest": ["interest"]}, "grpuser"]}';
    this.groupService.getFilterDataList('UserGroups?filter='+filterUserData).subscribe(res=>{
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
    },err=>{
      
    })  
  }

  public deleteGroup(id, pGrpId){
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){      
      this.groupService.deleteGroupData(id).subscribe(res=>{
        this.getGroupDet(pGrpId);
      },err=>{

      })
      let DeljsonData = {"group_id":id};
      this.groupService.deleteAllGrpInterestData(DeljsonData).subscribe(res=>{
        
      },err=>{

      });
      this.groupService.deleteAllGrpUserData(DeljsonData).subscribe(res=>{
        
      },err=>{

      });
    }
  }

  public reloadItems(params) {
    if(this.items.length > 0){
      this.itemResource.query(params).then(items => this.items = items);
    }    
  }

  public CustomSearch(data: any){
    let searchVal=data.target.value;
    if(searchVal !=''){
      this.items=this.searchPipe(this.allDataList, searchVal);
    }else{
      this.getSubGrpList(this.groupId);
    }
    //console.log(data.target.value);
  }

  public searchPipe(items, sdata){
      const /** @type {?} */ toCompare = sdata.toLowerCase();
      return items.filter(function (item) {
          for (let /** @type {?} */ property in item) {
            //console.log(item);
              if (item[property] === null) {
                  continue;
              }
              if (item[property].toString().toLowerCase().includes(toCompare)) {
                  return true;
              }
              if (item.grpinterest.length > 0) {
                //console.log(item[property]);
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
