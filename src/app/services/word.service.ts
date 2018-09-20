import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class WordService {
    constructor( private http: Http ){ 

    }
    
    public getWord(){
        return this.http.get(environment.baseurl+'words?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public addWord(data){
        return this.http.post(environment.baseurl+'words?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {            
            return res.json();
        });   
    }
    public deleteWord(id){
        return this.http.delete(environment.baseurl+'words/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public getIndividualWord(id){
        return this.http.get(environment.baseurl+'words/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }
    public editWord(data,id){
        return this.http.put(environment.baseurl+'words/'+id+'?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
           
            return res.json();
        });
    }
}