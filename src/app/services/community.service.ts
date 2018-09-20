import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class CommunityService {
    constructor( private http: Http ){ 

    }
    
    public getCommunity(){
        return this.http.get(environment.baseurl+'communities?filter={"include":["user", {"grpinterest": ["interest"]}], "order" : "id desc"}&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }


    public getAllCustomers() {
        return this.http.get(environment.baseurl + 'Customers?access_token=' + localStorage.getItem("authToken")).map((res: Response) => {
            return res.json();
        });
    }
    public addCommunity(data){
        return this.http.post(environment.baseurl+'communities?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {            
            return res.json();
        });   
    }
    public deleteCommunity(id){
        return this.http.delete(environment.baseurl+'communities/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public getIndividualCommunity(id){
        return this.http.get(environment.baseurl+'communities/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public editCommunity(data,id){
        return this.http.patch(environment.baseurl+'communities/'+id+'?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
           
            return res.json();
        });
    }

    public getUserList(filter_data){
        return this.http.get(environment.baseurl+filter_data+'&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }

    public getInterestList(filter_data){
        return this.http.get(environment.baseurl+filter_data+'&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }

    public addCommunityInterest(data){
        return this.http.post(environment.baseurl+'CommunityInterests/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public addCommunityUser(data){
        return this.http.post(environment.baseurl+'CommunityUsers/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public deleteAllGrpInterestData(data){
        return this.http.post(environment.baseurl+'CommunityInterests/deleteAllData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public deleteAllGrpUserData(data){
        return this.http.post(environment.baseurl+'CommunityUsers/deleteAllData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public addNodeData(data){
        return this.http.post(environment.baseurl+'community_nodes?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {            
            return res.json();
        });   
    }

    public editNode(data,id){
        return this.http.patch(environment.baseurl+'community_nodes/'+id+'?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public addNodeInterest(data){
        return this.http.post(environment.baseurl+'NodeInterests/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public addNodeUser(data){
        return this.http.post(environment.baseurl+'NodeUsers/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public getFilterData(filter_data){
        return this.http.get(environment.baseurl+filter_data+'&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }

    public deleteNode(id){
        return this.http.delete(environment.baseurl+'community_nodes/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }

    public deleteAllNodeInterestData(data){
        return this.http.post(environment.baseurl+'NodeInterests/deleteAllData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public deleteAllNodeUserData(data){
        return this.http.post(environment.baseurl+'NodeUsers/deleteAllData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }
    
    public deleteAllCustNodeUserData(data){
        return this.http.post(environment.baseurl+'NodeUsers/deleteAllParamData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }
    public addUserCommunityNodes(data) {
        return this.http.post(environment.baseurl + 'NodeUsers/insertData?access_token=' + localStorage.getItem("authToken"), data).map((res: Response) => {
            return res.json();
        });
    }


    public getUserNodeListByCommunity(id) {
        return this.http.get(environment.baseurl + 'NodeUsers?filter={"where":{"node_id":' + id + '}}&access_token=' + localStorage.getItem("authToken")).map((res: Response) => {
            return res.json();
        });
    }

    public deleteCustomerNode(id) {
        return this.http.delete(environment.baseurl + 'NodeUsers/' + id + '/?access_token=' + localStorage.getItem("authToken")).map((res: Response) => {
            return res.json();
        });
    }
}