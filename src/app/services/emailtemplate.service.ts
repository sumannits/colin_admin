import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class EmailtemplateService {
    constructor( private http: Http ){ 

    }
    
    public getEmailtemplate(){
        return this.http.get(environment.baseurl+'emailtemplates?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public addEmailtemplate(data){
        return this.http.post(environment.baseurl+'emailtemplates?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {            
            return res.json();
        });   
    }
    public deleteEmailtemplate(id){
        return this.http.delete(environment.baseurl+'emailtemplates/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public getIndividualEmailtemplate(id){
        return this.http.get(environment.baseurl+'emailtemplates/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public editEmailtemplate(data,id){
        return this.http.put(environment.baseurl+'emailtemplates/'+id+'?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
           
            return res.json();
        });
    }
}