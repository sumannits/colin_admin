import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PushnotificationService } from '../../services/pushnotification.service';

@Component({
  selector: 'app-pushnotification',
  templateUrl: './pushnotification.component.html',
  styleUrls: ['./pushnotification.component.css']
})
export class PushnotificationComponent implements OnInit {
  pushnotificationList=[];
  constructor(private router: Router, private pushnotificationService: PushnotificationService) { 

  }

  ngOnInit() {
    this.getAllPushnotifications();
    //this.getAllFaqs();
  }

  public getAllPushnotifications(){
    this.pushnotificationService.getPushnotification().subscribe(res=>{
      //console.log(res);
      this.pushnotificationList=res;
    })
  }
  public deletePushnotification(id){
    //console.log(id);
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){      
      this.pushnotificationService.deletePushnotification(id).subscribe(res=>{
        this.getAllPushnotifications();
      },err=>{

      })
    }
  }

}
