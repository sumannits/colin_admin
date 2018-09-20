import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { InterestService } from '../../../services/interest.service';
import { CommunityService } from '../../../services/community.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  rForm: FormGroup;
  error: string;
  interestId: any;
  is_active = true;
  is_hidden = true;
  public editorOptions: Object = {
    placeholderText: 'Answer',
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
  public preIntIdArr =[];
  public updateIntIdArr =[];
  public commInArr =[];
  public commInUserArr =[];

  constructor(private fb: FormBuilder,private router: Router, private activatedRoute:ActivatedRoute,  private interestService: InterestService, private communityService: CommunityService) {
    this.rForm = fb.group({      
      'name': [null, Validators.required],
      //'is_pid':[null],
      'description': [],
      'is_active': '',
      'is_hidden': ''         
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.interestId = params['id'];        
        this.getIndividualInterest(this.interestId);
        this.getPinterest();
        this.getSelectedIntList();
        this.getCommunityIdWithUser();
    });
  }


  goToList() {
    this.router.navigate(['interest']);
  }

  public getCommunityIdWithUser(){
    let checkIntData = 'CommunityInterests?filter={"where":{"interestId":"'+this.interestId+'"}}'; 
    this.interestService.getFilterData(checkIntData).subscribe(res=>{
      if(res.length > 0){
        res.forEach(element => {
          let foundData = this.commInArr.find(x=> x==element.community_id);
          if(foundData === undefined){
            this.commInArr.push(element.community_id);
            let checkComUserData = 'CommunityUsers?filter={"where":{"community_id":"'+element.community_id+'"}}'; 
            this.interestService.getFilterData(checkComUserData).subscribe(res=>{
              this.commInUserArr[element.community_id]=res;
            },err=>{
      
            })
          }
        });
        //console.log(this.commInUserArr);
      }
    },err=>{
      
    })

    
  }
  
  public checkInterestName(values: any): void{ 
    let checkIntName = values;
    checkIntName = checkIntName.trim();
    let checkIntData = 'interests?filter={"where":{"name":"'+checkIntName+'", "id":{"neq":'+this.interestId+'}}}'; 
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

  public editInterest(interest){   
    interest.is_active = this.is_active;
    interest.is_hidden = this.is_hidden;
    let checkIntName = interest.name;
    checkIntName = checkIntName.trim();
    if(!this.checkIsNameExist){
      let inteEquivalency = interest.description;

      //if(inteEquivalency!='' && !this.checkIsNameExist){
        inteEquivalency = String(inteEquivalency).replace(/<[^>]+>/gm, '');
        inteEquivalency = inteEquivalency.trim();
        let splitArr = inteEquivalency.split(",");
        let searchEquObj:string = '';
        let searchCnt:number = 0;
        //console.log(splitArr);
        splitArr.forEach(element => {
          searchCnt++;
          element = String(element).trim();
          if(element!='' && element!=' '){
            if(splitArr.length != searchCnt){
              searchEquObj = searchEquObj +'{"name":"'+element+'"}, ';
            }else{
              searchEquObj = searchEquObj +'{"name":"'+element+'"}';
            }
          }
        });
        //console.log(searchEquObj);
        searchEquObj = searchEquObj.replace(/,\s*$/, "");
        let checkIntData = 'interests?filter={"where":{"or":['+searchEquObj+'], "is_active":true}}'; 
        this.interestService.getFilterData(checkIntData).subscribe(res=>{
          if(res.length > 0){
            res.forEach(element => {
              let equvPid = element.id;
              if(equvPid!=this.interestId){  
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
              }
            });
            interest.description = inteEquivalency;
            this.interestService.editInterest(interest,this.interestId).subscribe(res=>{
            },err=>{
              this.error = "Error Occured, please try again"
            })

            // update customer interest id
            if(this.updateIntIdArr.length > 0){
              let inteId = this.interestId;
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
            if(this.preIntIdArr.length>0 || this.commInUserArr.length >0){
              //console.log(this.preIntIdArr);
              //console.log(this.commInUserArr);
              this.commInArr.forEach(element => {
                let communityPid =element;
                let getComUserList = this.commInUserArr[element];
                let allComUserList = [];
                allComUserList = this.preIntIdArr;
                if(getComUserList.length > 0){
                  getComUserList.forEach(element1 => {
                    let customeCId = element1.customerId;
                    let foundData = allComUserList.find(x=> x==customeCId);
                    if(foundData === undefined){
                      allComUserList.push(customeCId);
                    }
                  });
                }
                //console.log(allComUserList);
                let UsrjsonData = {"community_id":communityPid,"selectuser":allComUserList};
                this.communityService.addCommunityUser(UsrjsonData).subscribe(res=>{
                
                },err=>{
                  this.error = "Error Occured, please try again"
                })

                // insetr data into community node user table
                let checkNodeUserData = 'NodeUsers?filter={"where":{"community_id":"'+communityPid+'"}}'; 
                let nodeId = '';
                let checkNodePidData = 'community_nodes?filter={"where":{"community_id":"'+communityPid+'"}}'; 
                this.interestService.getFilterData(checkNodePidData).subscribe(res=>{
                  if(res.length > 0){
                    nodeId = res[0].id;
                    //console.log(nodeId);
                  }
                },err=>{
                  
                })  
                this.interestService.getFilterData(checkNodeUserData).subscribe(res=>{
                  if(res.length > 0){
                    res.forEach(element2 => {
                      nodeId = element2.node_id;
                      let customeCId = element2.customerId;
                      let foundData = allComUserList.find(x=> x==customeCId);
                      if(foundData === undefined){
                        allComUserList.push(customeCId);
                      }
                    });
                  }

                  if(allComUserList.length>0 && nodeId!=''){
                      let custNodeList = [];
                      allComUserList.forEach(color => {
                        custNodeList.push({ cDate: new Date(), customerId: color, node_id: nodeId, community_id: communityPid });
                      });
                      
                      let dataNodeUser = { "selectuser": custNodeList, node_id: nodeId, community_id:communityPid};
                      this.communityService.addNodeUser(dataNodeUser).subscribe(res=>{
                      },err=>{
                        this.error = "Error Occured, please try again"
                      })
                  }
                },err=>{
                  
                })
              
              });
            }

          }
        },err=>{
          this.error = "Error Occured, please try again"
        })
      //}

      this.interestService.editInterest(interest,this.interestId).subscribe(res=>{  
        if(this.selectedIntItems.length>0){
          this.selectedIntItems.forEach((color: {id: number }) => {
            this.selectInterest.push(color.id);
          });
          
          let IntjsonData = {"interest_pid":this.interestId,"selectinterest":this.selectInterest};
          this.interestService.addGroupInterest(IntjsonData).subscribe(res=>{
          
          },err=>{
            this.error = "Error Occured, please try again"
          })
        }  
        
        this.router.navigate(['/interest']);
      },err=>{
        this.error = "Error Occured, please try again"
      })
    }
  }

  public getIndividualInterest(Id){
    this.interestService.getIndividualInterest(Id).subscribe(res=>{
      
      this.rForm.controls['name'].setValue(res.name);
      this.rForm.controls['description'].setValue(res.description); 
      this.content = res.description;
      this.is_active = res.is_active;
      this.rForm.controls['is_active'].setValue(res.is_active); 
      if(res.is_hidden != null){
        this.is_hidden = res.is_hidden;
      }else{
        this.is_hidden = false;
      }
      this.rForm.controls['is_hidden'].setValue(this.is_hidden);   
      if(res.is_pid != null){
        this.rForm.controls['is_pid'].setValue(res.is_pid);
        this.is_dpid=res.is_pid;
      }          
      
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public changeIsActive($e: any){
    this.is_active = !this.is_active;
    //console.log(this.is_active);
  }

  public changeIsHidden($e: any){
    //console.log(this.is_hidden);
    this.is_hidden = !this.is_hidden;
    //console.log(this.is_active);
  }

  public getPinterest(){
    this.interestService.getFilterData('interests?filter={"where":{"or":[{"is_pid":0},{"is_pid":null}], "is_active":true, "or":[{"is_hidden":0},{"is_hidden":null}]}, "order" : "name asc"}').subscribe(res=>{
      if(res.length>0){
        res.forEach((color: { name: string, id: number, description:string }) => {
          if(color.id!= this.interestId){
            this.InterestDropdownList.push({
              id: color.id,
              name: color.name,
              description: color.description
            });
          }
        });
      }
      //this.pinterestList=res;
    },err=>{
      this.error = "Error Occured, please try again"
    })  
  }

  public getSelectedIntList(){
    
    let filterIntData = '{"where":{"interest_pid":'+this.interestId+'}, "include":["interest"]}';
    this.interestService.getFilterData('InterestMultiples?filter='+filterIntData).subscribe(res=>{
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
}
