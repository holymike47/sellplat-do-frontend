import { Component, Input, OnInit } from '@angular/core';
import { PostService } from '../../service/post.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive,RouterOutlet } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilService } from '../../service/util.service';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../../service/config.service';
import { map, retry } from 'rxjs';
import { ICategory, newCategory } from '../../entity/category';
import { ImageHandlerComponent } from '../image-handler/image-handler.component';


@Component({
  selector: 'app-category',
  imports: [ImageHandlerComponent,NgIf, NgFor, RouterLink, RouterLinkActive,RouterOutlet,ReactiveFormsModule,ErrorMessageComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  type!:string; // used to know the request type from route eg new, edit, list,detail
  username!:string;
  formMessage!:string;
  statusMessage!:string;
  alertType!:string;
  @Input()
  id!:number;//pass in -1 when creating a new category from other components
  // @Input()
  // initCategory$!:ICategory;
  category$:ICategory = newCategory();
  categories$!:ICategory[];
  categoryIdsToDelete:number[] = [];

  categoryToDeleteInput!:FormControl;

  constructor(private util:UtilService,private config:ConfigService, private postService: PostService,private router: Router, private activatedRoute: ActivatedRoute){

  }
  ngOnInit(): void {
    this.username = this.util.getUsername();
    if(this.id==-1){
      //CREATING category from other compoments
      this.type="new";
      this.processCategories(-1,"new");
    }
    else{
      this.activatedRoute.paramMap.pipe(map(
            param=> {
              let type = param.get("type")as string;
              let id = Number(param.get("id")as string);
              return {"type":type,"id":id};
            }
          )
          ).subscribe(r=>{
            if(r){
              this.type=r.type;
              this.processCategories(r.id,r.type);
            }
          });//username
    }
    

    
  }//ngOnInit()

  processCategories(id:number,type:string):void{
      switch(type){
        case 'list':
          //getting all categories
              this.postService.getCategories(this.username).pipe(retry(3)).subscribe(r=>{
        if(r){
          //there will be at least an empty []
            this.categories$ = r as unknown as ICategory[];
            this.categoryToDeleteInput = new FormControl();
            console.log(this.categories$);
          }else{
            this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
          }
      },err=>{
        this.notify("","",err);
      });
          break;
        case 'detail':
          //getting all categories
              this.postService.getCategory(this.username,id).pipe(retry(3)).subscribe(r=>{
        if(r){
            this.category$ = r;
          }else{
            this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
          }
      },err=>{
        this.notify("","",err);
      });
          break;
        case 'new':
          //get all categories to enable parent category selection
          this.postService.getCategories(this.username).pipe(retry(3)).subscribe(r=>{
        if(r){
            this.categories$ = r as unknown as ICategory[];
          }else{
            this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
          }
      },err=>{
        this.notify("","",err);
      });
          break;
        case 'edit':
          //get all categories to enable parent category selection
          this.postService.getCategories(this.username).subscribe(r=>{
            if(r){
              this.categories$ = r as unknown as ICategory[];
              for(let c of this.categories$){
                if(c.id==id){
                  this.category$ = c;
                  break;
                }
              }
            }else{
              this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
            }
          },err=>this.notify("","",err));
          break;
      }
    }//
  
    selectParentCategory(parent:HTMLSelectElement):void{
      let parentIdName:string[] = parent.value?.split("|*|",2);
      this.category$.parentId =Number(parentIdName[0]);
      this.category$.parentName = parentIdName[1];
    }//
deleteCategories(id?:number|string|null){
  let ids:number[];
  if(id){
    id = id as number;
    ids = [id];
  }else{
    ids = this.categoryIdsToDelete
  }

  this.postService.deleteCategory(this.username,ids).pipe(retry(3)).subscribe(r=>{
    if(r==true){
      let updatedCategories:ICategory[] =[];
      for(let allCat of this.categories$){
        for(let deletedCat of this.categoryIdsToDelete)
        if (allCat.id==deletedCat){break;}
        updatedCategories.push(allCat);
      }
      this.categories$ = updatedCategories;
      this.notify("Deleted",this.config.ALERT_TYPE[0]);
    }else{
      this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[0]);
    }
   },err=>this.notify("","",err));
}//

categoryToDelete(id:number|string|null,value:boolean){
  id = id as number;
  if(value==true){
    if(this.categoryIdsToDelete.includes(id)){return;}
    else{this.categoryIdsToDelete.push(id);}
  }//#if value 
  else{
    //if value is false
    if(this.categoryIdsToDelete.includes(id)){
      //remove
      let index = this.categoryIdsToDelete.indexOf(id);
    if(index >-1){
    this.categoryIdsToDelete.splice(index, 1);
    }
    }
  }
}


saveCategory(){
  //let link:HTMLLinkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  let name = (document.getElementById('name')as HTMLInputElement).value;
  if(!name){
  this.formMessage = "Category name is required";
  return;
}
  let description = (document.getElementById('description')as HTMLInputElement).value;
  let parent = (document.getElementById('parent')as HTMLSelectElement).value;
  if(parent=="None"){
    this.category$.parentId=-1;
    this.category$.parentName=null;
  }else{
    let parentIdName:string[] = parent.split("|*|",2);
      this.category$.parentId =Number(parentIdName[0]);
      this.category$.parentName = parentIdName[1];
  }
        let category:ICategory={
          id:this.category$.id,
          name:name,
          description:description,
          categoryImageUrl:this.category$.categoryImageUrl,
          postIds:[],
          parentName:this.category$.parentName,
          parentId:this.category$.parentId,
          tenantsId:this.util.getUserId(),
          tenantsUuid:this.util.getTenantsUuid()
        };
        console.log(category);
        this.postService.createCategory(this.username,category).pipe(retry(3))
        .subscribe(r=>{
          if(r){
              if(r>0){
              this.categories$.push(this.category$);
              this.notify("Success",this.config.ALERT_TYPE[0]);
              }else if(r==-1){
                this.notify("Category Name Already Exist",this.config.ALERT_TYPE[1]);
              }
              else if(r==-500){
                this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
              }
              else{
                this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
              }
            
          }
          
        },err=>this.notify("","",err)
       );
      }//
      
  saveImageUrl($event:any){
    this.category$.categoryImageUrl = $event as string;
  }

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
