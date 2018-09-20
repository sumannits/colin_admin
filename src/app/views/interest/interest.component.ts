import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { InterestService } from '../../services/interest.service';
import { DataTableResource } from 'angular-4-data-table';
import * as _ from 'lodash'; 

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})
export class InterestComponent implements OnInit {
  interestList=[];
  itemResource:any;
  items = [];
  itemCount = 0;
  public defaultRec:number=10;
  constructor(private router: Router, private interestService: InterestService) { 

  }

  ngOnInit() {
    this.getAllInterests();
    //this.getAllFaqs();
  }

  public getAllInterests(){
    this.interestService.getInterest().subscribe(res=>{
      this.items = [];
      this.itemResource = new DataTableResource(res);
      this.itemResource.count().then(count => this.itemCount = count);
      this.items=res;
      if(this.items.length>0){
        this.items.forEach((val: any) => {
          let intId=val.id;
          let intDesc = val.description;
          let filterUserData = '{"interestId":'+intId+'}';
          this.interestService.getFilterData('CustomerInterests/count?where='+filterUserData).subscribe(res=>{
            //console.log(res.count);
            val.tot_user = res.count;
          },err=>{
            
          })

          this.interestService.getFilterData('EventInterests/count?where='+filterUserData).subscribe(res=>{
            val.tot_event = res.count;
          },err=>{
            
          })

          this.interestService.getFilterData('GroupInterests/count?where='+filterUserData).subscribe(res=>{
            val.tot_group = res.count;
          },err=>{
            
          })

          this.interestService.getFilterData('CommunityInterests?filter={"where":{"interestId":'+intId+'}, "include":["community"]}').subscribe(res=>{
            let totfillCom =_.filter(res, function(item){
              return item.community.is_active === true;
            });
            val.tot_community = totfillCom.length;
          },err=>{
            
          })    

          // this.interestService.getFilterData('CommunityInterests/count?where='+filterUserData).subscribe(res=>{
          //   val.tot_community = res.count;
          // },err=>{
            
          // })

          this.interestService.getFilterData('InterestMultiples/count?where={"interest_pid":'+intId+'}').subscribe(res=>{
            val.tot_children = res.count;
          },err=>{
            
          })
          if(intDesc!='' && intDesc !=null){
            let equvCnt = intDesc.split(",");
            val.tot_equivalencies = equvCnt.length;
          }else{
            val.tot_equivalencies = 0;
          }
          

        });
        //console.log(this.items);
      }
      if(this.items.length<10){
        this.defaultRec=this.items.length;
      }
      //this.interestList=res;
    })
  }

  public reloadItems(params) {
    //console.log(params);
      this.itemResource.query(params).then(items => this.items = items);
  }

  public deleteInterest(id){
    //console.log(id);
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){      
      this.interestService.deleteInterest(id).subscribe(res=>{
        let DeljsonData = {"interest_pid":id};
        this.interestService.deleteAllGrpInterestData(DeljsonData).subscribe(res=>{
          
        },err=>{
        });

        this.getAllInterests();
      },err=>{

      })
    }
  }

}
