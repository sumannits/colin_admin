import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class DashboardService {
    constructor( private http: Http ){ 

    }
    public getFilterDataList(filter_data){
        return this.http.get(environment.baseurl+filter_data+'&access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }

    public getFilterDataWithoutAccessTocken(filter_data){
        return this.http.get(environment.baseurl+filter_data).map((res: Response) => {              return res.json();
        });
    }

    public deleteReportData(id){
        return this.http.delete(environment.baseurl+'reports/'+id+'/?access_token='+localStorage.getItem("authToken")).map((res: Response) => {            
            return res.json();
        });
    }

    public updateData(data,id){
        return this.http.put(environment.baseurl+'reports/'+id+'?access_token='+localStorage.getItem("authToken"),data).map((res: Response) => {       
            return res.json();
        });
    }
}