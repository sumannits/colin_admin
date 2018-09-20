import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommunityService } from '../../../services/community.service';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-nodeedit',
  templateUrl: './nodeedit.component.html',
  styleUrls: ['./nodeedit.component.scss']
})
export class NodeeditComponent implements OnInit {

  public multiSelSettings:IMultiSelectSettings = {
      enableSearch: true,
      checkedStyle: 'fontawesome',
      buttonClasses: 'btn btn-default btn-block',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
  };
userList=[];
  rForm: FormGroup;
  error: string;
  nodeId: any;
  is_active = true;
  public commId: any;
  public comDetails:object = {};
  public activeUser = [];
  public activeUserOpt: IMultiSelectOption[];

  public defaultSelUsrModel: number[] = [];
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
    inputPlaceholderText: 'Type anything and you will get a location'
  };
  public isLocationSelect:boolean = true;
  public locJsonData:any;
  public nodeType:number = 1;
  public disabledSelBox:boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private activatedRoute:ActivatedRoute,  
    private communityService: CommunityService
  ) { 
    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'description': [],
      'location': [],
      'type': [],
      'latitude': [] ,
      'longitude': [] ,
      'is_active': '',
      'selectedUser' : [],
      'selectedInterest' : []
    });
  }
  private getAllUserList() {

    // this.communityService.getAllCustomers().subscribe((res) => {
    //   this.userList = res;
    // }, (err) => {
    //   console.log(err);
    // })
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.nodeId = params['id'];        
        this.getNodeDet(this.nodeId);
    });
    this.getActiveUserList();
    this.getActiveIntList();
    this.getSelecteduseIntList();
    this.getAllUserList();
  }


  public getNodeDet(Id){
    this.communityService.getFilterData('community_nodes/'+Id).subscribe(res=>{
      this.rForm.controls['name'].setValue(res.name);
      this.rForm.controls['description'].setValue(res.description); 
      this.rForm.controls['type'].setValue(res.type);
      this.rForm.controls['location'].setValue(res.location);
      this.rForm.controls['latitude'].setValue(res.latitude);
      this.rForm.controls['longitude'].setValue(res.longitude);
      this.is_active = res.is_active;
      this.rForm.controls['is_active'].setValue(res.is_active);   
      this.nodeType =  res.type;        
      if(res.location!=''){
        this.userSettings['inputString']=res.location;
        this.userSettings = Object.assign({},this.userSettings);
        this.isLocationSelect = true;
      }
      this.getCommunityDet(res.community_id);
      this.commId=res.community_id;
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public changeIsActive($e: any){
    this.is_active = !this.is_active;
  }

  public onChange(item) {
    
  }

  public onChangeType(value){
    if(value==1){
      this.isLocationSelect = true;
    }else{
      this.isLocationSelect = true;
    }
  }

  public autoCompleteCallback1(selectedData:any) {
    this.locJsonData=JSON.parse(JSON.stringify(selectedData));
    this.rForm.controls['location'].setValue(this.locJsonData.data.formatted_address);
    this.rForm.controls['latitude'].setValue(this.locJsonData.data.geometry.location.lat);
    this.rForm.controls['longitude'].setValue(this.locJsonData.data.geometry.location.lng);
    this.isLocationSelect = true;
  }

  public getSelecteduseIntList(){
    let filterUserData = '{"where":{"node_id":'+this.nodeId+'}}';
    this.communityService.getFilterData('NodeUsers?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        res.forEach((color: { customerId: number }) => {
          this.preActiveUser.push(color.customerId);
        });
        this.defaultSelUsrModel=this.preActiveUser;
      }
    },err=>{
      //this.error = "Error Occured, please try again"
    })

    let filterIntData = '{"where":{"node_id":'+this.nodeId+'}, "include":["interest"]}';
    this.communityService.getFilterData('NodeInterests?filter='+filterIntData).subscribe(res=>{
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
    //console.log(this.activeInterestList);
  }

  public getActiveUserList(){  
    let filterUserData = '{"where":{"is_active":true, "id":{"neq":1}}}';
    this.communityService.getUserList('Customers?filter='+filterUserData).subscribe(res=>{
      //console.log(res);
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
    this.router.navigate(['community/node_list',this.commId]);
  }
  
  public getCommunityDet(Id){
    this.communityService.getIndividualCommunity(Id).subscribe(res=>{
        this.comDetails=res;
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }
  calcCrow(lat1, lon1, lat2, lon2) {
    let R = 6371; // km
    let dLat = this.toRad(lat2 - lat1);
    let dLon = this.toRad(lon2 - lon1);
    let latitude1 = this.toRad(lat1);
    let latitude2 = this.toRad(lat2);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latitude1) * Math.cos(latitude2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  }


  toRad(Value) {
    return Value * Math.PI / 180;
  }
  public editNodeData(community){   
    community.is_active = this.is_active;
    this.communityService.editNode(community,this.nodeId).subscribe(res=>{  
      let lastCommunityId=this.nodeId;
      // if(this.selectedIntItems.length>0){
      //   this.selectedIntItems.forEach((color: {id: number }) => {
      //     this.selectInterest.push(color.id);
      //   });
        
      //   let IntjsonData = {"node_id":lastCommunityId,"selectinterest":this.selectInterest};
      //     this.communityService.addNodeInterest(IntjsonData).subscribe(res=>{
          
      //     },err=>{
      //       this.error = "Error Occured, please try again"
      //     })
      // }
      
      // let customerNodeList = [];
      // const communityLat = Number(community.latitude);
      // const communityLng = Number(community.longitude);
      // for (let i = 0; i < this.userList.length; i++) {
      //   if (this.userList[i].lat)
      //   {
      //     let distance = this.calcCrow(communityLat, communityLng, Number(this.userList[i].lat), Number(this.userList[i].lng));
      //     if (distance < 1) {
      //       let data1 = { cDate: new Date(), customerId: this.userList[i].id, node_id: this.nodeId, community_id: this.commId }
      //       customerNodeList.push(data1);
      //     }
      //   }
      

      // }
      // const data = { "selectuser": customerNodeList, node_id: this.nodeId, community_id:this.commId};
      // this.communityService.addUserCommunityNodes(data).subscribe((res2) => {
      // }, (err4) => {
      //   this.error = "Error Occured, please try again";
      //  // window.scrollTo(0, 0);
      // })
      this.router.navigate(['community/node_list',this.commId]);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }
}
