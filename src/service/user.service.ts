import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { UtilService } from './util.service';
import { IUser } from '../entity/user';
import { Observable } from 'rxjs';
import { IOption } from '../entity/option';
import { IMenuItem, ISelectedMenu } from '../entity/menu-item';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient,private config:ConfigService,private util:UtilService) { }
  //############## Users ###############################
  //single user
getUser(username:string,id:number):Observable<IUser|IUser[]>{
    const options = {
      withCredentials:true,
      params:{id}
    }
        return this.httpClient.get<IUser|IUser[]>(this.util.getApi(username,true)+"/tenant",options);
  }//

  //all users
  getUsers(username:string):Observable<IUser|IUser[]>{
    const options = {
      withCredentials:true
    }
        return this.httpClient.get<IUser|IUser[]>(this.util.getApi(username,true)+"/tenants",options);
  }//

   //add a user under an existing client account
saveUser(username:string,user:IUser):Observable<number>{
    const options = {
      withCredentials:true,
    }
        return this.httpClient.post<number>(this.util.getApi(username,true)+"/tenant/save",user,options);
  }//

  deleteUser(username:string,ids:number[]):Observable<boolean>{
    const options = {
      withCredentials:true,
    }
        return this.httpClient.post<boolean>(this.util.getApi(username,true)+"/tenant/delete",ids,options);
  }//

  //############## Options/Settings ###############################
  getOption(username:string):Observable<IOption>{
    //const headers = new HttpHeaders({'Spstp': csrf});
    const userId = this.util.getUserId();
    const options = {
      withCredentials:true,
      params:{userId}
    }
    let url = this.util.getApi(username,true)+"/tenant/option";
    console.log('url');
    console.log(url);
     return this.httpClient.get<IOption>(url,options);
  }//

  saveOption(username:string,option:IOption):Observable<number>{
          const options = {withCredentials:true}
          return this.httpClient.post<number>(this.util.getApi(username,true)+"/tenant/option/save",option,options);
  }//

  updateOption(username:string,record:{id:number,record:string,value:number}):Observable<number>{
    const options = {withCredentials:true}
    return this.httpClient.post<number>(this.util.getApi(username,true)+"/tenant/option/update",record,options);
}//
//################ MENU ##########################
//for initial building of menu
  getMenuItems(username:string):Observable<IMenuItem>{
    const options = {
      withCredentials:true,
    }
    return this.httpClient.get<IMenuItem>(this.util.getApi(username,true)+"/tenant/menu-items",options);
  }//

  //this is the saved user selection
  getDisplayMenu(username:string):Observable<ISelectedMenu[]>{
    const options = {
      withCredentials:true,
    }
    return this.httpClient.get<ISelectedMenu[]>(this.util.getApi(username,true)+"/tenant/display-menu",options);
  }//

  saveMenu(username:string,menu:ISelectedMenu[]):Observable<boolean>{
    const options = {
      withCredentials:true,
    }
    return this.httpClient.post<boolean>(this.util.getApi(username,true)+"/tenant/menu/save",menu,options);
  }//
}
