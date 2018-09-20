import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  public userId: any;
  public detailsData: object = {};
  public error: any;
  public selectedInterest = [];
  public joinGroup: Array<any> = [];
  public joinEvent: Array<any> = [];
  public joinCommunity: Array<any> = [];
  communityUsersList = [];
  communityList = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId = params['id'];
      this.getUserDet(this.userId);
      this.getSelecteduseIntList(this.userId);
    });

  }


  private getCommunityList() {
    let CommListIdArr=[];
    let filterUserData = '{"where":{"customerId":'+this.detailsData["id"]+'}}';
    this.customerService.getInterestList('NodeUsers?filter='+filterUserData).subscribe((res) => {
      res.forEach(element => {
        let pos = CommListIdArr.indexOf(element.community_id);
        if(pos === -1){
          CommListIdArr.push(element.community_id);
        }
      });
      if(CommListIdArr.length > 0){
        let filterUserData = '{"where":{"id": {"inq": ['+CommListIdArr+']}, "is_active":true}}';
        this.customerService.getInterestList('communities?filter='+filterUserData).subscribe((res) => {
          //console.log(res);
          this.communityUsersList = res;
        }, (err) => {
          console.log(err);
        });
      }
    });  
  }

  ngOnInit() {


  }

  public getUserDet(Id) {
    this.customerService.getIndividualCustomer(Id).subscribe(res => {
      this.detailsData = res;
      this.getCommunityList();
      if (this.detailsData["location"]) {
        this.detailsData["lat"] = Number(this.detailsData["lat"]);
        this.detailsData["lng"] = Number(this.detailsData["lng"]);
      }
    }, err => {
      this.error = "Error Occured, please try again"
    })
  }

  public getSelecteduseIntList(customerId) {

    let filterIntData = '{"where":{"user_id":' + customerId + '}, "include":["interest"]}';
    this.customerService.getInterestList('CustomerInterests?filter=' + filterIntData).subscribe(res => {
      this.selectedInterest = res;
      //console.log(this.selectedInterest);
    }, err => {
      //this.error = "Error Occured, please try again"
    })

    let filterGrpData = '{"where":{"customerId":' + customerId + '}, "include":["groupdet"]}';
    this.customerService.getInterestList('GroupUsers?filter=' + filterGrpData).subscribe(res => {
      this.joinGroup = res;
      //console.log(this.selectedInterest);
    }, err => {
      //this.error = "Error Occured, please try again"
    })

    let filterEventData = '{"where":{"customerId":' + customerId + '}, "include":["eventdet"]}';
    this.customerService.getInterestList('EventUsers?filter=' + filterEventData).subscribe(res => {
      this.joinEvent = res;
    }, err => {
      //this.error = "Error Occured, please try again"
    })

    let filterCommData = '{"where":{"customerId":' + customerId + '}, "include":["community"]}';
    this.customerService.getInterestList('CommunityUsers?filter=' + filterCommData).subscribe(res => {
      this.joinCommunity = res;
      //console.log(this.joinCommunity);
    }, err => {
      //this.error = "Error Occured, please try again"
    })

  }
}
