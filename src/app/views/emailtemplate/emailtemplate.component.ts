import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EmailtemplateService } from '../../services/emailtemplate.service';

@Component({
  selector: 'app-emailtemplate',
  templateUrl: './emailtemplate.component.html',
  styleUrls: ['./emailtemplate.component.css']
})
export class EmailtemplateComponent implements OnInit {
  emailtemplateList=[];
  constructor(private router: Router, private emailtemplateService: EmailtemplateService) { 

  }

  ngOnInit() {
    this.getAllEmailtemplates();
    //this.getAllFaqs();
  }

  public getAllEmailtemplates(){
    this.emailtemplateService.getEmailtemplate().subscribe(res=>{
      //console.log(res);
      this.emailtemplateList=res;
    })
  }
  public deleteEmailtemplate(id){
    //console.log(id);
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){      
      this.emailtemplateService.deleteEmailtemplate(id).subscribe(res=>{
        this.getAllEmailtemplates();
      },err=>{

      })
    }
  }

}
