import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { InterestService } from '../../../services/interest.service';
import * as _ from 'lodash'; 

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  error: string;
  interestId: any;
  InterestDet: object = {};
  tot_user:Array <any> = [];
  tot_event:Array <any> = [];
  tot_group:Array <any> = [];
  tot_community:Array <any> = [];
  subCatList:Array <any> = [];
  mainIntDet: object = {};

  // public joinEvent:Array <any> = [];
  // public joinCommunity:Array <any> = [];
  // public joinUser:Array <any> = [];

  constructor(
    router: Router, 
    private activatedRoute:ActivatedRoute,  
    private interestService: InterestService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.interestId = params['id'];        
        this.getIndividualInterest(this.interestId);
    });
   }

  ngOnInit() {

  }

  public getIndividualInterest(Id){
    this.interestService.getIndividualInterest(Id).subscribe(res=>{
        let intDesc = res.description;
        if(intDesc!='' && intDesc !=null){
          let equvCnt = intDesc.split(",");
          res.tot_equivalencies = equvCnt.length;
        }else{
          res.tot_equivalencies = 0;
        }
        this.InterestDet = res;
        
          if(res.is_pid > 0){
              //this.interestService.getFilterData('interests?filter={"where":{"id":'+res.is_pid+'}}').subscribe(res=>{
              this.interestService.getFilterData('interests/'+res.is_pid).subscribe(res=>{  
                this.mainIntDet = res;
                //console.log(res);
              },err=>{
                
              })
          }else{
            this.interestService.getFilterData('InterestMultiples?filter={"where":{"interest_pid":'+res.id+'}, "include":["interest"]}').subscribe(res=>{
                this.subCatList = res;
                //console.log(res);
              },err=>{
                
              })
          }
          this.interestService.getFilterData('CustomerInterests?filter={"where":{"interestId":'+Id+'}, "include":["customer"]}').subscribe(res=>{
            //console.log(res.count);
            this.tot_user = res;
          },err=>{
            
          })

          this.interestService.getFilterData('EventInterests?filter={"where":{"interestId":'+Id+'}, "include":["eventdet"]}').subscribe(res=>{
            this.tot_event = res;
          },err=>{
            
          })

          this.interestService.getFilterData('GroupInterests?filter={"where":{"interestId":'+Id+'}, "include":["groupdet"]}').subscribe(res=>{
            this.tot_group = res;
          },err=>{
            
          })

          this.interestService.getFilterData('CommunityInterests?filter={"where":{"interestId":'+Id+'}, "include":["community"]}').subscribe(res=>{
            this.tot_community =_.filter(res, function(item){
              return item.community.is_active === true;
            });
          },err=>{
            
          })          
      
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

}
