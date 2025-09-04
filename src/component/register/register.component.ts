import { Component } from '@angular/core';
import { ILocalCache } from '../../entity/local-cache';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { UtilService } from '../../service/util.service';
import { ConfigService } from '../../service/config.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterOutlet,RouterLink,ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  title = "Register";
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
        this.auth.userExists(user.email).subscribe(r=>{
          //response is a boolean
            if(r==true){
            this.formMessage = "The email has been taken";
          }
          else{
            this.registerForm=null;
            this.formMessage = "Please enter the code sent to your email";
            this.sendAuthToken(user.email);
          }
          
        },err=>this.formMessage="Error......");
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
       this.auth.register(this.user).subscribe(r=>{
            if(r){  
              console.log(r);
              this.cache = r;
              this.util.setCache(this.cache);
              this.registrationSuccesful=true;
              this.formMessage = "Thank you, please visit your dashboard";
              //display button for user to navigate to dashboard
            }
          },err=>this.formMessage="Error processing registeration");
    
  }
  else{
    //wrong token
    this.formMessage = "Wrong, please try again";
    token.value = '';
  }
}//

}//#class
