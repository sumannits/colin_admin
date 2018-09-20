import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EventService } from '../../../services/events.service';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  public multiSelSettings:IMultiSelectSettings = {
      enableSearch: true,
      checkedStyle: 'fontawesome',
      buttonClasses: 'btn btn-default btn-block',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
  };
  date: string;
  rForm: FormGroup;
  error: string;
  is_active = true;
  public activeUser = [];
  public activeUserOpt: IMultiSelectOption[];
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

  constructor(private fb: FormBuilder, private router: Router, private eventService: EventService) {
    this.rForm = fb.group({
      'name': [null, Validators.required],
      'description': [] ,
      'selectedUser' : [],
      'selectedInterest' : [],
      'event_date' : [null, Validators.required],
      'location': [null, Validators.required],
      'latitude': [] ,
      'longitude': [] ,
      'is_active': '' 
    });
  }
  goToList()
  {
    this.router.navigate(['events']);
  }
  ngOnInit() {
    this.getActiveUserList();
    this.getActiveIntList();
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
        //this.InterestDropdownList=this.activeInterestList;
      }
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

  public addEvent(event) {
    event.is_active = this.is_active;
    //console.log(event);
    this.eventService.addEvent(event).subscribe(res => {
      //console.log(res);
      let lastEventId=res.id;
      if(event.selectedUser.length>0){
        let UsrjsonData = {"event_id":lastEventId,"selectuser":event.selectedUser};
          this.eventService.addEventUser(UsrjsonData).subscribe(res=>{
          
          },err=>{
            this.error = "Error Occured, please try again"
          })
      }   
      
      if(this.selectedIntItems.length>0){
        this.selectedIntItems.forEach((color: {id: number }) => {
          this.selectInterest.push(color.id);
        });
        
        let IntjsonData = {"event_id":lastEventId,"selectinterest":this.selectInterest};
          this.eventService.addEventInterest(IntjsonData).subscribe(res=>{
          //console.log(res);
          },err=>{
            this.error = "Error Occured, please try again"
          })
      } 
      this.router.navigate(['/events']);
    }, err => {
      this.error = 'Error Occured, please try again'
    })
  }
  
  public changeIsActive($e: any) {
    this.is_active = !this.is_active;
    // console.log(this.is_active);
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
    //let newDay = new Date(data).getDay();
    //console.log(data);
  }
}
