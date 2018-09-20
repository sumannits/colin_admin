import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class GroupService {
    constructor( private http: Http ){ 

    }

    public getGroup(){
        return this.http.get(environment.baseurl+'UserGroups?filter={"where":{"or":[{"is_pgroup_id":0},{"is_pgroup_id":null}]}, "include":[{"grpinterest": ["interest"]}, "grpuser"], "order" : "id desc"}&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }

    public deleteGroupData(id){
        return this.http.delete(environment.baseurl+'UserGroups/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }

    public getFilterDataList(filter_data){
        return this.http.get(environment.baseurl+filter_data+'&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }

    public insertData(data){
        return this.http.post(environment.baseurl+'UserGroups?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {            
            return res.json();
        });   
    }

    public addGroupInterest(data){
        return this.http.post(environment.baseurl+'GroupInterests/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public addGroupUser(data){
        return this.http.post(environment.baseurl+'GroupUsers/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public getIndividualGroup(id){
        return this.http.get(environment.baseurl+'UserGroups/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    
    public updateData(data,id){
        return this.http.patch(environment.baseurl+'UserGroups/'+id+'?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }
    
    public deleteAllGrpInterestData(data){
        return this.http.post(environment.baseurl+'GroupInterests/deleteAllData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public deleteAllGrpUserData(data){
        return this.http.post(environment.baseurl+'GroupUsers/deleteAllData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }
}