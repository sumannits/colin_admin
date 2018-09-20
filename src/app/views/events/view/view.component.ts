import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EventService } from '../../../services/events.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  public eventId: any;
  public eventDetails: any;
  public error:any;
  public selectedUser = [];
  public selectedInterest = [];
  public grpLat:number = 0;
  public grpLong:number = 0;

  constructor(
    private router: Router, 
    private activatedRoute:ActivatedRoute,  
    private eventService: EventService
  ) { 
    this.activatedRoute.params.subscribe((params: Params) => {
        this.eventId = params['id'];        
        this.getIndividualEvent(this.eventId);
        this.getSelecteduseIntList(this.eventId);
    });
  }

  ngOnInit() {
  }

  public getIndividualEvent(Id){
    this.eventService.getIndividualEvent(Id).subscribe(res=>{
        this.eventDetails=res;
        this.grpLat = parseFloat(res.latitude);
        this.grpLong = parseFloat(res.longitude);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getSelecteduseIntList(comId){
    let filterUserData = '{"where":{"event_id":'+comId+'}, "include":["customer"]}';
    this.eventService.getFilterDataList('EventUsers?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        this.selectedUser=res;
      }
    },err=>{
      
    })
    let filterIntData = '{"where":{"event_id":'+comId+'}, "include":["interest"]}';
    this.eventService.getFilterDataList('EventInterests?filter='+filterIntData).subscribe(res=>{
      if(res.length>0){
        this.selectedInterest = res;
      }
    },err=>{
      
    })
  }
}
