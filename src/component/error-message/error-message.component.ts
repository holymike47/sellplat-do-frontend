import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from '../../service/config.service';

@Component({
  selector: 'app-error-message',
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent implements OnInit {
  constructor(private config:ConfigService){

  }
  ngOnInit(): void {
    
  }
  
  @Input()
  errorMessage:string = "";
  @Output() 
  errorMessageChange = new EventEmitter<string>();
  updateErrorMessage(message: string):void{
    this.errorMessage =message;
    this.errorMessageChange.emit(this.errorMessage);
  }//

  @Input()
  alertType:string = "";
  @Output() 
  alertTypeChange = new EventEmitter<string>();
  updateAlertType(message: string):void{
    this.alertType =message;
    this.alertTypeChange.emit(this.alertType);
  }//

private notify(message:string,alertType:string,err?:HttpErrorResponse):void{
this.errorMessage = message;
this.alertType = alertType;
if(err){
  if(err.status==0){
              console.log("network error: "+err.status+" message: "+err.message);
                 this.errorMessage = this.config.NETWORK_ERROR;
                 this.alertType = this.config.ALERT_TYPE[2];     
               }
               else{
                 console.log("server error: "+err.status+" message: "+err.message);
                  this.errorMessage = this.config.SERVER_ERROR;
                  this.alertType = this.config.ALERT_TYPE[2];
               }
}

setTimeout(() => 
  {
   this.errorMessage="";

}, 10000);
}//#notify()
  

}
