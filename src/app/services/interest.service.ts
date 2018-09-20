import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class InterestService {
    constructor( private http: Http ){ 

    }
    
    public getInterest(){
        return this.http.get(environment.baseurl+'interests?filter={"order" : "id desc"}&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public addInterest(data){
        return this.http.post(environment.baseurl+'interests?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {            
            return res.json();
        });   
    }
    public deleteInterest(id){
        return this.http.delete(environment.baseurl+'interests/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public getIndividualInterest(id){
        return this.http.get(environment.baseurl+'interests/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public editInterest(data,id){
        return this.http.patch(environment.baseurl+'interests/'+id+'?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
           
            return res.json();
        });
    }

    public getFilterData(filter_data){
        return this.http.get(environment.baseurl+filter_data+'&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }

    public deleteAllGrpInterestData(data){
        return this.http.post(environment.baseurl+'InterestMultiples/deleteAllData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public addGroupInterest(data){
        return this.http.post(environment.baseurl+'InterestMultiples/insertData?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }

    public updatePostInterestData(link, data){
        return this.http.post(environment.baseurl+link,data).map((res: Response) => {       
            return res.json();
        });
    }
    
    public editCommunityData(data,id){
        return this.http.patch(environment.baseurl+'communities/'+id+'?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }
}