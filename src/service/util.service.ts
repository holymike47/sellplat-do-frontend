import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { ILocalCache } from '../entity/local-cache';
import { IOption } from '../entity/option';
import { IUser } from '../entity/user';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(private config:ConfigService) { }

  capitalize(input:string):string{
    let inputToLowerCase = input.trim().toLowerCase();
    let result = inputToLowerCase[0].toUpperCase();
    if(input.length>1){
      result += inputToLowerCase.substring(1);
    }
    return result;
    }// # capitalize()

   getApi(username:string,admin?:boolean):string{
    //username = username.replace(/"/g, '');
    let apiBase:string = this.config.BASE_URL;
    if(admin){
      apiBase = apiBase +  username + "/admin";
    }else{
      apiBase = apiBase + username;
    }
    return apiBase;
   }
   setCache(cache:ILocalCache):void{
    localStorage.setItem("user",JSON.stringify(cache.user));
    localStorage.setItem("option",JSON.stringify(cache.option));
    localStorage.setItem("menu",JSON.stringify(cache.displayMenu));
   }
     getUserId():number{
      let user:IUser = JSON.parse(localStorage.getItem("user") as string);
return user.id as number;
      }//
      getTenantsUuid():string{
      let user:IUser = JSON.parse(localStorage.getItem("user") as string);
return user.tenantsUuid as string;
      }//
getTopRole():string{
  let user:IUser = JSON.parse(localStorage.getItem("user") as string);
  return user.topRole;
}
getUsername():string{
let user:IUser = JSON.parse(localStorage.getItem("user") as string);
//let username = localStorage.getItem("username") as unknown as string;
//username = username.replace(/"/g, '');
//console.log("username: "+username);
return user.username as string;
      }//

      getOption():IOption{
        const option:IOption = JSON.parse(localStorage.getItem("option") as string );
        return option;
              }//
logout():void{
localStorage.removeItem("tenant");//?remove
localStorage.removeItem("menu");
localStorage.removeItem("option");
localStorage.removeItem("user");
      }//

clone(o:any):object{
  let serial = JSON.stringify(o);
  return JSON.parse(serial);
}
      
}
