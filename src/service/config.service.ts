import { Injectable } from '@angular/core';;
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor() {
   }
  SELLPLAT:string="Sellplat";
  BASE_URL:string ="http://localhost:8080/";
  ADMIN_BASE_URL:string ="http://localhost:8080/admin/";
  SPLITTER:string = "|*|";
  SITE_LANGUAGE:string[] = ["English","French"];
  DATE_FORMAT:string[] = ["d/m/y","m/d/y","y/m/d"];
  TIME_FORMAT:string[] = ["H:i","g:i A"];
  TIME_ZONE:string[] = ["Lagos","Toronto"];
  CURRENCY:string[] = ["USD","NGR","CAD"];
  ACTIVE_THEME:string[] = ["Blue","Green","Red"];
  SIDEBAR_LAYOUT=  ["NONE","LEFT", "RIGHT"];
  CONTENT_STATUS = ["DRAFT","PUBLISHED"];
  POST_TYPE = ["POST","PAGE","PRODUCT","COURSE"];
  ROLES = ["SUBSCRIBER","CONTRIBUTOR","AUTHOR","EDITOR"];

  //##########
  NETWORK_ERROR:string = "Please check your internet connection";
  SERVER_ERROR:string = "Server Error: please try again";
  ALERT_TYPE:string[] = ["alert-success", "alert-warning", "alert-danger"];

  //#######
}
