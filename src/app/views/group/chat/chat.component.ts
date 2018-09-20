import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../../../services/group.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public groupId: any;
  public detailsData: object = {};
  public error:any;
  public chatList = [];

  constructor(
    private router: Router, 
    private activatedRoute:ActivatedRoute,  
    private groupService: GroupService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params['id'];        
        this.getGroupDet(this.groupId);
        this.getGrpChatList(this.groupId);
    });
   }

  ngOnInit() {
  }

  public getGroupDet(Id){
    this.groupService.getIndividualGroup(Id).subscribe(res=>{
        this.detailsData=res;
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getGrpChatList(grpId){
    let filterUserData = '{"where":{"groupId":'+grpId+'}, "include":["customer"]}';
    this.groupService.getFilterDataList('groupchats?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        //console.log(res);
        this.chatList=res;
      }
    },err=>{
      
    })  
  }

}
