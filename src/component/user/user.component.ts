import { Component, OnInit } from '@angular/core';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilService } from '../../service/util.service';
import { ConfigService } from '../../service/config.service';
import { IUser, newUser } from '../../entity/user';
import { map, retry } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user',
  imports: [ErrorMessageComponent,NgFor,NgIf, RouterLink, RouterLinkActive,FormsModule,ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  type!:string;
  changePassword:boolean = false;
  username!:string;
  formMessage!:string;
  statusMessage!:string;
  alertType!:string;
  users$:IUser[] = [];
  user!:IUser;
  tenant!:IUser;
  isTenant:boolean = false;

  constructor(private userService:UserService,private util:UtilService,public config:ConfigService,private router: Router, private activatedRoute: ActivatedRoute){
    }
  ngOnInit(): void {
   this.username = this.util.getUsername();
       this.activatedRoute.paramMap.pipe(map(
         param=>{
           let type = param.get("type")as string;
           let id = Number(param.get("id")as string);
           return {"type":type,"id":id};
         }
         )).subscribe(r=>{
         if(r){
          this.type=r.type;
          this.processUsers(r.id,this.type);
         }
  });
  }//
  processUsers(id:number,type:string):void{
    switch(type){
      case 'list':
        //getting all users
        this.userService.getUsers(this.username).pipe(retry(3)).subscribe(r=>{
            if(r){
              this.users$ = r as IUser[];
            }
            else{
              this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
            }
          },err=>this.notify("","",err));
        break;
      case 'new':
        this.user = newUser();
        break;
      case 'edit':
      case 'detail':
        this.userService.getUser(this.username,id).subscribe(r=>{
            if(r){
              this.user = r as IUser;
            }else{
              this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
            }
          });
    }
  }//

saveUser():void{
  //tenant is creating or editing a user
let userForm = document.getElementById('userForm')as HTMLFormElement;
let email = (userForm.querySelector('#email')as HTMLInputElement).value;
if(!email){
  this.formMessage = "Email is required";
  return;
}
let firstName = (userForm.querySelector('#firstName')as HTMLInputElement).value;
let middleName = (userForm.querySelector('#middleName')as HTMLInputElement).value;
let lastName = (userForm.querySelector('#lastName')as HTMLInputElement).value;
let website = (userForm.querySelector('#website')as HTMLInputElement).value;
let password = (userForm.querySelector('#password')as HTMLInputElement).value;//??
//select
let topRole = (userForm.querySelector('#topRole')as HTMLSelectElement).value;        
let user:IUser;
if(this.type='new'){
  user = this.user;
  user.tenantsUuid = this.util.getTenantsUuid();
  user.username = this.username;
}else {
  user = this.util.clone(this.user)as IUser;
}
user.email = email; 
user.firstName = firstName;
user.middleName = middleName;
user.lastName = lastName;
user.website = website;
user.password = password;
user.topRole = topRole;

console.log("user");
console.log(user);

this.userService.saveUser(this.username,user).pipe(retry(3)).subscribe(r=>{
  if(r){
    if(r>0){
      this.user = user;
      this.notify("Saved",this.config.ALERT_TYPE[0]);
    }
    else if(r==-1){
      this.notify("User already registered",this.config.ALERT_TYPE[1]);
    }else if(r==-500){
      this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
    }
    else{
      this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
    }
    
  }
},err=>this.notify("","",err));
}//

  deleteUser(id:number|null):void{
    id = id as number;
    let ids = [id];
    this.userService.deleteUser(this.username,ids).subscribe(r=>{
  if(r){
    if(r==true){
      this.notify("Deleted",this.config.ALERT_TYPE[0]);
    }else{
      this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
    }
    
  }
},err=>this.notify("","",err));

  }//

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