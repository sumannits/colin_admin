import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class CustomerService {
    constructor( private http: Http ){ 

    }
    
    public getCustomer(){
        return this.http.get(environment.baseurl+'Customers?filter={"where":{"id":{"neq":1}}, "include":[{"grpinterest": ["interest"]}], "order" : "id desc"}&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public addCustomer(data){
        return this.http.post(environment.baseurl+'Customers?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {            
            return res.json();
        });
    }
    public deleteCustomer(id){
        return this.http.delete(environment.baseurl+'Customers/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public getIndividualCustomer(id){
        return this.http.get(environment.baseurl+'Customers/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public editCustomer(data,id){
        return this.http.put(environment.baseurl+'Customers/editCustomer/'+id+'?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
           
            return res.json();
        });
    }
    public getInterestList(filter_data){
        return this.http.get(environment.baseurl+filter_data+'&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }

    public addUserInterest(data){
        return this.http.post(environment.baseurl+'CustomerInterests/insertInterest?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public deleteAllGrpInterestData(data){
        return this.http.post(environment.baseurl+'CustomerInterests/deleteAllData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }


    public getCommunityNodesList() {
        return this.http.get(environment.baseurl + 'community_nodes?access_token=' + localStorage.getItem("authToken")).map((res: Response) => {
            return res.json();
        });
    }


    public addUserNodes(data) {
        return this.http.post(environment.baseurl + 'NodeUsers/addUserNodes?access_token=' + localStorage.getItem("authToken"), data).map((res: Response) => {
            return res.json();
        });
    }

    public getCustomerNodsList(id) {
        return this.http.get(environment.baseurl + 'NodeUsers?filter={"where":{"customerId":'+id+'}}&access_token=' + localStorage.getItem("authToken")).map((res: Response) => {
            return res.json();
        });
    }

    public getCommunityList() {
        return this.http.get(environment.baseurl + 'communities?access_token=' + localStorage.getItem("authToken")).map((res: Response) => {
            return res.json();
        });
    }

    public deleteCustomerNode(id) {
        return this.http.delete(environment.baseurl + 'NodeUsers/' + id + '/?access_token=' + localStorage.getItem("authToken")).map((res: Response) => {
            return res.json();
        });
    }

    public addCommunity(data){
        return this.http.post(environment.baseurl+'communities?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {            
            return res.json();
        });   
    }

    public addCommunityInterest(data){
        return this.http.post(environment.baseurl+'CommunityInterests/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public addNodeData(data){
        return this.http.post(environment.baseurl+'community_nodes?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {            
            return res.json();
        });   
    }

    public addNodeInterest(data){
        return this.http.post(environment.baseurl+'NodeInterests/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    // public addNodeUser(data){
    //     return this.http.post(environment.baseurl+'NodeUsers/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
    //         return res.json();
    //     });
    // }

    public addUserCommunityNodes(data) {
        return this.http.post(environment.baseurl + 'NodeUsers/insertData?access_token=' + localStorage.getItem("authToken"), data).map((res: Response) => {
            return res.json();
        });
    }

    public addCommunityUser(data){
        return this.http.post(environment.baseurl+'CommunityUsers/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }
}