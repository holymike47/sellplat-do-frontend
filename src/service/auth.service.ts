import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { csrfToken } from '../entity/csrf-token';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { IOption } from '../entity/option';
import { IUser } from '../entity/user';
import { UtilService } from './util.service';
import { ILocalCache } from '../entity/local-cache';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient,private config:ConfigService,private util:UtilService) { }
  

  login(user:{email:string,password:string,username:string|null}):Observable<ILocalCache>{
    const options = {withCredentials:true}
        return this.httpClient.post<ILocalCache>(this.config.BASE_URL+"login",user,options);
  }//

  //register a new client
  register(user:{email:string,password:string}):Observable<ILocalCache>{
    const options = {withCredentials:true}
        return this.httpClient.post<ILocalCache>(this.config.BASE_URL+"register",user,options);
  }//

  userExists(email:string):Observable<boolean|number>{
    const options = {
      params:{email}
    }
        return this.httpClient.get<boolean|number>(this.config.BASE_URL+"tenant/exists",options);
  }//


  logout(user:IUser):Observable<boolean>{
    const options = {withCredentials:true}
        return this.httpClient.post<boolean>(this.config.ADMIN_BASE_URL+"logout",user,options);
  }//

}
