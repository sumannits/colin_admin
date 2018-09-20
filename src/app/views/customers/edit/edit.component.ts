import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import * as _ from 'lodash'; 

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  rForm: FormGroup;
  error: string;
  customerId: any;
  is_active = true;
  public selectInterest = [];
  public InterestDropdownList = [];
  locJsonData:any;
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
  isLocationSelect = false;
  public userSettings: any = {
    inputPlaceholderText: 'Type anything and you will get a location'
  };
  communityNodeList = [];
  public preSelectedIntItems = [];
  public selectedIntItems = [];
  public nearestLoc:string = '';

  constructor(private fb: FormBuilder,private router: Router, private activatedRoute:ActivatedRoute,  private customerService: CustomerService) { 
    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'phone': [null, Validators.required],     
      'username': [null],
      //'password': [null, Validators.required],
      'email': [null, Validators.required],     
      'is_active': '',
      'location': [null, Validators.required],
      'lat': [null, Validators.required],
      'lng': [null, Validators.required],
      /*'location': {
        "lat": 0,
        "lng": 0
      },
      'realm': '',
      'image': '',
      'id':''*/
      
    });
    
  }


  private getAllCommunityNodesList() {

    this.customerService.getCommunityNodesList().subscribe((res) => {
      this.communityNodeList = res;
    }, (err) => {
      //console.log(err);
    })
  }
  goToList() {
    this.router.navigate(['customers']);
  }
  ngOnInit() {
    //console.log
    this.activatedRoute.params.subscribe((params: Params) => {
        this.customerId = params['id'];
        //console.log(this.customerId);
        this.getIndividualCustomer(this.customerId);
        this.getSelectedIntList();
    });
    this.getActiveIntList();
    this.getAllCommunityNodesList();

  }

  public getSelectedIntList(){
    
    let filterIntData = '{"where":{"user_id":'+this.customerId+'}, "include":["interest"]}';
    this.customerService.getInterestList('CustomerInterests?filter='+filterIntData).subscribe(res=>{
      if(res.length>0){
        res.forEach((color: { interestId: number , interest: {name: string, description:string}}) => {
          this.selectedIntItems.push({
            id: color.interestId,
            name: color.interest.name,
            description: color.interest.description
          });
          this.preSelectedIntItems.push({
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
    this.customerService.getInterestList('interests?filter='+filterUserData).subscribe(res=>{
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
  public autoCompleteCallback1(selectedData: any) {
    this.isLocationSelect = true;
    this.locJsonData = JSON.parse(JSON.stringify(selectedData));
    this.rForm.controls['location'].setValue(this.locJsonData.data.formatted_address);
    this.rForm.controls['lat'].setValue(this.locJsonData.data.geometry.location.lat);
    this.rForm.controls['lng'].setValue(this.locJsonData.data.geometry.location.lng);
    this.nearestLoc = this.locJsonData.data.name;
  }
  public editCustomer(customer){
    if (this.isLocationSelect)
    {
      let userChangeNode:boolean = false;
      let lastUserId = this.customerId;
      customer.is_active = this.is_active;
      this.customerService.editCustomer(customer, this.customerId).subscribe(res => {
        let customerNodeList = [];
        const customerLat = Number(customer.lat);
        const customerLng = Number(customer.lng);
        for (let i = 0; i < this.communityNodeList.length; i++) {
          let distance = this.calcCrow(customerLat, customerLng, Number(this.communityNodeList[i].latitude), Number(this.communityNodeList[i].longitude));
          if (distance < 1) {
            let data1 = { cDate: new Date(), customerId: lastUserId, node_id: this.communityNodeList[i].id, community_id: this.communityNodeList[i].community_id }
            customerNodeList.push(data1);
          }

        }
        const data = { "selectedNodes": customerNodeList, customerId: lastUserId };
        this.customerService.addUserNodes(data).subscribe((res) => {
        }, (err4) => {
          this.error = "Error Occured, please try again";
          //window.scrollTo(0, 0);
        })

        if (this.selectedIntItems.length > 0) {
          this.selectedIntItems.forEach((color: { name: string, id: number }) => {
            this.selectInterest.push({
              interestId: color.id,
              interest_text: color.name,
              user_id: lastUserId
            });
          });
         
          let IntjsonData = { "interested": this.selectInterest };
          this.customerService.addUserInterest(IntjsonData).subscribe(res => {

          }, err => {
            this.error = "Error Occured, please try again"
          })

          if(this.preSelectedIntItems.length != this.selectedIntItems.length){
            userChangeNode= true;
          }else{
            let different = _.differenceWith(this.preSelectedIntItems, this.selectedIntItems, _.isEqual);
            if(different.length > 0){
              userChangeNode= true;
            }
            //console.log(different);
          }

          if(userChangeNode){
            this.userComNodeCreate(this.selectInterest, customer, lastUserId);
          }else{
            this.router.navigate(['/customers']);
          }
          
        }else{
          this.router.navigate(['/customers']);
        }
        
      }, err => {
        this.error = "Error Occured, please try again"
      })
    }
    else
    {
      this.error="Please select a location.";
      window.scrollTo(0,0);
    }
    
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
  public getIndividualCustomer(Id){
    const that=this;
    this.customerService.getIndividualCustomer(Id).subscribe(res=>{
      //console.log(res);
      //console.log(res.email);
      this.rForm.controls['name'].setValue(res.name);
      this.rForm.controls['phone'].setValue(res.phone);
      this.rForm.controls['username'].setValue(res.username);
      this.is_active = res.is_active;
      this.rForm.controls['is_active'].setValue(res.is_active); 
      //this.rForm.controls['password'].setValue(res.password);
      this.rForm.controls['email'].setValue(res.email); 
      this.rForm.controls['location'].setValue(res.location?res.location:'');
      this.rForm.controls['lat'].setValue(res.lat ? res.lat : ''); 
      this.rForm.controls['lng'].setValue(res.lng ? res.lng : ''); 
      if(res.location){
        that.userSettings.inputPlaceholderText=res.location;
        that.userSettings = Object.assign({}, that.userSettings)
        this.isLocationSelect=true;
      }else{
        this.isLocationSelect=false;
      }
      //this.rForm.controls['id'].setValue(res.id);      
      
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public changeIsActive($e: any){
    this.is_active = !this.is_active;
    //console.log(this.is_active);
  }


  public userComNodeCreate(IntList:any, customer:any, userId:number){
    let communityName= customer.name+' Community - ' +this.nearestLoc;
    let community = {is_active:true, name:communityName, description:"", location:customer.location, latitude:customer.lat, longitude:customer.lng, community_type: 2, created_at:new Date()};
    this.customerService.addCommunity(community).subscribe(res=>{
      let custNodeList = [];
      let commIntList = [];
      let lastCommunityId=res.id;
      let data1 = { cDate: new Date(), customerId: userId, node_id: null, community_id: lastCommunityId };
      custNodeList.push(data1);

      if(IntList.length>0){
          IntList.forEach(color => {
            commIntList.push(color.interestId);
          });
          let IntjsonData = {"community_id":lastCommunityId,"selectinterest":commIntList};
          this.customerService.addCommunityInterest(IntjsonData).subscribe(res=>{
          
          },err=>{
            this.error = "Error Occured, please try again"
          })
          this.createNode(lastCommunityId, custNodeList, community, userId, commIntList);
      }
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public createNode(comId:number, custNodeList:Array<any>, comData:any, userId:number, selIntList:any){
    let nodeId:any = null;
    let nodeName = comData.name;
    let selectedUser:Array<any> = [];
    if(custNodeList.length>0){
      nodeName = nodeName+' node ';

      // create new node respect to community
      let nodeCreateJson = {name: nodeName, description: comData.description, location: comData.location, type: comData.community_type, latitude: comData.latitude, longitude: comData.longitude, is_active:1, created_at:new Date(),community_id:comId};
      
      this.customerService.addNodeData(nodeCreateJson).subscribe(res=>{
        nodeId=res.id;

        custNodeList.forEach(data =>{
          data.node_id=nodeId;
          selectedUser.push(userId);
        });

        if(selIntList.length>0){
            let IntjsonData = {"node_id":nodeId,"selectinterest":selIntList};
            this.customerService.addNodeInterest(IntjsonData).subscribe(res=>{
            
            },err=>{
              this.error = "Error Occured, please try again"
            })
        }
  
        const data = { "selectuser": custNodeList, node_id: nodeId, community_id:comId};
        this.customerService.addUserCommunityNodes(data).subscribe((res2) => {
        }, (err4) => {
          this.error = "Error Occured, please try again";
          //window.scrollTo(0, 0);
        })
        // insetr data into community user table
        if(selectedUser.length>0){
            let UsrjsonData = {"community_id":comId,"selectuser":selectedUser};
            this.customerService.addCommunityUser(UsrjsonData).subscribe(res=>{
            
            },err=>{
              this.error = "Error Occured, please try again"
            })
        }
        
      },err=>{
        this.error = "Error Occured, please try again"
      })
      this.router.navigate(['/customers']);
    }else{
      this.router.navigate(['/customers']);
    }  
  }
}
