import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { WordService } from '../../services/word.service';
import { DataTableResource } from 'angular-4-data-table';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {
  wordList=[];
  itemResource:any;
  items = [];
  itemCount = 0;
  public defaultRec:number=10;

  constructor(private router: Router, private wordService: WordService) { 

  }

  ngOnInit() {
    this.getAllWords();
    //this.getAllFaqs();
  }

  public getAllWords(){
    this.wordService.getWord().subscribe(res=>{
      this.items = [];
      //this.customerList=res;
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

  public deleteWord(id){
    //console.log(id);
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){      
      this.wordService.deleteWord(id).subscribe(res=>{
        this.getAllWords();
      },err=>{

      })
    }
  }

}
