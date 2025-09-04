import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { ICategory } from '../entity/category';
import { UtilService } from './util.service';
import { IPostRecord, IPost } from '../entity/post';
import { IMenuItem, ISelectedMenu } from '../entity/menu-item';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private httpClient: HttpClient,private config:ConfigService,private util:UtilService) { }

  //########## Posts #####################
  //home page
getClientHome(username:string):Observable<IPostRecord>{
 const options = {
    params:{username}
  }
  return this.httpClient.get<IPostRecord>(this.util.getApi(username)+"/home",options);
}

  //single post
  getPost(username:string,id:number):Observable<IPostRecord>{
    return this.httpClient.get<IPostRecord>(this.util.getApi(username)+"/post",{params:{id}});

  }
//all posts
  getPosts(username:string,postType:string):Observable<IPostRecord>{
    const options = {
      params:{postType}
    }
    return this.httpClient.get<IPostRecord>(this.util.getApi(username)+"/posts",options)
  }//

  getPostsBycategoryId(username:string,id:number){
    const options = {
      params:{id}
    }
    return this.httpClient.get<IPost[]>(this.util.getApi(username)+ "/posts/cat-id",options)
  }//

createPost(username:string,post:IPost):Observable<number>{
      const options = {withCredentials:true}
      return this.httpClient.post<number>(this.util.getApi(username,true)+"/post/save",post,options);
}//

deletePost(username:string,ids:number[]):Observable<boolean>{
  const options = {
    withCredentials:true,
    params:{ids}
  }
  return this.httpClient.post<boolean>(this.util.getApi(username,true)+"/post/delete",ids,options);
}//

//################# categories ##################
  getCategory(username:string,id:number):Observable<ICategory>{
    const options = {
      withCredentials:true,
      params:{id}
    }
  return this.httpClient.get<ICategory>(this.util.getApi(username,true)+"/archive/category",options);
  }//getCategory()

  getCategories(username:string):Observable<ICategory>{
     const options = {
      withCredentials:true,
    }
  return this.httpClient.get<ICategory>(this.util.getApi(username,true) +"/archive/categories",options);
  }//getCategories

  getCategoriesByPostId(username:string,id:number){
    const options = {
      params:{id}
    }
  return this.httpClient.get<any>(this.util.getApi(username)+"/archive/categories",options);
  }//

  createCategory(username:string,category:ICategory):Observable<number>{
      //const headers = new HttpHeaders({'Spstp': csrf});
      const options = {withCredentials:true}
      return this.httpClient.post<number>(this.util.getApi(username,true)+"/archive/category/save",category,options);

  }//createCategory


  deleteCategory(username:string,ids:number[]):Observable<boolean>{
      const options = {
        withCredentials:true,
      }
      return this.httpClient.post<boolean>(this.util.getApi(username,true)+"/archive/category/delete",ids,options);
  }//
  
}
