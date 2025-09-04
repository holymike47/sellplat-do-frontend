import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet,RouterLink } from '@angular/router';
import {ReactiveFormsModule,FormControl,FormGroup,Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { NgIf } from '@angular/common';
import { OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UtilService } from '../../service/util.service';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { IUser } from '../../entity/user';
import { ConfigService } from '../../service/config.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ILocalCache } from '../../entity/local-cache';
import { catchError, map, Observable, of, retry } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet,RouterLink,ReactiveFormsModule, NgIf,ErrorMessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit{
title = "Login";
statusMessage!:string;
alertType!:string;
username!:string|null;
formMessage:string = "";
cache!:ILocalCache;
authToken!:string;
loginForm!:FormGroup|null;
user!:{email:string,password:string,username:string|null};
registrationSuccesful:boolean = false;

constructor(private auth: AuthService,private router: Router,private activatedRoute:ActivatedRoute, private util:UtilService,public config:ConfigService){

}

ngOnInit() {
   this.activatedRoute.paramMap
    .pipe(map(param=> param.get("username") as string))
    .subscribe(r=>{
      if(r){
        if(r=='app'){
          this.username=null;
        }
        else{
          this.username=r;
        }
        this.loginForm = new FormGroup({
  email:new FormControl<string>(this.user?.email,[Validators.required,Validators.email]),
  password: new FormControl<string>(this.user?.password,[Validators.required,Validators.minLength(6)])
});
      }
    });

}//

//these enhance form validation
get email(){
    return this.loginForm?.get("email");
  }
  get password(){
    return this.loginForm?.get("password");
  }//

submit():void{
  let user = {
        email: this.email?.value as string,
        password:this.password?.value as string,
        username:this.username
      };
      this.user = user;
      this.auth.login(this.user).pipe(retry(3)).subscribe(r=>{
        if(r){
          this.cache=r;
          this.sendAuthToken("");
          this.formMessage="Please Enter the token sent to you";
          this.loginForm=null;
        }
        else{
          this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
        }
      },err=>this.notify("","",err));

} //   


private sendAuthToken(phone:string):boolean{
this.authToken= "1234";
//set timer after which the form is reset or another token given
return true;
}//
verifyAuthToken(token:HTMLInputElement):void{
  if(this.authToken == token.value){
    this.authToken="";
    console.log(this.cache);
    console.log(this.cache.user.username);
    this.util.setCache(this.cache);
    this.router.navigate([`sp/app/admin/dashboard/${this.cache.user.username}`]);
  }
  else{
    //wrong token
    this.formMessage = "Wrong, please try again";
    token.value = '';
  }
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

}//#class
