import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../../../services/group.service';
//import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  public groupId: any;
  public detailsData: any;
  public error:any;
  public selectedUser = [];
  public selectedInterest = [];
  public grpLat:number = 0;
  public grpLong:number = 0;
  public isSubGrp:boolean = false;
  public isSubGrpList = [];
  public isParentGrpDet:object = {};
  
  constructor(
    private router: Router, 
    private activatedRoute:ActivatedRoute,  
    private groupService: GroupService
  ) { 
    this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params['id'];        
        this.getGroupDet(this.groupId);
        this.getSelecteduseIntList(this.groupId);
    });
  }

  ngOnInit() {
  }


  public getGroupDet(Id){
    this.groupService.getIndividualGroup(Id).subscribe(res=>{
        this.isSubGrpList = []; 
        this.detailsData=res;
        if(this.detailsData.is_pgroup_id == null || this.detailsData.is_pgroup_id == 0){
          this.isSubGrp=false;
          this.getSubGrpList(Id);
        }else{
          this.isSubGrp=true;
          this.getParentGroupDet(this.detailsData.is_pgroup_id);
        }
        this.grpLat = parseFloat(res.loc_lat);
        this.grpLong = parseFloat(res.loc_long);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getParentGroupDet(pId){
    this.groupService.getIndividualGroup(pId).subscribe(res=>{
        //console.log(res);   
        this.isParentGrpDet=res;
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getSubGrpList(PgrpId){
    let filterUserData = '{"where":{"is_pgroup_id":'+PgrpId+'}}';
    this.groupService.getFilterDataList('UserGroups?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        //console.log(res);
        this.isSubGrpList=res;
      }
    },err=>{
      
    })  
  }
  
  public getSelecteduseIntList(comId){
    let filterUserData = '{"where":{"group_id":'+comId+'}, "include":["customer"]}';
    this.groupService.getFilterDataList('GroupUsers?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        //console.log(res);
        this.selectedUser=res;
      }
    },err=>{
      
    })
    let filterIntData = '{"where":{"group_id":'+comId+'}, "include":["interest"]}';
    this.groupService.getFilterDataList('GroupInterests?filter='+filterIntData).subscribe(res=>{
      if(res.length>0){
        this.selectedInterest = res;
        //console.log(res);
      }
    },err=>{
      
    })
  }

  public deleteGroup(id, pGrpId){
    //console.log(id);
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
}
