import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class EventService {
    constructor( private http: Http ){ 

    }
    
    public getEvent(){
        return this.http.get(environment.baseurl+'events?filter={"include":[{"grpinterest": ["interest"]}, "eventuser"]}&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public addEvent(data){
        return this.http.post(environment.baseurl+'events?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {            
            return res.json();
        });
    }
    public deleteEvent(id){
        return this.http.delete(environment.baseurl+'events/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public getIndividualEvent(id){
        return this.http.get(environment.baseurl+'events/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public editEvent(data,id){
        return this.http.patch(environment.baseurl+'events/'+id+'?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
           
            return res.json();
        });
    }
    public getUserList(filter_data){
        return this.http.get(environment.baseurl+filter_data+'&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public addEventUser(data){
        return this.http.post(environment.baseurl+'EventUsers/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }
    public getFilterDataList(filter_data){
        return this.http.get(environment.baseurl+filter_data+'&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public addEventInterest(data){
        return this.http.post(environment.baseurl+'EventInterests/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }
    public deleteAllGrpInterestData(data){
        return this.http.post(environment.baseurl+'EventInterests/deleteAllData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public deleteAllGrpUserData(data){
        return this.http.post(environment.baseurl+'EventUsers/deleteAllData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }
}