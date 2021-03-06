import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { WordService } from '../../../services/word.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  rForm: FormGroup;
  error: string;
  is_active = true;
  public editorOptions: Object = {
    placeholderText: 'Description',
    heightMin:'250px',
    events: {
      'froalaEditor.focus': function (e, editor) {
        console.log(editor.selection.get());
      }
    }
  }
  content: string;
  constructor(private fb: FormBuilder, private router: Router, private wordService: WordService) {

    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'description': [] ,
      'is_active': ''    
      
    });
   }

  ngOnInit() {
  }


  goToList() {
    this.router.navigate(['word']);
  }

  public addWord(word){   
    word.is_active = this.is_active;
    //faq.answer = this.content;
    this.wordService.addWord(word).subscribe(res=>{
      //console.log(res);
      this.router.navigate(['word']);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }
  public changeIsActive($e: any){
    this.is_active = !this.is_active;
    //console.log(this.is_active);
  }

}
