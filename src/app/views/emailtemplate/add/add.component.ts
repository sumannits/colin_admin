import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EmailtemplateService } from '../../../services/emailtemplate.service';

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
    placeholderText: 'Content',
    heightMin:'250px',
    events: {
      'froalaEditor.focus': function (e, editor) {
        console.log(editor.selection.get());
      }
    }
  }
  content: string;
  constructor(private fb: FormBuilder, private router: Router, private emailtemplateService: EmailtemplateService) {

    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'subject': [null, Validators.required],
      'content': [] ,
      'is_active': ''    
      
    });
   }

  ngOnInit() {
  }


  goToList() {
    this.router.navigate(['emailtemplate']);
  }

  public addEmailtemplate(emailtemplate){   
    emailtemplate.is_active = this.is_active;
    //faq.answer = this.content;
    this.emailtemplateService.addEmailtemplate(emailtemplate).subscribe(res=>{
      //console.log(res);
      this.router.navigate(['/emailtemplate']);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }
  public changeIsActive($e: any){
    this.is_active = !this.is_active;
    //console.log(this.is_active);
  }

}
