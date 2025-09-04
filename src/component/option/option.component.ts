import { Component, input, OnInit, output } from '@angular/core';
import { UtilService } from '../../service/util.service';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigService } from '../../service/config.service';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { IOption } from '../../entity/option';
import { IPost } from '../../entity/post';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../service/user.service';
import { ImageHandlerComponent } from '../image-handler/image-handler.component';
import { retry } from 'rxjs';

@Component({
  selector: 'app-option',
  imports: [ErrorMessageComponent,ImageHandlerComponent,NgIf, NgFor, RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './option.component.html',
  styleUrl: './option.component.css'
})
export class OptionComponent implements OnInit{
  username!:string;
  userId!:number;
  statusMessage!:string;
  alertType!:string;
  option$!:IOption;
  pages$!:IPost[];
  optionForm!:FormGroup;
  

  constructor(private userService:UserService, private util:UtilService,public config:ConfigService,private router: Router, private activatedRoute: ActivatedRoute){
  }
  ngOnInit(): void {
     this.username=this.util.getUsername();
        this.userService.getOption(this.username).pipe(retry(3)).subscribe(r=>{
          if(r){
            this.setOption(r);
          }else{
            this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
          }
          },err=>this.notify("","",err));
      
    
  }//
   
  
 
 setOption(option:IOption){
  this.option$ = option;
  this.optionForm = new FormGroup(
    {
    siteName:new FormControl(this.option$.siteName,[Validators.required]),
		tagline:new FormControl(this.option$.tagline),
    siteLanguage:new FormControl(this.option$.siteLanguage),
    timeZone:new FormControl(this.option$.timeZone),
    currency:new FormControl(this.option$.currency),
    dateFormat:new FormControl(this.option$.dateFormat),
    timeFormat :new FormControl(this.option$.timeFormat),
    activeTheme:new FormControl(this.option$.activeTheme)
  });
 }


saveOption(){
  let siteName = (document.getElementById('siteName')as HTMLInputElement).value;
  let tagline = (document.getElementById('tagline')as HTMLInputElement).value;
  let siteLanguage = (document.getElementById('siteLanguage')as HTMLSelectElement).value;
  let timeZone = (document.getElementById('timeZone')as HTMLSelectElement).value;
  let currency = (document.getElementById('currency')as HTMLSelectElement).value;
  //collections
  let dateFormat = document.querySelector<HTMLInputElement>('.dateFormat:checked')?.value;
  let timeFormat = document.querySelector<HTMLInputElement>('.timeFormat:checked')?.value;
  let activeTheme = document.querySelector<HTMLInputElement>('.activeTheme:checked')?.value;
  //clone option incase save fails
  let cloneOption = this.util.clone(this.option$)as IOption;
  //after validation
  cloneOption.siteName = siteName;
  cloneOption.tagline = tagline;
  cloneOption.siteLanguage = siteLanguage;
  cloneOption.timeZone = timeZone;
  cloneOption.currency = currency;
  cloneOption.dateFormat = dateFormat as string;
  cloneOption.timeFormat = timeFormat as string;
  cloneOption.activeTheme = activeTheme as string;

  console.log(cloneOption);
      this.userService.saveOption(this.username,cloneOption).subscribe(r=>{
        if(r){
          //option can only be edited
          if(r==this.option$.id){
            this.option$ = cloneOption;
            localStorage.setItem("option",JSON.stringify(this.option$));
            this.notify("Saved",this.config.ALERT_TYPE[0]);
          }
          else if(r==-500){
            this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
          }else{
            this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
          }
        }
      },err=>this.notify("","",err));
 }//
 saveOptionbk(){
  let updatedOption = this.optionForm.value as IOption;
  //merge values
  updatedOption.id = this.option$.id;
  updatedOption.tenantsUuid= this.option$.tenantsUuid;
  updatedOption.siteLocationId = this.option$.siteLocationId;
  updatedOption.logoUrl = this.option$.logoUrl;
  updatedOption.homePageId = this.option$.homePageId;
	updatedOption.aboutPageId = this.option$.aboutPageId;
	updatedOption.contactPageId = this.option$.contactPageId;
	updatedOption.blogPageId = this.option$.blogPageId;
	updatedOption.storePageId = this.option$.storePageId;
	updatedOption.privacyPolicyPageId = this.option$.privacyPolicyPageId;
	updatedOption.tosPageId = this.option$.tosPageId;
  console.log(updatedOption);
      this.userService.saveOption(this.username,updatedOption).subscribe(r=>{
        if(r){
          //option can only be edited
          if(r==this.option$.id){
            this.option$ = updatedOption;
            localStorage.setItem("option",JSON.stringify(this.option$));
            this.notify("Saved",this.config.ALERT_TYPE[0]);
          }
          else if(r==-500){
            this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
          }else{
            this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
          }
        }
      },err=>this.notify("","",err));
 }//

// updateOption(record:string,element:HTMLSelectElement):void{
// let value:number = Number(element.value);
// console.log(element);
// console.log(value);
// //check if value changed
// let oldValue:number = this.option$[record] as number;

// if(oldValue==value){
//   return;
// }
// let optionRecord = {
//   id:this.option$.id,
// record:record,
// value:value,
// };
// this.userService.updateOption(this.username,optionRecord).subscribe(r=>
//   {
//     if(r){
//       this.option$[record] = value;
//       localStorage.setItem("option",JSON.stringify(this.option$));
//       this.statusMessage = "Saved";
//     }
// },
// err=>this.notify("","",err));
//  }//

saveImageUrl($event:any,type:string):void{ 
if(type=='logo'){
this.option$.logoUrl = $event as string;
}else if(type=='icon'){
  this.option$.iconUrl = $event as string;
}

console.log(this.option$.logoUrl);
}

private notify(message:string,alertType:string,err?:HttpErrorResponse):void{
this.statusMessage = message;
this.alertType = alertType;
if(err){
  if(err.status==0){
              console.log("network error: "+err.status+" message: "+err.message);
                 this.statusMessage = this.config.NETWORK_ERROR;
                 this.alertType = this.config.ALERT_TYPE[2];     
               }
               else{
                 console.log("server error: "+err.status+" message: "+err.message);
                  this.statusMessage = this.config.SERVER_ERROR;
                  this.alertType = this.config.ALERT_TYPE[2];
               }
}

setTimeout(() => 
  {
   this.statusMessage="";

}, 10000);
}//#notify()

}
