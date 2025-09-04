import { Component, OnInit } from '@angular/core';
import { PostService } from '../../service/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { IPost, IPostRecord } from '../../entity/post';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { UtilService } from '../../service/util.service';
import { ConfigService } from '../../service/config.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PostDetailComponent } from '../post-detail/post-detail.component';

@Component({
  selector: 'app-client-home',
  imports: [FooterComponent,HeaderComponent,PostDetailComponent],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.css'
})
export class ClientHomeComponent implements OnInit {
  postRecord$!:IPostRecord;
  username!:string;
  statusMessage!:string;
  alertType!:string;
   constructor(private util:UtilService,private config:ConfigService,private postService: PostService,private router: Router, private activatedRoute: ActivatedRoute){
        
      }
  ngOnInit(): void {
    this.activatedRoute.paramMap
    .pipe(map(param=> param.get("username") as string))
    .subscribe(r=>{
      if(r){
        this.username = r;
        console.log('home');
        this.postService.getClientHome(r).subscribe(r2=>{
    if(r2){
      this.postRecord$ = r2;
      console.log("client home");
      console.log(this.postRecord$);
    }
  },err=>this.notify("","",err));
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
