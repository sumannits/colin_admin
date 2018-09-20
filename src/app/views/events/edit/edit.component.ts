import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EventService } from '../../../services/events.service';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
//import {Message} from '../../../alertmsg/api';
//import {Message} from 'primeng/components/common/api';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  //public msgs: Message[] = [];
  public multiSelSettings:IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
  };
  rForm: FormGroup;
  error: string;
  eventId: any;
  description:any;
  is_active = true;
  public activeUser = [];
  public activeUserOpt: IMultiSelectOption[];
  public defaultSelUsrModel: number[] = [];
  public preActiveUser = [];
  
  public selectInterest = [];
  public InterestDropdownList = [];
  public dropdownSettingsInterest = { 
    singleSelection: false, 
    text:"Select Interest",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass custom-class",
    labelKey: "name",
    noDataLabel: "Search Interest...",
    searchBy: ['name', 'description']
  };   
  public selectedIntItems = []; 

  public isLocationSelect:boolean = false;
  public locJsonData:any;

  public editorOptions: Object = {
    placeholderText: 'Description',
    heightMin:'250px',
    events: {
      'froalaEditor.focus': function (e, editor) {
        console.log(editor.selection.get());
      }
    }
  }
  public userSettings: any = {
    inputPlaceholderText: 'Type anything and you will get a location'
  };
  public minDate = new Date();
  public isDateSelect:boolean = false;
  public editEventDate: any;

  constructor(private fb: FormBuilder,private router: Router, private activatedRoute:ActivatedRoute,  private eventService: EventService) { 
    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'description': [],
      'selectedUser' : [],
      'selectedInterest' : [],
      'event_date' : [null, Validators.required],
      'location': [null, Validators.required],
      'latitude': [] ,
      'longitude': [] ,
      'is_active': ''
    });
  }
  goToList() {
    this.router.navigate(['events']);
  }
  ngOnInit() {
    //console.log
    this.activatedRoute.params.subscribe((params: Params) => {
      this.eventId = params['id'];
      this.getIndividualEvent(this.eventId);
  });
  
  this.getActiveUserList();
  this.getActiveIntList();
  this.getSelecteduseIntList();
  }

  public editEvent(event){
    //console.log(event);
    event.is_active = this.is_active;
    this.eventService.editEvent(event,this.eventId).subscribe(res=>{
      let editeventId=this.eventId;

      if(event.selectedUser.length>0){
        let UsrjsonData = {"event_id":editeventId,"selectuser":event.selectedUser};
          this.eventService.addEventUser(UsrjsonData).subscribe(res=>{
          
          },err=>{
            this.error = "Error Occured, please try again"
          })
      }   
    
      if(this.selectedIntItems.length>0){
        this.selectedIntItems.forEach((color: {id: number }) => {
          this.selectInterest.push(color.id);
        });
        
        let IntjsonData = {"event_id":editeventId,"selectinterest":this.selectInterest};
          this.eventService.addEventInterest(IntjsonData).subscribe(res=>{
          
          },err=>{
            this.error = "Error Occured, please try again"
          })
      }
      //this.msgs = [];
      //this.msgs.push({severity:'success', summary:'Success', detail:'Data Saved'});
      this.router.navigate(['/events']);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }


  public autoCompleteCallback1(selectedData:any) {
    this.locJsonData=JSON.parse(JSON.stringify(selectedData));
    this.rForm.controls['location'].setValue(this.locJsonData.data.formatted_address);
    this.rForm.controls['latitude'].setValue(this.locJsonData.data.geometry.location.lat);
    this.rForm.controls['longitude'].setValue(this.locJsonData.data.geometry.location.lng);
    this.isLocationSelect = true;
  }

  public getSelecteduseIntList(){
    let filterUserData = '{"where":{"event_id":'+this.eventId+'}}';
    this.eventService.getFilterDataList('EventUsers?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        //console.log(res);
        res.forEach((color: { customerId: number }) => {
          this.preActiveUser.push(color.customerId);
        });
        this.defaultSelUsrModel=this.preActiveUser;
      }
    },err=>{
      //this.error = "Error Occured, please try again"
    })

    let filterIntData = '{"where":{"event_id":'+this.eventId+'}, "include":["interest"]}';
    this.eventService.getFilterDataList('EventInterests?filter='+filterIntData).subscribe(res=>{
      if(res.length>0){
        res.forEach((color: { interestId: number , interest: {name: string, description:string}}) => {
          this.selectedIntItems.push({
            id: color.interestId,
            name: color.interest.name,
            description: color.interest.description
          });
        });
      }
    },err=>{
      //this.error = "Error Occured, please try again"
    })
  }

  public getActiveIntList(){  
    let filterUserData = '{"where":{"is_active":true, "or":[{"is_hidden":0},{"is_hidden":null}]}}';
    this.eventService.getFilterDataList('interests?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        res.forEach((color: { name: string, id: number, description:string }) => {
          this.InterestDropdownList.push({
            id: color.id,
            name: color.name,
            description: color.description
          });
        });
      }
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getIndividualEvent(Id){
    this.eventService.getIndividualEvent(Id).subscribe(res=>{
     
      this.rForm.controls['name'].setValue(res.name);
      this.rForm.controls['description'].setValue(res.description); 
      this.rForm.controls['location'].setValue(res.location);
      this.rForm.controls['latitude'].setValue(res.latitude);
      this.rForm.controls['longitude'].setValue(res.longitude);
      this.description = res.description;
      this.is_active = res.is_active;
      this.rForm.controls['is_active'].setValue(res.is_active);  
      this.rForm.controls['event_date'].setValue(res.event_date);   
      if(res.location!=''){
        this.userSettings['inputString']=res.location;
        this.userSettings = Object.assign({},this.userSettings);
        this.isLocationSelect = true;
        //console.log(this.userSettings);
      }   
      if(res.event_date!=''){
        this.isDateSelect = true;
        this.editEventDate = new Date(res.event_date);
      }
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public changeIsActive($e: any){
    this.is_active = !this.is_active;
    //console.log(this.is_active);
  }

  public getActiveUserList(){  
    let filterUserData = '{"where":{"is_active":true, "id":{"neq":1}}}';
    this.eventService.getUserList('Customers?filter='+filterUserData).subscribe(res=>{
      //console.log(res);
      if(res.length>0){
        res.forEach((color: { name: string, id: number, image:string }) => {
          this.activeUser.push({
            id: color.id,
            //text: '<div class="newChatFrndList"> <img class="newChatPrfImg" src="'+color.profile_image+'" alt="" /> '+color.name+' </div>'
            name: color.name
          });
        });
        this.activeUserOpt= this.activeUser;
      }
    },err=>{
      this.error = "Error Occured, please try again"
    })
    //console.log(this.activeUser);
  }

  public onChange(item) {
    
  }

  public getSelectDate(data: any) {
    this.isDateSelect=true;
  }
}
