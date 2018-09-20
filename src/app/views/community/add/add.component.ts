import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommunityService } from '../../../services/community.service';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  //@ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;

  public multiSelSettings:IMultiSelectSettings = {
      enableSearch: true,
      checkedStyle: 'fontawesome',
      buttonClasses: 'btn btn-default btn-block',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
  };
  
  rForm: FormGroup;
  error: string;
  is_active = true;
  public activeUser = [];
  public activeUserOpt: IMultiSelectOption[];
  //public activeInterestList = [];
  //public activeIntOpt: IMultiSelectOption[];
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

  //public selectedUser: any;
  public editorOptions: Object = {
    placeholderText: 'Description',
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
  public isLocationSelect:boolean = false;
  public locJsonData:any;
  public nodeType:number = 1;
  public allUserList:Array<any>=[];
  public nearestLoc:string = '';

  constructor(
    private fb: FormBuilder,
     private router: Router, 
     private communityService: CommunityService,
     //public completer: NgAutocompleteComponent
    ) {

    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'description': [] ,
      'location': [],
      'community_type': [1, Validators.required],
      'latitude': [] ,
      'longitude': [] ,
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
    this.rForm.controls['latitude'].setValue(this.locJsonData.data.geometry.location.lat);
    this.rForm.controls['longitude'].setValue(this.locJsonData.data.geometry.location.lng);
    this.isLocationSelect = true;
    this.nearestLoc = this.locJsonData.data.name;
    //console.log(this.locJsonData.data.name);
  }

  goToList() {
    this.router.navigate(['community']);
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
        //this.InterestDropdownList=this.activeInterestList;
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

  public addCommunity(community){ 
    if(community.community_type == '2'){
      let IntSelName = '';
      if(this.selectedIntItems.length>0){
        IntSelName = this.selectedIntItems[0].name;
      }
      community.name = community.name +' - '+IntSelName;
    }else{
      if(this.nearestLoc!= ''){
        community.name = community.name +' - '+this.nearestLoc;
      }
    }  
    community.is_active = this.is_active;
    //this.nearestLoc 
    let selInt:any;
    //selInt = 2;
    //console.log(community);
    //console.log(this.selectedIntItems[0].id);
    this.communityService.addCommunity(community).subscribe(res=>{
      let lastCommunityId=res.id;
      if(this.selectedIntItems.length>0){
          this.selectedIntItems.forEach((color: {id: number }) => {
            this.selectInterest.push(color.id);
          });
        
          let IntjsonData = {"community_id":lastCommunityId,"selectinterest":this.selectInterest};
          this.communityService.addCommunityInterest(IntjsonData).subscribe(res=>{
          
          },err=>{
            this.error = "Error Occured, please try again"
          })
          selInt = this.selectedIntItems[0].id;
          this.getLocationWiseUserList(lastCommunityId, community, selInt);
      }else{
        this.getLocationWiseUserList(lastCommunityId, community, selInt);
      }
      
      // if(community.selectedUser.length>0){
      //   let UsrjsonData = {"community_id":lastCommunityId,"selectuser":community.selectedUser};
      //     this.communityService.addCommunityUser(UsrjsonData).subscribe(res=>{
          
      //     },err=>{
      //       this.error = "Error Occured, please try again"
      //     })
      // }
      //this.router.navigate(['/community']);
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
      this.isLocationSelect = false;
    }else{
      this.isLocationSelect = false;
      this.selectedIntItems = [];
    }
    //console.log(value);
  }
  
  public getLocationWiseUserList(comId:number, community:any, selInterest:any){
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
                  let data1 = { cDate: new Date(), customerId: user.customer.id, node_id: null, community_id: comId };
                  customerNodeList.push(data1);
                }
              }
            });
            if(customerNodeList.length>0){
              this.createNode(comId,customerNodeList,community);
            }else{
              this.createCustomerNode(comId,community);
            }
        }else{
          this.createCustomerNode(comId,community);
          //this.router.navigate(['/community']);
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
                  let data1 = { cDate: new Date(), customerId: user.id, node_id: null, community_id: comId };
                  customerNodeList.push(data1);
                }
              }
            });
            this.createNode(comId,customerNodeList,community);
        }else{
          this.router.navigate(['/community']);
        }
      },err=>{
        this.error = "Error Occured, please try again"
      })
    }
  }

  public createNode(comId:number, custNodeList:Array<any>, comData:any){
    let nodeId:any = null;
    let nodeName = comData.name;
    let selectedUser:Array<any> = [];
    if(custNodeList.length>0){
      //console.log(this.selectedIntItems);
      if(this.selectedIntItems.length > 0){
        //console.log(this.selectedIntItems[0].name);
        nodeName = nodeName+' - '+this.nearestLoc+' node ';
        //nodeName = nodeName+' node for '+this.selectedIntItems[0].name;
      }else{
        nodeName = nodeName+' node ';
        //nodeName = nodeName+' node for location';
      }

      // create new node respect to community
      let nodeCreateJson = {name: nodeName, description: comData.description, location: comData.location, type: comData.community_type, latitude: comData.latitude, longitude: comData.longitude, is_active:1, created_at:new Date(),community_id:comId};
      //console.log(nodeCreateJson);
      //console.log(custNodeList);
      this.communityService.addNodeData(nodeCreateJson).subscribe(res=>{
        nodeId=res.id;

        custNodeList.forEach(data =>{
          data.node_id=nodeId;
          selectedUser.push(data.customerId);
        });

        if(this.selectedIntItems.length>0){
          // this.selectedIntItems.forEach((color: {id: number }) => {
          //   this.selectInterest.push(color.id);
          // });
          
            let IntjsonData = {"node_id":nodeId,"selectinterest":this.selectInterest};
            this.communityService.addNodeInterest(IntjsonData).subscribe(res=>{
            
            },err=>{
              this.error = "Error Occured, please try again"
            })
        }
  
        const data = { "selectuser": custNodeList, node_id: nodeId, community_id:comId};
        this.communityService.addUserCommunityNodes(data).subscribe((res2) => {
        }, (err4) => {
          this.error = "Error Occured, please try again";
          //window.scrollTo(0, 0);
        })
        // insetr data into community user table
        if(selectedUser.length>0){
            let UsrjsonData = {"community_id":comId,"selectuser":selectedUser};
            this.communityService.addCommunityUser(UsrjsonData).subscribe(res=>{
            
            },err=>{
              this.error = "Error Occured, please try again"
            })
        }
        
      },err=>{
        this.error = "Error Occured, please try again"
      })

      this.router.navigate(['/community']);
    }else{
      this.router.navigate(['/community']);
    }  
  }
  
  public createCustomerNode(comId:number, comData:any){
    let nodeId:any = null;
    let nodeName = comData.name;
    let selectedUser:Array<any> = [];
      //console.log(this.selectedIntItems);
      if(this.selectedIntItems.length > 0){
        nodeName = nodeName+' - '+this.nearestLoc+' node ';
        //nodeName = nodeName+' node for '+this.selectedIntItems[0].name;
      }else{
        nodeName = nodeName+' node ';
      }

      // create new node respect to community
      let nodeCreateJson = {name: nodeName, description: comData.description, location: comData.location, type: comData.community_type, latitude: comData.latitude, longitude: comData.longitude, is_active:1, created_at:new Date(),community_id:comId};
      
      this.communityService.addNodeData(nodeCreateJson).subscribe(res=>{
        nodeId=res.id;
        if(this.selectedIntItems.length>0){
            let IntjsonData = {"node_id":nodeId,"selectinterest":this.selectInterest};
            this.communityService.addNodeInterest(IntjsonData).subscribe(res=>{
            
            },err=>{
              this.error = "Error Occured, please try again"
            })
        }
      },err=>{
        this.error = "Error Occured, please try again"
      })
      this.router.navigate(['/community']);
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
}
