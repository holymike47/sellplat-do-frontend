import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { UtilService } from '../../service/util.service';
import { PostService } from '../../service/post.service';
import { ICategory, newCategory } from '../../entity/category';
import { map, Observable, retry, switchMap } from 'rxjs';
import { ConfigService } from '../../service/config.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-update',
  imports: [NgIf, NgFor, RouterLink, RouterLinkActive,RouterOutlet,ReactiveFormsModule,FormsModule,ErrorMessageComponent],
  templateUrl: './category-update.component.html',
  styleUrl: './category-update.component.css'
})
export class CategoryUpdateComponent implements OnInit {
  username!:string;
  category$!:ICategory;
  categories$:ICategory[]=[];
  categoryForm!:FormGroup;
  statusMessage:string="";


  constructor(private util:UtilService,private config:ConfigService, private postService: PostService,private router: Router, private activatedRoute: ActivatedRoute){
    
    
    // this.postService.getCategories(false).subscribe(r=>{
    //   if(r){
    //     this.categories$ = r as Category[];
    //       console.log("constructor:");
    //       console.log(this.categories$);
          
    //     }
    // });
    }

    ngOnInit(): void {
      this.activatedRoute.paramMap.pipe(map(
        param=>{
          let id = param.get("id");
          let username:string = param.get("username") as string;
          return {"username":username,"id":id};
        }))
        .subscribe(r=>{
        this.username = r.username;  
        let catId = Number(r.id);
        if(catId==-1){
          //creating new category
          this.setCategory(catId);
        }
        this.postService.getCategories(this.username).subscribe(r=>{
          if(r){
            this.categories$ = r as unknown as ICategory[];
              console.log(this.categories$);
              if(catId!==-1){
                this.setCategory(catId);
              }
            }
        });
        
        });
      


        
          
    }//#ngOnInit()


    setCategory(catId:number):void{
      if(catId==-1){
        this.category$ = newCategory();
      }
      else{
        for(const c of this.categories$){
          if(c.id==catId){
            this.category$ = c;
            break;
          }
        }
      }
      this.getCategoryForm();
        
    }

    getCategoryForm():void{
      this.categoryForm = new FormGroup({
        name:new FormControl<String|null>(this.category$.name,[Validators.required]),
        parentName :new FormControl<String|null>(this.category$.parentName),
        description: new FormControl<String|null>(this.category$.description)
      });
    }//

    updateCategoryForm(c:ICategory):void{
      console.log(c);
      this.category$=c;
      this.categoryForm.patchValue({
        name:c.name,
        parentName:c.parentName,
        description:c.description
      });
    }//
    
  saveCategory(){
    let name = this.categoryForm.get("name")?.value;
    let description = this.categoryForm.get("description")?.value;
    let parentName = this.categoryForm.get("parentName")?.value;

    let category:ICategory={
      id:this.category$.id,
      name:name,
      description:description,
      categoryImageUrl:"",
      postIds:[],
      parentName:parentName,
      parentId:-1
    }

    this.postService.createCategory(this.username,category).pipe(retry(3))
    .subscribe(r=>{
      if(r){
        console.log(r);
          this.statusMessage = "Success";
          this.router.navigateByUrl("admin/dashboard/category-list/0");
      }
      
    }
  );
  }//
    
    
  }


