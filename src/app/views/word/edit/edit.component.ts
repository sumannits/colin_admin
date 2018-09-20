import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { WordService } from '../../../services/word.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  rForm: FormGroup;
  error: string;
  wordId: any;
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
  constructor(private fb: FormBuilder,private router: Router, private activatedRoute:ActivatedRoute,  private wordService: WordService) {
    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'description': [],
      'is_active': ''    
         
    });

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.wordId = params['id'];        
      this.getIndividualWord(this.wordId);
  });
  }


  goToList() {
    this.router.navigate(['word']);
  }

  public editWord(word){   
    word.is_active = this.is_active;
    //faq.answer = this.content;
    this.wordService.editWord(word,this.wordId).subscribe(res=>{      
      this.router.navigate(['/word']);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getIndividualWord(Id){
    this.wordService.getIndividualWord(Id).subscribe(res=>{
      
      this.rForm.controls['name'].setValue(res.name);
      this.rForm.controls['description'].setValue(res.description); 
      this.content = res.description;
      this.is_active = res.is_active;
      this.rForm.controls['is_active'].setValue(res.is_active);             
      
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public changeIsActive($e: any){
    this.is_active = !this.is_active;
    //console.log(this.is_active);
  }

}
