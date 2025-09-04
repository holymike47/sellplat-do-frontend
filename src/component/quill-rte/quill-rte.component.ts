import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { QuillEditorComponent, QuillModule } from 'ngx-quill'


@Component({
  selector: 'app-quill-rte',
  imports: [QuillEditorComponent,QuillModule,NgIf, NgFor, RouterLink, RouterLinkActive,RouterOutlet,FormsModule,ReactiveFormsModule,ErrorMessageComponent],
  templateUrl: './quill-rte.component.html',
  styleUrl: './quill-rte.component.css'
})
export class QuillRteComponent implements OnInit {
  quillForm = new FormGroup({
    quillMainContent:new FormControl("Mike o")
  });
  constructor(){}
  ngOnInit(): void {
    
  }

  get quillMainContent(){
    return this.quillForm.get("quillMainContent");
  }

  submit(){
    console.log(this.quillMainContent?.value);
  }

}
