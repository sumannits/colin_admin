import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class PushnotificationService {
    constructor( private http: Http ){ 

    }
    
    public getPushnotification(){
        return this.http.get(environment.baseurl+'pushnotifications?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public addPushnotification(data){
        return this.http.post(environment.baseurl+'pushnotifications?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {            
            return res.json();
        });   
    }
    public deletePushnotification(id){
        return this.http.delete(environment.baseurl+'pushnotifications/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public getIndividualPushnotification(id){
        return this.http.get(environment.baseurl+'pushnotifications/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public editPushnotification(data,id){
        return this.http.put(environment.baseurl+'pushnotifications/'+id+'?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
           
            return res.json();
        });
    }
}