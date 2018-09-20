import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommunityService } from '../../../services/community.service';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
@Component({
  selector: 'app-nodeadd',
  templateUrl: './nodeadd.component.html',
  styleUrls: ['./nodeadd.component.scss']
})
export class NodeaddComponent implements OnInit {
  public communityId: any;
  public communityDetails: object = {};
  public error:any;
  public multiSelSettings:IMultiSelectSettings = {
      enableSearch: true,
      checkedStyle: 'fontawesome',
      buttonClasses: 'btn btn-default btn-block',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
  };
  userList = [];
  rForm: FormGroup;
  public is_active = true;
  public activeUser = [];
  public activeUserOpt: IMultiSelectOption[];
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
    noDataLabel: "Search Interest...",
    searchBy: ['name', 'description']
  };   
  public selectedIntItems = []; 
  public editorOptions: Object = {
    placeholderText: 'Description',
    heightMin:'250px',
    events: {
      'froalaEditor.focus': function (e, editor) {
        //console.log(editor.selection.get());
      }
    }
  }
  public community_opt:object= [{"id":"1","name":"Location"},{ "id":"2","name":"Location with Interest"}];
  public userSettings: any = {
    inputPlaceholderText: 'Type anything and you will get a location'
  };
  public isLocationSelect:boolean = false;
  public locJsonData:any;
  public nodeType:number = 1;
  public getPreviousIntList:Array<any> = [];
  public nearestLoc:string = '';

  constructor(
    private router: Router, 
    private activatedRoute:ActivatedRoute, 
    private fb: FormBuilder, 
    private communityService: CommunityService
  ) { 
    this.activatedRoute.params.subscribe((params: Params) => {
        this.communityId = params['id'];        
        this.getCommunityDet(this.communityId);
        //this.getSelecteduseIntList(this.communityId);
    });
    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'description': [] ,
      'location': [],
      'type': [1, Validators.required],
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
    //   //console.log(err);
    // })
  }
  ngOnInit() {
    this.getActiveUserList();
    this.getActiveIntList(); 
    this.getAllUserList();
  }

  public autoCompleteCallback1(selectedData:any) {
    this.locJsonData=JSON.parse(JSON.stringify(selectedData));
    this.rForm.controls['location'].setValue(this.locJsonData.data.formatted_address);
    this.rForm.controls['latitude'].setValue(this.locJsonData.data.geometry.location.lat);
    this.rForm.controls['longitude'].setValue(this.locJsonData.data.geometry.location.lng);
    this.isLocationSelect = true;
    this.nearestLoc = this.locJsonData.data.name;
  }

  public goToList() {
    this.router.navigate(['community/node_list',this.communityId]);
  }

  public getCommunityDet(Id){
    this.communityService.getIndividualCommunity(Id).subscribe(res=>{
        this.communityDetails=res;
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getActiveIntList(){  
    let prefilterIntData = '{"where":{"community_id":'+this.communityId+'},"include":["grpinterest"]}';
    this.communityService.getInterestList('community_nodes?filter='+prefilterIntData).subscribe(res=>{
      res.forEach(element => {
        if(element.grpinterest.length>0){
          element.grpinterest.forEach(intlist => {
            let foundData = this.getPreviousIntList.find(x=> x==intlist.interestId);
            if(foundData === undefined){
              this.getPreviousIntList.push(intlist.interestId);
            }
          });
        }
      });
    },err=>{
      this.error = "Error Occured, please try again"
    })  
    
    let filterUserData = '{"where":{"is_active":true, "or":[{"is_hidden":0},{"is_hidden":null}]}}';
    this.communityService.getInterestList('interests?filter='+filterUserData).subscribe(res=>{
      if(res.length>0){
        res.forEach((color: { name: string, id: number, description:string }) => {
          let foundIntData = this.getPreviousIntList.find(x=> x==color.id);
          if(foundIntData === undefined){
            this.InterestDropdownList.push({
              id: color.id,
              name: color.name,
              description: color.description
            });
          }
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
  public addNode(community){   
    if(community.type == '2'){
      let IntSelName = '';
      if(this.selectedIntItems.length>0){
        IntSelName = this.selectedIntItems[0].name;
      }
      community.name = community.name +' - '+IntSelName+' - '+this.nearestLoc;
    }else{
      if(this.nearestLoc!= ''){
        community.name = community.name +' - '+this.nearestLoc;
      }
    } 
    community.is_active = this.is_active;
    community.community_id = this.communityId;
    let selInt:any;
    this.communityService.addNodeData(community).subscribe(res=>{
      let lastCommunityId=res.id;
      if(this.selectedIntItems.length>0){
        this.selectedIntItems.forEach((color: {id: number }) => {
          this.selectInterest.push(color.id);
        });
        
        let IntjsonData = {"node_id":lastCommunityId,"selectinterest":this.selectInterest};
        this.communityService.addNodeInterest(IntjsonData).subscribe(res=>{
        
        },err=>{
          this.error = "Error Occured, please try again"
        })
        selInt = this.selectedIntItems[0].id;
        this.getLocationWiseUserList(lastCommunityId, community, selInt);
      }else{
        this.getLocationWiseUserList(lastCommunityId, community, selInt);
      }

    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getLocationWiseUserList(nodeId:number, community:any, selInterest:any){
    let customerNodeList = [];
    let selLat = Number(community.latitude);
    let selLang = Number(community.longitude);
    if(selInterest){
      let filterUserData = '{"where":{"interestId":'+selInterest+', "customerId":{"neq":1}}, "include":["customer"]}';
      this.communityService.getUserList('CustomerInterests?filter='+filterUserData).subscribe(res=>{
        //this.allUserList=res;
        if(res.length>0){
            res.forEach((user: any) => {
              if(user.customer.is_active){
                let distance = this.calcCrow(selLat, selLang, Number(user.customer.lat), Number(user.customer.lng));
                if (distance < 1) {
                  let data1 = { cDate: new Date(), customerId: user.customer.id, node_id: nodeId, community_id: this.communityId };
                  customerNodeList.push(data1);
                }
              }
            });
            if(customerNodeList.length>0){
              this.createNode(nodeId,customerNodeList);
            }
        }
      },err=>{
        this.error = "Error Occured, please try again"
      })
    }else{
      let filterUserData = '{"where":{"is_active":true, "id":{"neq":1}}}';
      this.communityService.getUserList('Customers?filter='+filterUserData).subscribe(res=>{
        if(res.length>0){
            res.forEach((user: any) => {
              if(user.is_active){
                let distance = this.calcCrow(selLat, selLang, Number(user.lat), Number(user.lng));
                if (distance < 1) {
                  let data1 = { cDate: new Date(), customerId: user.id, node_id: nodeId, community_id: this.communityId };
                  customerNodeList.push(data1);
                }
              }
            });
            this.createNode(nodeId,customerNodeList);
        }
      },err=>{
        this.error = "Error Occured, please try again"
      })
    }
  }

  public createNode(nodeId:number, custNodeList:Array<any>){
    let selectedUser:Array<any> = [];
    if(custNodeList.length>0){
      
      const data = { "selectuser": custNodeList, node_id: nodeId, community_id:this.communityId};
      this.communityService.addUserCommunityNodes(data).subscribe((res2) => {
      }, (err4) => {
        this.error = "Error Occured, please try again";
        //window.scrollTo(0, 0);
      })
      this.router.navigate(['community/node_list',this.communityId]);
    }else{
      this.router.navigate(['community/node_list',this.communityId]);
    }  
  }


  public changeIsActive($e: any){
    this.is_active = !this.is_active;
  }

  public onChange(item) {
    
  }
  
  public onChangeType(value){
    if(value==1){
      this.isLocationSelect = false;
    }else{
      this.isLocationSelect = false;
      this.selectedIntItems = [];
    }
  }
}
