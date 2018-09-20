import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { InterestService } from '../../../services/interest.service';
import { CommunityService } from '../../../services/community.service';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  rForm: FormGroup;
  error: string;
  is_active = true;
  is_hidden = true;
  public editorOptions: Object = {
    placeholderText: 'Description',
    heightMin:'250px',
    events: {
      'froalaEditor.focus': function (e, editor) {
        console.log(editor.selection.get());
      }
    }
  }
  content: string;
  public is_dpid:number = 0;
  public pinterestList:Array <any> = [];
  public selectInterest = [];
  public dropdownSettingsInterest = { 
    singleSelection: false, 
    text:"Select Paranet",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass custom-class",
    labelKey: "name",
    noDataLabel: "Search Paranet...",
    searchBy: ['name', 'description']
  };   
  public selectedIntItems = []; 
  public InterestDropdownList = [];
  public checkIsNameExist:boolean = false;
  public updateIntIdArr =[];
  public preIntIdArr =[];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private interestService: InterestService,
    private communityService: CommunityService
  ) {

    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'is_pid':[0],
      'description': [] ,
      'is_active': '' ,
      'is_hidden': '' 
      
    });
   }

  ngOnInit() {
    this.getPinterest();
  }


  goToList() {
    this.router.navigate(['interest']);
  }

  public checkInterestName(values: any): void{ 
    let checkIntName = values;
    checkIntName = checkIntName.trim();
    let checkIntData = 'interests?filter={"where":{"name":"'+checkIntName+'"}}'; 
    this.interestService.getFilterData(checkIntData).subscribe(res=>{
      if(res.length > 0){
        this.checkIsNameExist = true;
        window.scroll(0, 0);
      }else{
        this.checkIsNameExist = false;
      }
    },err=>{
      
    })
  }

  public addInterest(interest){   
    interest.is_active = this.is_active;
    interest.is_hidden = this.is_hidden;
    interest.is_pid = 0;
    //console.log(interest);
    let checkIntName = interest.name;
    checkIntName = checkIntName.trim();

    let inteEquivalency = interest.description;
    if(inteEquivalency!='' && !this.checkIsNameExist){
      inteEquivalency = String(inteEquivalency).replace(/<[^>]+>/gm, '');
      inteEquivalency = inteEquivalency.trim();
      let splitArr = inteEquivalency.split(",");
      let searchEquObj:string = '';
      let searchCnt:number = 0;
      //console.log(splitArr);
      splitArr.forEach(element => {
        searchCnt++;
        //element = String(element).trim();
        //element = element.replace(/\s|&nbsp;/g, '');
        //element = element.replace(/&nbsp;/g, '');
        element = String(element).trim();
        if(element!='' && element!=' '){
          if(splitArr.length != searchCnt){
            searchEquObj = searchEquObj +'{"name":"'+element+'"}, ';
          }else{
            searchEquObj = searchEquObj +'{"name":"'+element+'"}';
          }
        }
        //console.log(element);
      });
      //console.log(searchEquObj);
      searchEquObj = searchEquObj.replace(/,\s*$/, "");
      let checkIntData = 'interests?filter={"where":{"or":['+searchEquObj+']}}'; 
      this.interestService.getFilterData(checkIntData).subscribe(res=>{
        if(res.length > 0){
          res.forEach(element => {
            let equvPid = element.id;
            let includeEquv = element.description;
            includeEquv = String(includeEquv).replace(/<[^>]+>/gm, '');
            if(includeEquv!= ''){
              inteEquivalency = inteEquivalency+' ' + includeEquv+', ';
              //console.log(inteEquivalency);
            }

            // inactive community
            let checkComDataList = 'CommunityInterests?filter={"where":{"interestId":'+equvPid+'}}'; 
            this.interestService.getFilterData(checkComDataList).subscribe(resCom=>{
              if(resCom.length > 0){
                resCom.forEach(element => {
                  let comPid = element.community_id;

                  this.interestService.getFilterData('CommunityUsers?filter={"where":{"community_id":'+comPid+'}}').subscribe(resComUser=>{
                    if(resComUser.length > 0){
                      resComUser.forEach(element => {
                        let comUid = element.customerId;
                        //preIntIdArr
                        if(comUid > 0){
                          let foundData = this.preIntIdArr.find(x=> x==comUid);
                          if(foundData === undefined){
                            this.preIntIdArr.push(comUid);
                          }
                        }
                       
                      });
                    }
                  },err=>{
                          
                  }) 
                  
                  this.interestService.editCommunityData({"is_active": false},comPid).subscribe(res=>{ 
                  },err=>{
                  }) 

                  let updateIntIdJsonCust = 'community_nodes/update?where={"community_id": {"inq": ['+comPid+']}}&access_token='+localStorage.getItem("authToken");
                  this.interestService.updatePostInterestData(updateIntIdJsonCust, {"is_active": false}).subscribe(res=>{ 

                  },err=>{
                    
                  })
                });
              }
            },err=>{
                    
            }) 
            
            this.updateIntIdArr.push(equvPid);
            // inactive interest
            //let interestInactiveData = {"is_active": false};
            this.interestService.editInterest({"is_active": false},equvPid).subscribe(res=>{ 
            },err=>{
              
            }) 

          });
          interest.description = inteEquivalency;
        }
      },err=>{
        this.error = "Error Occured, please try again"
      })
    }

    
    // let checkIntData = 'interests?filter={"where":{"name":"'+checkIntName+'"}}'; 
    // this.interestService.getFilterData(checkIntData).subscribe(res=>{
      // if(res.length > 0){
      //   this.checkIsNameExist = true;
      //   window.scroll(0, 0);
      // }else{
      if(!this.checkIsNameExist){  
        this.interestService.addInterest(interest).subscribe(res=>{
          let inteId= res.id;
          if(this.selectedIntItems.length>0){
            this.selectedIntItems.forEach((color: {id: number }) => {
              this.selectInterest.push(color.id);
            });
            
            let IntjsonData = {"interest_pid":inteId,"selectinterest":this.selectInterest};
              this.interestService.addGroupInterest(IntjsonData).subscribe(res=>{
              
              },err=>{
                this.error = "Error Occured, please try again"
              })
          }
          
          let communityName= interest.name+' Community';
          let community = {is_active:true, name:communityName, description:"", location:"Palm Beach Gardens, FL, USA", latitude:26.82339459999999, longitude:-80.13865469999996, community_type: 2, created_at:new Date()};
          this.communityService.addCommunity(community).subscribe(res=>{
            let lastCommunityId=res.id;
            // update customer interest id
            if(this.updateIntIdArr.length > 0){
              //console.log(this.updateIntIdArr);
              let updateIntIdStr = this.updateIntIdArr.toString();

              // let updateIntIdJson = 'CommunityInterests/update?where={"interestId": {"inq": ['+updateIntIdStr+']}}&access_token='+localStorage.getItem("authToken");
              // this.interestService.updatePostInterestData(updateIntIdJson, {"interestId": inteId}).subscribe(res=>{ 

              // },err=>{
                
              // }) 

              let updateIntIdJsonCust = 'CustomerInterests/update?where={"interestId": {"inq": ['+updateIntIdStr+']}}&access_token='+localStorage.getItem("authToken");
              this.interestService.updatePostInterestData(updateIntIdJsonCust, {"interestId": inteId}).subscribe(res=>{ 

              },err=>{
                
              }) 

              let updateIntIdJsonEvent = 'EventInterests/update?where={"interestId": {"inq": ['+updateIntIdStr+']}}&access_token='+localStorage.getItem("authToken");
              this.interestService.updatePostInterestData(updateIntIdJsonEvent, {"interestId": inteId}).subscribe(res=>{ 

              },err=>{
                
              }) 

              // let updateIntIdJsonNode = 'NodeInterests/update?where={"interestId": {"inq": ['+updateIntIdStr+']}}&access_token='+localStorage.getItem("authToken");
              // this.interestService.updatePostInterestData(updateIntIdJsonNode, {"interestId": inteId}).subscribe(res=>{ 

              // },err=>{
                
              // }) 

              let updateIntIdJsonGroup = 'GroupInterests/update?where={"interestId": {"inq": ['+updateIntIdStr+']}}&access_token='+localStorage.getItem("authToken");
              this.interestService.updatePostInterestData(updateIntIdJsonGroup, {"interestId": inteId}).subscribe(res=>{ 

              },err=>{
                
              }) 
            }
            
            // insetr data into community user table
            if(this.preIntIdArr.length>0){
                let UsrjsonData = {"community_id":lastCommunityId,"selectuser":this.preIntIdArr};
                this.communityService.addCommunityUser(UsrjsonData).subscribe(res=>{
                
                },err=>{
                  this.error = "Error Occured, please try again"
                })
            }

            if(inteId>0){
                this.selectInterest.push(inteId);
                let IntjsonData = {"community_id":lastCommunityId,"selectinterest":this.selectInterest};
                this.communityService.addCommunityInterest(IntjsonData).subscribe(res=>{
                
                },err=>{
                  this.error = "Error Occured, please try again"
                })
                this.createNode(lastCommunityId, community, inteId);
            }else{
              //this.getLocationWiseUserList(lastCommunityId, community, selInt);
            }
          },err=>{
            this.error = "Error Occured, please try again"
          })
          
        },err=>{
          this.error = "Error Occured, please try again"
        })
      }
    // },err=>{
      
    // })
  }

  public createNode(comId:number, community:any, selInterest:any){
    let nodeId:any = null;
    let nodeName = community.name;
    let selectedUser:Array<any> = [];
    if(selInterest>0){
      //console.log(this.selectedIntItems);
      nodeName = nodeName+' node ';

      // create new node respect to community
      let nodeCreateJson = {name: nodeName, description: community.description, location: community.location, type: community.community_type, latitude: community.latitude, longitude: community.longitude, is_active:1, created_at:new Date(),community_id:comId};
      
      this.communityService.addNodeData(nodeCreateJson).subscribe(res=>{
        nodeId=res.id;
        let IntjsonData = {"node_id":nodeId,"selectinterest":this.selectInterest};
        this.communityService.addNodeInterest(IntjsonData).subscribe(res=>{
        
        },err=>{
          this.error = "Error Occured, please try again"
        })

        // insetr data into community node user table
        if(this.preIntIdArr.length>0){
            let custNodeList = [];
            this.preIntIdArr.forEach(color => {
              custNodeList.push({ cDate: new Date(), customerId: color, node_id: nodeId, community_id: comId });
            });
            
            let dataNodeUser = { "selectuser": custNodeList, node_id: nodeId, community_id:comId};
            this.communityService.addNodeUser(dataNodeUser).subscribe(res=>{
            },err=>{
              this.error = "Error Occured, please try again"
            })
        }
          
      },err=>{
        this.error = "Error Occured, please try again"
      })
      this.router.navigate(['/interest']);
    }else{
      this.router.navigate(['/interest']);
    }    
  }

  public changeIsActive($e: any){
    this.is_active = !this.is_active;
    //console.log(this.is_active);
  }
  public changeIsHidden($e: any){
    this.is_hidden = !this.is_hidden;
    //console.log(this.is_active);
  }

  public getPinterest(){
    this.interestService.getFilterData('interests?filter={"where":{"or":[{"is_pid":0},{"is_pid":null}], "is_active":true, "or":[{"is_hidden":0},{"is_hidden":null}]}, "order" : "name asc"}').subscribe(res=>{
      //console.log(res);
      if(res.length>0){
        res.forEach((color: { name: string, id: number, description:string }) => {
          this.InterestDropdownList.push({
            id: color.id,
            name: color.name,
            description: color.description
          });
        });
      }
      //this.pinterestList=res;
    },err=>{
      this.error = "Error Occured, please try again"
    })  
  }
}
