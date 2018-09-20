import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { GroupService } from '../../../services/group.service';
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
  rForm: FormGroup;
  error: string;
  public is_active:boolean = true;
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
  //public selectedUser: any;
  public editorOptions: Object = {
    placeholderText: 'Description',
    heightMin:'250px',
    events: {
      'froalaEditor.focus': function (e, editor) {
        //console.log(editor.selection.get());
      }
    }
  }
  public userSettings: any = {
    inputPlaceholderText: 'Type anything and you will get a location'
  };

  constructor(
    private fb: FormBuilder,
     private router: Router, 
     private groupService: GroupService,
  ) {
    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'location': [null, Validators.required],
      'loc_lat': [] ,
      'loc_long': [] ,
      'description': [] ,
      'is_active': '',
      'selectedUser' : [],
      'selectedInterest' : []        
    });

   }

  ngOnInit() {
    this.getActiveUserList();
    this.getActiveIntList();
  }

  public autoCompleteCallback1(selectedData:any) {
    this.locJsonData=JSON.parse(JSON.stringify(selectedData));
    this.rForm.controls['location'].setValue(this.locJsonData.data.formatted_address);
    this.rForm.controls['loc_lat'].setValue(this.locJsonData.data.geometry.location.lat);
    this.rForm.controls['loc_long'].setValue(this.locJsonData.data.geometry.location.lng);
    this.isLocationSelect = true;
  }

  public getActiveIntList(){  
    let filterUserData = '{"where":{"is_active":true, "or":[{"is_hidden":0},{"is_hidden":null}]}}';
    this.groupService.getFilterDataList('interests?filter='+filterUserData).subscribe(res=>{
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

  public getActiveUserList(){  
    let filterUserData = '{"where":{"is_active":true, "id":{"neq":1}}}';
    this.groupService.getFilterDataList('Customers?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        res.forEach((color: { name: string, id: number, image:string }) => {
          this.activeUser.push({
            id: color.id,
            name: color.name
          });
        });
        this.activeUserOpt= this.activeUser;
      }
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public addData(data){   
    data.is_active = this.is_active;
    //console.log(community);
    this.groupService.insertData(data).subscribe(res=>{
      let lastGrpId=res.id;
      
      if(this.selectedIntItems.length>0){
        this.selectedIntItems.forEach((color: {id: number }) => {
          this.selectInterest.push(color.id);
        });
        
        let IntjsonData = {"group_id":lastGrpId,"selectinterest":this.selectInterest};
          this.groupService.addGroupInterest(IntjsonData).subscribe(res=>{
          
          },err=>{
            this.error = "Error Occured, please try again"
          })
      }
      
      if(data.selectedUser.length>0){
        let UsrjsonData = {"group_id":lastGrpId,"selectuser":data.selectedUser};
          this.groupService.addGroupUser(UsrjsonData).subscribe(res=>{
          
          },err=>{
            this.error = "Error Occured, please try again"
          })
      }
      this.router.navigate(['/group']);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public changeIsActive($e: any){
    this.is_active = !this.is_active;
  }

  public onChange(item) {
    
  }

  goToList() {
    this.router.navigate(['group']);
  }

}
