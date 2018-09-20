import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommunityService } from '../../../services/community.service';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
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
  communityId: any;
  is_active = true;
  public disabledSelBox:boolean = true;
  public activeUser = [];
  public activeUserOpt: IMultiSelectOption[];
  
  public defaultSelUsrModel: number[] = [];
  //public defaultSelIntModel: number[] = [];
  public preActiveUser = [];
  public preActiveInterestList = [];

  public selectInterest = [];
  public InterestDropdownList = [];
  public dropdownSettingsInterest = { 
    singleSelection: true, 
    text:"Select Interest",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass custom-class",
    labelKey: "name",
    disabled: true,
    noDataLabel: "Search Interest...",
    searchBy: ['name', 'description']
  };   
  public selectedIntItems = []; 

  public editorOptions: Object = {
    placeholderText: 'Answer',
    heightMin:'250px',
    events: {
      'froalaEditor.focus': function (e, editor) {
        console.log(editor.selection.get());
      }
    }
  }
  public community_opt:object= [{"id":"1","name":"Location"},{ "id":"2","name":"Location with Interest"}];
  public userSettings: any = {
    showSearchButton:false,
    inputPlaceholderText: 'Type anything and you will get a location'
  };
  public isLocationSelect:boolean = true;
  public locJsonData:any;
  public nodeType:number = 1;

  constructor(private fb: FormBuilder,private router: Router, private activatedRoute:ActivatedRoute,  private communityService: CommunityService) {
    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'description': [],
      'location': [],
      'community_type': [],
      'latitude': [] ,
      'longitude': [] ,
      'is_active': '',
      'selectedUser' : [],
      'selectedInterest' : []
    });

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.communityId = params['id'];        
        this.getIndividualCommunity(this.communityId);
    });
    this.getActiveUserList();
    this.getActiveIntList();
    this.getSelecteduseIntList();
  }

  public autoCompleteCallback1(selectedData:any) {
    this.locJsonData=JSON.parse(JSON.stringify(selectedData));
    this.rForm.controls['location'].setValue(this.locJsonData.data.formatted_address);
    this.rForm.controls['latitude'].setValue(this.locJsonData.data.geometry.location.lat);
    this.rForm.controls['longitude'].setValue(this.locJsonData.data.geometry.location.lng);
    this.isLocationSelect = true;
  }

  public getSelecteduseIntList(){
    let filterUserData = '{"where":{"community_id":'+this.communityId+'}}';
    this.communityService.getInterestList('CommunityUsers?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        res.forEach((color: { customerId: number }) => {
          this.preActiveUser.push(color.customerId);
        });
        this.defaultSelUsrModel=this.preActiveUser;
      }
    },err=>{
      //this.error = "Error Occured, please try again"
    })

    let filterIntData = '{"where":{"community_id":'+this.communityId+'}, "include":["interest"]}';
    this.communityService.getInterestList('CommunityInterests?filter='+filterIntData).subscribe(res=>{
      if(res.length>0){
        res.forEach((color: { interestId: number , interest: {name: string, description:string}}) => {
          // console.log(color);
          // console.log(color.interest.name);
          this.selectedIntItems.push({
            id: color.interestId,
            name: color.interest.name,
            description: color.interest.description
          });
        });
        //this.defaultSelIntModel=this.preActiveInterestList;
      }
    },err=>{
      //this.error = "Error Occured, please try again"
    })
  }

  public getActiveIntList(){  
    let filterUserData = '{"where":{"is_active":true, "or":[{"is_hidden":0},{"is_hidden":null}]}}';
    this.communityService.getInterestList('interests?filter='+filterUserData).subscribe(res=>{
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

  public getActiveUserList(){  
    let filterUserData = '{"where":{"is_active":true, "id":{"neq":1}}}';
    this.communityService.getUserList('Customers?filter='+filterUserData).subscribe(res=>{
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
    //console.log(this.activeUser);
  }

  goToList() {
    this.router.navigate(['community']);
  }

  public editCommunity(community){   
    community.is_active = this.is_active;
    //console.log(community);
    this.communityService.editCommunity(community,this.communityId).subscribe(res=>{  
      let lastCommunityId=this.communityId;

      // if(this.selectedIntItems.length>0){
      //   this.selectedIntItems.forEach((color: {id: number }) => {
      //     this.selectInterest.push(color.id);
      //   });
        
      //   let IntjsonData = {"community_id":lastCommunityId,"selectinterest":this.selectInterest};
      //     this.communityService.addCommunityInterest(IntjsonData).subscribe(res=>{
          
      //     },err=>{
      //       this.error = "Error Occured, please try again"
      //     })
      // }
      
      // if(community.selectedUser.length>0){
      //   let UsrjsonData = {"community_id":lastCommunityId,"selectuser":community.selectedUser};
      //     this.communityService.addCommunityUser(UsrjsonData).subscribe(res=>{
          
      //     },err=>{
      //       this.error = "Error Occured, please try again"
      //     })
      // }
      //this.getSelecteduseIntList();
      this.router.navigate(['/community']);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getIndividualCommunity(Id){
    this.communityService.getIndividualCommunity(Id).subscribe(res=>{
      
      this.rForm.controls['name'].setValue(res.name);
      this.rForm.controls['description'].setValue(res.description); 
      this.rForm.controls['community_type'].setValue(res.community_type);
      this.rForm.controls['location'].setValue(res.location);
      this.rForm.controls['latitude'].setValue(res.latitude);
      this.rForm.controls['longitude'].setValue(res.longitude);
      this.is_active = res.is_active;
      this.rForm.controls['is_active'].setValue(res.is_active);   
      this.nodeType =  res.community_type;        
      if(res.location!=''){
        this.userSettings['inputString']=res.location;
        this.userSettings = Object.assign({},this.userSettings);
        this.isLocationSelect = true;
      }
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public changeIsActive($e: any){
    this.is_active = !this.is_active;
    //console.log(this.is_active);
  }

  public onChange(item) {
    
  }

  public onChangeType(value){
    if(value==1){
      //this.rForm.controls['location'].setValue('');
      //this.rForm.controls['latitude'].setValue('');
      //this.rForm.controls['longitude'].setValue('');
      this.isLocationSelect = true;
    }else{
      this.isLocationSelect = true;
    }
  }
}
