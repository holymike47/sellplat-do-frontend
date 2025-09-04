import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { PostService } from '../../service/post.service';
import { IPost, IPostRecord, newPost } from '../../entity/post';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map} from 'rxjs';
import { RecentPostsComponent } from "../widgets/recent-posts/recent-posts.component";
import { ISelectedMenu } from '../../entity/menu-item';
import { IOption } from '../../entity/option';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule, NgIf, NgFor, RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule, TitleCasePipe, RecentPostsComponent, FooterComponent, HeaderComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
  encapsulation:ViewEncapsulation.None
})
export class PostDetailComponent implements OnInit{
   @ViewChild('favicon') favicon!: ElementRef<HTMLLinkElement>;
  @ViewChild('mainContent') mainContent!: ElementRef;
  @ViewChild('viewContainer') viewContainer!: ElementRef;
  @Input()
  initPostRecord!:IPostRecord;
  menu!:ISelectedMenu[];
  option!:IOption;
  theme:string = "bg-success-subtle";
  @Input()
  username!:string;
  post$!:IPost;
  //#########
  mainContentClass!:string;
  sidebarClass!:string;
  
  constructor(private sanitizer: DomSanitizer,private renderer: Renderer2,private postService: PostService,private router: Router, private activatedRoute: ActivatedRoute){
    
  }

  ngOnInit(): void {
    if(this.initPostRecord){
      this.setPost(this.initPostRecord);
    }else{
      this.activatedRoute.paramMap.pipe(map(
      param=> {
        let postId = param.get("id") as string;
        let username = param.get("username") as string;
        return {"postId":postId,"username":username};
      }))
    .subscribe(r=>{
      this.username = r.username;
      this.postService.getPost(this.username,Number(r.postId)).subscribe(r2=>
        {
        this.setPost(r2);
      });
    });
    }
}//
ngAfterViewInit(): void {
//this.mainContent.nativeElement.innerHTML=this.post$.mainContent;
console.log("this.favicon");
console.log(this.favicon);
let favicon:string = "favicons/cc.ico";
let link:HTMLLinkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
link.href = favicon;
console.log("link");
console.log(link);
}//

setPost(postRecord:IPostRecord):void{
  this.post$ = postRecord.posts[0];
  this.menu = postRecord.menus;
  console.log("setPost");
  console.log(this.menu);
  this.option = postRecord.option;
  if(this.post$.id==this.option.blogPageId){
    this.router.navigate([`${this.username}/archive/post/${this.post$.id}`]);
  }
  if(this.post$.sidebarType=="NONE"){
    this.mainContentClass = "col-12";
  }else{
    //we have a right or left sidebar
    this.mainContentClass = "col-md-8 order-2";
    if(this.post$.sidebarType=="LEFT"){
      this.sidebarClass = "order-1";
    }else{
      this.sidebarClass = "order-3";
    }
  }
  this.processMenu();
    }//

    getSafeMainContent(): SafeHtml {
    let tempDiv = this.renderer.createElement('div');
    tempDiv.innerHTML = this.post$.mainContent;
    let buttons = tempDiv.querySelectorAll('a.sp-button')as NodeList;
    for(let button of buttons){
      let input = button.firstChild as HTMLButtonElement;
      let value = input.value;
      button.replaceChild(this.renderer.createText(value),input);
    }
    let outputMessage = tempDiv.outerHTML as string;
    console.log(buttons);
    return this.sanitizer.bypassSecurityTrustHtml(outputMessage);
      //return this.sanitizer.bypassSecurityTrustHtml(this.post$.mainContent as string);
    }//

    getSafeMainContentbk(): SafeHtml {
      let tempDiv = this.renderer.createElement('div');
    tempDiv.innerHTML = this.post$.mainContent;
    let buttons = tempDiv.querySelectorAll('a.sp-button')as NodeList;
    for(let button of buttons){
      let input = button.firstChild as HTMLButtonElement;
      let value = input.value;
      button.replaceChild(this.renderer.createText(value),input);
    }
    let outputMessage = tempDiv.outerHTML as string;
    console.log(buttons);
    return this.sanitizer.bypassSecurityTrustHtml(outputMessage);
      //return this.sanitizer.bypassSecurityTrustHtml(this.post$.mainContent as string);
    }

    private processMenu():void{
      let arrayString = JSON.stringify(this.menu);
      let menu:ISelectedMenu[] = JSON.parse(arrayString);
      let root:ISelectedMenu[] = [];
      let nonRoot:ISelectedMenu[] = [];
      //first obtain the root menu
      for(let m of menu){
        if(m.parentId==0){
          root.push(m);
        }
        else{
          nonRoot.push(m);
        }
      }//

      if(root.length>0){
        if(nonRoot.length>0){
          for(let r of root){
            for(let nr of nonRoot){
              if(r.id==nr.parentId){
                r.children.push(nr);
              }
            }
          }
        }
        this.menu=root;
      }
    }//
}