import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { GroupService } from '../../../services/group.service';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  public multiSelSettings:IMultiSelectSettings = {
      enableSearch: true,
      checkedStyle: 'fontawesome',
      buttonClasses: 'btn btn-default btn-block',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
  };

  rForm: FormGroup;
  error: string;
  groupId: any;
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
    placeholderText: 'Answer',
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
  public isSubGrp:boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private activatedRoute:ActivatedRoute,  
    private groupService: GroupService
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
    this.activatedRoute.params.subscribe((params: Params) => {
        this.groupId = params['id'];        
        this.getGroupData(this.groupId);
    });
    
    this.getActiveIntList();
    this.getSelecteduseIntList();
  }

  public autoCompleteCallback1(selectedData:any) {
    this.locJsonData=JSON.parse(JSON.stringify(selectedData));
    this.rForm.controls['location'].setValue(this.locJsonData.data.formatted_address);
    this.rForm.controls['loc_lat'].setValue(this.locJsonData.data.geometry.location.lat);
    this.rForm.controls['loc_long'].setValue(this.locJsonData.data.geometry.location.lng);
    this.isLocationSelect = true;
  }

  public getGroupData(Id){
    this.groupService.getIndividualGroup(Id).subscribe(res=>{
      
      if(res.is_pgroup_id == null || res.is_pgroup_id == 0){
        this.isSubGrp=false;
        this.getActiveUserList();
      }else{
        this.isSubGrp=true;
        this.getSubGrpActiveUserList(res.is_pgroup_id);
      }
      this.rForm.controls['name'].setValue(res.name);
      this.rForm.controls['location'].setValue(res.location);
      this.rForm.controls['loc_lat'].setValue(res.loc_lat);
      this.rForm.controls['loc_long'].setValue(res.loc_long);
      this.rForm.controls['description'].setValue(res.description); 
      this.is_active = res.is_active;
      this.rForm.controls['is_active'].setValue(res.is_active);             
      if(res.location!=''){
        this.userSettings['inputString']=res.location;
        this.userSettings = Object.assign({},this.userSettings);
        this.isLocationSelect = true;
        //console.log(this.userSettings);
      }
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getSelecteduseIntList(){
    let filterUserData = '{"where":{"group_id":'+this.groupId+'}}';
    this.groupService.getFilterDataList('GroupUsers?filter='+filterUserData).subscribe(res=>{
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

    let filterIntData = '{"where":{"group_id":'+this.groupId+'}, "include":["interest"]}';
    this.groupService.getFilterDataList('GroupInterests?filter='+filterIntData).subscribe(res=>{
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
    this.groupService.getFilterDataList('interests?filter='+filterUserData).subscribe(res=>{
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
  
  public getSubGrpActiveUserList(pgroupId){  
    this.activeUserOpt = [];
    let filterUserData = '{"where":{"group_id":'+pgroupId+'}, "include":["customer"]}';
    this.groupService.getFilterDataList('GroupUsers?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        res.forEach((color: {customerId: number, customer: {name: string} }) => {
          this.activeUser.push({
            id: color.customerId,
            name: color.customer.name
          });
        });
        this.activeUserOpt= this.activeUser;
      }
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getActiveUserList(){  
    this.activeUserOpt = [];
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

  public editData(data){   
    data.is_active = this.is_active;

    //console.log(community);
    this.groupService.updateData(data,this.groupId).subscribe(res=>{  
      let lastGrpId=this.groupId;
      
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
      //this.getSelecteduseIntList();
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
    this.router.navigate(['/group']);
  }

}
