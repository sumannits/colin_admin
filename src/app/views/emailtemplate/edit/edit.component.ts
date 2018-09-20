import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EmailtemplateService } from '../../../services/emailtemplate.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  rForm: FormGroup;
  error: string;
  emailtemplateId: any;
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
  constructor(private fb: FormBuilder,private router: Router, private activatedRoute:ActivatedRoute,  private emailtemplateService: EmailtemplateService) {
    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'subject': [null, Validators.required],
      'content': [],
      'is_active': ''    
         
    });

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.emailtemplateId = params['id'];        
      this.getIndividualEmailtemplate(this.emailtemplateId);
  });
  }


  goToList() {
    this.router.navigate(['emailtemplate']);
  }

  public editEmailtemplate(emailtemplate){   
    emailtemplate.is_active = this.is_active;
    //faq.answer = this.content;
    this.emailtemplateService.editEmailtemplate(emailtemplate,this.emailtemplateId).subscribe(res=>{      
      this.router.navigate(['/emailtemplate']);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getIndividualEmailtemplate(Id){
    this.emailtemplateService.getIndividualEmailtemplate(Id).subscribe(res=>{
      
      this.rForm.controls['name'].setValue(res.name);
      this.rForm.controls['subject'].setValue(res.subject);
      this.rForm.controls['content'].setValue(res.content); 
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
