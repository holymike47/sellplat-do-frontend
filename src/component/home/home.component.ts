import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ILocalCache } from '../../entity/local-cache';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { UtilService } from '../../service/util.service';
import { ConfigService } from '../../service/config.service';
import { retry } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-home',
  imports: [RouterOutlet,RouterLink,ReactiveFormsModule, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
title = "Home";
statusMessage!:string;
  alertType!:string;
formMessage:string = "";
  cache!:ILocalCache;
  authToken!:string;
  registerForm!:FormGroup|null;
  user!:{email:string,password:string};
  registrationSuccesful:boolean = false;
  //
  get email(){
    return this.registerForm?.get("email");
  }
  get password(){
    return this.registerForm?.get("password");
  }//

  constructor(private auth: AuthService,private router: Router,private activatedRoute:ActivatedRoute, private util:UtilService,public config:ConfigService){
}//
ngOnInit() {
  this.registerForm = new FormGroup({
  email:new FormControl<string>(this.user?.email,[Validators.required,Validators.email]),
  password: new FormControl<string>(this.user?.password,[Validators.required,Validators.minLength(6)])
});
}//

submit():void{
  let user = {
        email: this.email?.value as string,
        password:this.password?.value as string,
      };
  
      this.user = user;
      console.log(this.user);
        //check if user exists
        this.auth.userExists(user.email).pipe(retry(3)).subscribe(r=>{
          //response is a boolean
            if(r==true){
            this.formMessage = "The email has been taken";
          }
          else if(r==false){
            this.registerForm=null;
            this.formMessage = "Please enter the code sent to your email";
            this.sendAuthToken(user.email);
          }else if(r==-500){
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
      //now register the user
       this.auth.register(this.user).pipe(retry(3)).subscribe(r=>{
            if(r){  
              console.log(r);
              this.cache = r;
              this.util.setCache(this.cache);
              this.registrationSuccesful=true;
              this.formMessage = "Thank you, please visit your dashboard";
              //display button for user to navigate to dashboard
            }else{
              this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
            }
          },err=>this.notify("","",err));
    
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
}
