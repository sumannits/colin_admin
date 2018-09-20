import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PushnotificationService } from '../../../services/pushnotification.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  rForm: FormGroup;
  error: string;
  pushnotificationId: any;
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
  constructor(private fb: FormBuilder,private router: Router, private activatedRoute:ActivatedRoute,  private pushnotificationService: PushnotificationService) {
    this.rForm = fb.group({      
      'name': [null, Validators.required],
      'subject': [null, Validators.required],
      'content': [],
      'is_active': ''    
         
    });

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.pushnotificationId = params['id'];        
      this.getIndividualPushnotification(this.pushnotificationId);
  });
  }


  goToList() {
    this.router.navigate(['pushnotification']);
  }

  public editPushnotification(pushnotification){   
    pushnotification.is_active = this.is_active;
    //faq.answer = this.content;
    this.pushnotificationService.editPushnotification(pushnotification,this.pushnotificationId).subscribe(res=>{      
      this.router.navigate(['/pushnotification']);
    },err=>{
      this.error = "Error Occured, please try again"
    })
  }

  public getIndividualPushnotification(Id){
    this.pushnotificationService.getIndividualPushnotification(Id).subscribe(res=>{
      
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
