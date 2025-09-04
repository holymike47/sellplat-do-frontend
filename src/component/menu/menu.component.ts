import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../service/util.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IMenuItem, ISelectedMenu, testMenu } from '../../entity/menu-item';
import { IPost } from '../../entity/post';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../../service/config.service';
import { map, retry } from 'rxjs';
import { ICategory } from '../../entity/category';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-menu',
  imports: [ErrorMessageComponent,NgFor,NgIf, RouterLink, RouterLinkActive,ReactiveFormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {    
  username!:string;
  statusMessage ="";
  alertType = "";
  menuItems$!:IMenuItem;
  rootMenu:ISelectedMenu[]=[];
  //order:number[] = [];
   constructor(private util:UtilService,private config:ConfigService,private userService:UserService,private router: Router, private activatedRoute: ActivatedRoute){
    }
  ngOnInit(): void {
    this.username = this.util.getUsername();
    this.userService.getMenuItems(this.username).pipe(retry(3)).subscribe(r=>{
      if(r){
        this.menuItems$ = r;
        console.log("menu");
        console.log(this.menuItems$);
       this.processMenu();
       console.log(this.menuItems$.display);
      }else{
        this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
      }
      
    });
     }//

private processMenu():void{
  this.menuItems$.display.sort((o1,o2)=>o1.menuOrder-o2.menuOrder);
      this.rootMenu = this.menuItems$.display.filter(m=>m.parentId==0 || m.parentId==null);
      this.fixOrder(this.rootMenu,true);
      for(let m of this.menuItems$.display){
        if(m.parentId){
          for(let r of this.rootMenu){
            if(m.parentId==r.id){
              if(!this.contains(m,r.children)){
                r.children.push(m);
              }
              this.fixOrder(r.children,false);
            }
          }
        }
      }
      localStorage.setItem("menu",JSON.stringify(this.menuItems$.display));
      console.log("this.menuItems$.display");
      console.log(this.menuItems$.display);
}

private fixOrder(menu:ISelectedMenu[],root:boolean):void{
  menu.sort((o1,o2)=>o1.menuOrder-o2.menuOrder);
  console.log("Menu: before");
  console.log(menu);
  for(let i=0;i<menu.length;i++){
    if(menu[i].parentId==null || menu[i].parentId==0){
      menu[i].menuOrder = i+1;
    }
    else{
      menu[i].menuOrder = i+101;
    }
    
  }
  console.log("Menu: after");
  console.log(menu);
}
checkMenu(element:IPost|ICategory|null,postType:string,custom?:{label:HTMLInputElement,url:HTMLInputElement}):void{
  let link = ""
  let order:number = this.generateId();
  let selectedMenu:ISelectedMenu;
  switch(postType){
    case "page":
    case "post":
      element = element as IPost;
      link = this.username+ "/" + element.title +"/" +element.id;
      selectedMenu = {
        id:order,
        item:element.title,
        postType:postType,
        label:element.title,
        link:link,
        menuOrder:order,
        parent:null,
        parentId:null,
        children:[],
        tenantsUuid:this.util.getTenantsUuid()
      };
      break;
    case "category":
      element = element as ICategory;
      link = this.username+ "/archive/category/"+element.id;
      selectedMenu = {
        id:order,
        item:element.name,
        postType:postType,
        label:element.name,
        link:link,
        menuOrder:order,
        parent:null,
        parentId:null,
        children:[],
        tenantsUuid:this.util.getTenantsUuid()
      };
      break;
    case "custom":
      selectedMenu = {
        id:order,
        item:custom?.label.value as string,
        postType:postType,
        label:custom?.label.value as string,
        link:link,
        menuOrder:order,
        parent:null,
        parentId:null,
        children:[],
        tenantsUuid:this.util.getTenantsUuid()
      };
      if(custom){
        custom.label.value="";
        custom.url.value = "";
      }
      
      break;
    default:
  }
  //this.order.push(selectedMenu!.order);
  this.menuItems$.selected = this.menuArray(selectedMenu!,this.menuItems$.selected,true);
  console.log(this.menuItems$.selected);
}//

addSelectedMenu(postType:string):void{
  this.menuItems$.selected.forEach(i=>{
    if(i.postType==postType){
      this.menuItems$.display =this.menuArray(i,this.menuItems$.display,false);
      this.processMenu();
    }
  });
console.log(this.menuItems$.display);
}


saveMenu():void{
  this.userService.saveMenu(this.username,this.menuItems$.display).pipe(retry(3)).subscribe(r=>
    {
      if(r==true){
        //saving menu returns a boolean instead of number. NOTE: no menu id
        this.menuItems$.display.sort((o1,o2)=>o1.menuOrder-o2.menuOrder);
        localStorage.setItem("menu",JSON.stringify(this.menuItems$.display));
        this.notify("Saved",this.config.ALERT_TYPE[0]);
        console.log("this.menuItems$.display");
        console.log(this.menuItems$.display);
      }else{
        this.notify(this.config.SERVER_ERROR,this.config.ALERT_TYPE[2]);
      }
  },
  err=> this.notify("","",err));
  
}


deleteMenuItem(menu:ISelectedMenu):void{
  //you can only delete a room menu
  //if it has children, make their parents null, so they become root menus
  //let menu:ISelectedMenu = this.getMenuById(id);
for(let i=0;i<this.menuItems$.display.length;i++){
        if((this.menuItems$.display[i].id==menu.id) && (this.menuItems$.display[i].postType==menu.postType)){
          if(this.menuItems$.display[i].children.length>0){
    for(let c of this.menuItems$.display[i].children){
      c.parent=null;
      c.parentId=null;
    }//sub for
  }
  this.menuItems$.display.splice(i, 1);
    this.processMenu();
    this.saveMenu();
    break;
        }//if
      }//main for
}//

removeFromParent(child:ISelectedMenu,parent:ISelectedMenu):void{
  for(let m of this.menuItems$.display){
    if(m.id==parent.id && m.postType==parent.postType){
      for(let i=0;i<m.children.length;i++){
        if((m.children[i].id)==child.id && (m.children[i].postType==child.postType)){
          //menu becomes root menu
          m.children[i].parent=null;
          m.children[i].parentId=null;
          m.children.splice(i,1);
          break;
        }
      }
    break;
    }
  }
 this.processMenu();
 this.saveMenu();
}//

setParent(menu:ISelectedMenu,parent:HTMLSelectElement){
  let newParentId = Number(parent.value);
  menu.parentId = newParentId;
  this.processMenu();
  console.log(this.menuItems$.display);
  }//

 //select parent menu but exclude current menu from the list 
menuList(id:number):ISelectedMenu[]{
  //id: the id of the current menu, which should not display in the list when assigning parent menu
return this.rootMenu.filter(m=>m.id!=id);
}

size(menu?:ISelectedMenu):number{
  if(!menu){
return this.rootMenu.length;
  }
  else{
    return menu.children.length;
  }
  
}//

setOrder(menu:ISelectedMenu,element:HTMLSelectElement,root:boolean):void{
  const oldOrder:number = menu.menuOrder;
  const newOrder:number  = Number(element.value);
  if(oldOrder==newOrder){
    return;
  }

if(root){
  this.menuItems$.display.sort((o1,o2)=>o1.menuOrder-o2.menuOrder);
  console.log("before: ");
        console.log(this.menuItems$.display);
      for(let m of this.menuItems$.display){
      if(m.menuOrder==newOrder){
        if(newOrder<oldOrder){
        //the displaced element
        m.menuOrder=newOrder +1;//increment the displaced element
      }else{
         m.menuOrder=newOrder -1;//decrement the displaced element
      }
      break;
    }//for
     }//
      for(let m of this.menuItems$.display){
      if(m.id==menu.id){
        ////identify selected menu, assign new order
        m.menuOrder=newOrder;
        break;
      }
    }//for
this.fixOrder(this.menuItems$.display,true);
console.log("after: ");
        console.log(this.menuItems$.display);
}
else{
  //if not root
  
for(let mp of this.menuItems$.display){
      if(mp.id==menu.parentId){
        mp.children.sort((o1,o2)=>o1.menuOrder-o2.menuOrder);
        console.log("before: ");
        console.log(mp.children);
         for(let d of mp.children){
          if(d.menuOrder == newOrder){
            if(newOrder<oldOrder){
               d.menuOrder = newOrder +1;//displacement
            }else{
               d.menuOrder = newOrder -1;//displacement
            }
            break;
          }
        }
        //identify selected menu, assign new order
        for(let s of mp.children){
          if(s.id==menu.id){
            s.menuOrder = newOrder;
            break;
          }
        }
        this.fixOrder(mp.children,false);
         console.log("after: ");
        console.log(mp.children);
        break;
  }
        //end of work
      }
}
//this.processMenu();
//this.saveMenu();
}//setOrder

 setLabel(menu:ISelectedMenu,element:HTMLInputElement):void{
  let label:string = element.value.trim();
  if(label==null || label==undefined || label== ""){
    return;
  }
  if(label.length<3){
    return;
  }
  let m = this.getMenuById(menu.id);
  m.label = label;
 }//



private menuArray(element:ISelectedMenu,arr:ISelectedMenu[],removeFound:boolean):ISelectedMenu[]{
  let index = -1;  
  let found =false;
  let length = arr.length;
    if(length==0){
      arr.push(element);
    }else{
      for(let i=0;i<length;i++){
        let e = arr[i];
        if(e.item ==element.item && e.postType == element.postType){
          found=true;
          index = i;
          break;
        }
      }//#for
        if(found){
  
          if(removeFound){
   //dont splice custom menu
   if(element.postType!="custom"){
    arr?.splice(index, 1);
  }
          }
         
          
        }else{
          //if not found
          arr.push(element);
        }
  
     
  }
  return arr;
     }//

     private contains(element:ISelectedMenu,arr:ISelectedMenu[]):boolean{
      let found:boolean = false;
      for(let m of arr){
        if(m.id==element.id && m.postType==element.postType){
            found = true;
            break;
        }
      }
      return found;
     }//

     private generateId():number{
      let dm:ISelectedMenu[] = [...this.menuItems$.display];
      let sm:ISelectedMenu[] = [...this.menuItems$.selected];
      let id:number;
      //just starting
      if(dm.length==0){
        id = sm.length+1;
      }
      else if(sm.length>0){
        let lastItem:ISelectedMenu = sm[sm.length-1];
      id = lastItem.id +1;
      }
      else{
        //obtain last item and increment the id;
        //sort menu by id first
        dm.sort((m1,m2)=>m1.id-m2.id);
        let lastItem:ISelectedMenu = dm[dm.length-1];
      id = lastItem.id +1;
      }
      return id;
     }

     private getMenuById(id:number):ISelectedMenu{
      let menu:ISelectedMenu;
      for(let m of this.menuItems$.display){
        if(m.id==id){
          menu = m;
          break;
        }
      }
    return menu!;
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
