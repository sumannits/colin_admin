import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommunityService } from '../../../services/community.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  public communityId: any;
  public communityDetails: any;
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
        this.communityId = params['id'];        
        this.getCommunityDet(this.communityId);
        this.getSelecteduseIntList(this.communityId);
    });
   }

  ngOnInit() {
  }

  public getCommunityDet(Id){
    this.communityService.getIndividualCommunity(Id).subscribe(res=>{
        this.communityDetails=res;
        this.grpLat = parseFloat(res.latitude);
        this.grpLong = parseFloat(res.longitude);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getSelecteduseIntList(comId){
    let filterUserData = '{"where":{"community_id":'+comId+'}, "include":["customer"]}';
    this.communityService.getInterestList('NodeUsers?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        //console.log(res);
        this.selectedUser=res;
      }
    },err=>{
      
    })
    let filterIntData = '{"where":{"community_id":'+comId+'}, "include":["interest"]}';
    this.communityService.getInterestList('CommunityInterests?filter='+filterIntData).subscribe(res=>{
      if(res.length>0){
        this.selectedInterest = res;
        //console.log(res);
      }
    },err=>{
      
    })
  }


}

