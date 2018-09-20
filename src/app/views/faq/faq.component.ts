import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FaqService } from '../../services/faq.service';
import { DataTableResource } from 'angular-4-data-table';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqList=[];
  itemResource:any;
  items = [];
  itemCount = 0;
  public defaultRec:number=10;

  constructor(private router: Router, private faqService: FaqService) { 

  }

  ngOnInit() {
    this.getAllFaqs();
  }

  public getAllFaqs(){
    this.faqService.getFaq().subscribe(res=>{
      this.items = [];
      this.itemResource = new DataTableResource(res);
      this.itemResource.count().then(count => this.itemCount = count);
      this.items=res;
      if(this.items.length<10){
        this.defaultRec=this.items.length;
      }
    })
  }
  
  public reloadItems(params) {
    //console.log(params);
      this.itemResource.query(params).then(items => this.items = items);
  }

  public deleteFaq(id){
    //console.log(id);
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){      
      this.faqService.deleteFaq(id).subscribe(res=>{
        this.getAllFaqs();
      },err=>{

      })
    }
  }

}
