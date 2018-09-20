import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommunityService } from '../../../services/community.service';

@Component({
  selector: 'app-nodeview',
  templateUrl: './nodeview.component.html',
  styleUrls: ['./nodeview.component.scss']
})
export class NodeviewComponent implements OnInit {
  public nodeId: any;
  public nodeDetails: object = {};
  public comDetails: object = {};
  public error:any;
  public selectedUser = [];
  public selectedInterest = [];
  public grpLat:number = 0;
  public grpLong:number = 0;

  constructor(
    private router: Router, 
    private activatedRoute:ActivatedRoute,  
    private communityService: CommunityService
  ) { 
    this.activatedRoute.params.subscribe((params: Params) => {
        this.nodeId = params['id'];        
        this.getNodeDet(this.nodeId);
        this.getSelecteduseIntList(this.nodeId);
    });
  }


  ngOnInit() {
  }

  public getNodeDet(Id){
    this.communityService.getFilterData('community_nodes/'+Id).subscribe(res=>{
        this.nodeDetails=res;
        this.grpLat = parseFloat(res.latitude);
        this.grpLong = parseFloat(res.longitude);
        this.getCommunityDet(res.community_id);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getCommunityDet(Id){
    this.communityService.getIndividualCommunity(Id).subscribe(res=>{
        this.comDetails=res;
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getSelecteduseIntList(comId){
    let filterUserData = '{"where":{"node_id":'+comId+'}, "include":["customer"]}';
    this.communityService.getFilterData('NodeUsers?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        this.selectedUser=res;
      }
    },err=>{
      
    })
    let filterIntData = '{"where":{"node_id":'+comId+'}, "include":["interest"]}';
    this.communityService.getFilterData('NodeInterests?filter='+filterIntData).subscribe(res=>{
      if(res.length>0){
        this.selectedInterest = res;
      }
    },err=>{
      
    })
  }

}
