import { NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, Renderer2, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageHandlerComponent } from '../image-handler/image-handler.component';

@Component({
  selector: 'app-page-builder',
  imports: [ImageHandlerComponent,ReactiveFormsModule, NgIf],
  templateUrl: './page-builder.component.html',
  styleUrl: './page-builder.component.css'
})
export class PageBuilderComponent implements OnInit,OnDestroy {
  @ViewChild('pb') pb!: ElementRef;
  //@ViewChild('initPageMessage') initPageMessage!: ElementRef;
  //@ViewChild('blockMenu') blockMenu!: ElementRef;
  @ViewChild('display') display!: ElementRef;
  @ViewChild('contextMenu') contextMenu!: ElementRef;
  @ViewChild('modalButton') modalButton!: ElementRef;
  @ViewChild('saveLinkButton') saveLinkButton!: ElementRef;
  @ViewChild('linkInputField') linkInputField!: ElementRef;
  @ViewChild('closeModalButton') closeModalButton!: ElementRef;
  ///######
  @Input()
  initMessage!:string|null;
  @Input()
  initTitle!:string|null;
  @Input()
  initPublish!:string|null;
  @Output() 
  pageMessage = new EventEmitter<{title:string,message:string,publish:boolean}>();
  
  formTitle:FormControl = new FormControl<string>("",[Validators.required]);
  formMessage!:string;
  ne!:HTMLDivElement;
  section!:HTMLDivElement;
  blockMargin:string ="mb-3";
  pageText:string = "";
  pageDisplay!:HTMLDivElement;
  contextMenuContainer!:HTMLDivElement;
  richTextLink!:string|undefined;
  selectionRange!:Range;
  selectedText!:string;
  initialText='God wants you well. Understanding and living according to God’s plan is the key to life’s fulfillment.';
  subscriptions:(()=>void)[] = [];
  imageUrl!:string;
  constructor(private renderer: Renderer2, private router: Router, private activatedRoute: ActivatedRoute){
      }
  ngOnDestroy(): void {
    for(let subscription of this.subscriptions ){
      if(subscription){
        subscription();
      }
      
    }
  }
  ngOnInit(): void {
  
  }
  ngAfterViewInit(): void {
    this.ne = this.pb.nativeElement as HTMLDivElement;
    this.pageDisplay = this.display.nativeElement as HTMLDivElement;
    this.contextMenuContainer = this.contextMenu.nativeElement as HTMLDivElement;
    if(this.initMessage){
      this.initilizePageBuilder();
    }else{
    let wrapper = this.addRow(true) as HTMLDivElement;
    let contentContainer = wrapper.firstChild as HTMLDivElement;
    this.renderer.appendChild(contentContainer,this.getRichTextBlock(true));
    //contentContainer.replaceChild(this.getRichTextBlock(),contentContainer.firstChild as HTMLDivElement);
    }
    this.attachEvents();
}//

saveImageUrl($event:any){
    this.imageUrl = $event as string;
  }

get pageTitle():string{
    return this.formTitle.value;
  }

set pageTitle(title:string){
  this.formTitle.setValue(title);
}
  
  //########### BASIC BLOCKS ##########
  private getImageBlockbk(standAlone:boolean,clasz:string[],$cm?:HTMLAnchorElement):HTMLDivElement|void{
    const $this = this;
    let bc:HTMLDivElement;
    let cm:HTMLAnchorElement;
    let el:HTMLElement;
    let image:HTMLImageElement;
    let cardBody!:HTMLDivElement;
    if(!$cm){
    let r = this.getBlockContainer(standAlone,'div','',['sp-image']);
    bc = r.bc;
    cm=r.cm;
    el=r.el;
    this.addClass(bc,['sp-block']);
    this.addClass(el,clasz);
    let imageDiv:HTMLDivElement = (document.getElementById('sp-image')?.cloneNode(true))as HTMLDivElement;
    // let han = imageDiv.children[0] as unknown as ImageHandlerComponent;
    // this.listen(han,'',()=>{});
    // el.appendChild(imageDiv);
    cardBody =el.firstElementChild?.firstElementChild?.firstElementChild as HTMLDivElement;
    image = cardBody.children[2].firstElementChild?.firstElementChild as HTMLImageElement;
    //attact click event to button to trigger upload
    if(standAlone){
      attachEvents(cm);
    }
    console.log(bc);
    return bc;
    }
    attachEvents($cm);
    function attachEvents(cMenu:HTMLAnchorElement):void{
      let row:HTMLDivElement;
      let parent:HTMLDivElement;
    if(bc){
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
    }
    else{
      cm = cMenu;
      bc = cm.closest('.container') as HTMLDivElement;
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
      el = parent.firstElementChild as HTMLElement;
      cardBody =el.firstElementChild?.firstElementChild?.firstElementChild as HTMLDivElement;
      image = cardBody.children[2].firstElementChild?.firstElementChild as HTMLImageElement;
    }
    let remove = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(remove,$this.renderer.createText('Delete'));
     $this.listen(remove,'click',()=>{
    $this.deleteBlock(el,row);
    });

    $this.renderer.listen(cm,'click',(e)=>{
      $this.getContextMenu([remove],e);
})//cm click;
    }//inner()

  }//
  private getImageBlock(standAlone:boolean,clasz:string[],$cm?:HTMLAnchorElement):HTMLDivElement|void{
    const $this = this;
    let bc:HTMLDivElement;
    let cm:HTMLAnchorElement;
    let el:HTMLElement;
    let image:HTMLImageElement;
    let input:HTMLInputElement;
    let placeholder:HTMLAnchorElement;
    if(!$cm){
    let r = this.getBlockContainer(standAlone,'div','',['sp-image']);
    bc = r.bc;
    cm=r.cm;
    el=r.el;
    this.addClass(bc,['sp-block']);
    this.addClass(el,clasz);
    //placeholder
    placeholder= this.createElement('a',['sp-image-placeholder','text-decoration-none'],[{n:'type',v:'button'}]) as HTMLAnchorElement;
    let text = this.renderer.createText("Add");
    this.renderer.appendChild(placeholder,text);
    let i = this.createElement('i',['bi','bi-image']);
    this.renderer.appendChild(placeholder,i);
    //now append button
    this.renderer.appendChild(el,placeholder);
    let p = this.createElement('p');
    this.renderer.appendChild(el,p);
    //now append
    image = this.createElement('img',['sp-image','d-none','img-fluid']) as HTMLImageElement;
    //now append image
    this.renderer.appendChild(p,image);
    //
    input = this.createElement('input',['sp-image','d-none'],[{n:'type',v:'file'},{n:'accept',v:'image/*'}]) as HTMLInputElement;
    //now append input
    this.renderer.appendChild(el,input);
    //attact click event to button to trigger upload
    $this.listen(placeholder,'click',()=>{
      input.click();
    });

  $this.listen(input,'change',()=>{
  const file = (input.files as FileList)[0];
  if (file) {
  let $this=this;
  const reader = new FileReader();
  reader.onload = async function(e) {
  image.src  = (e!.target!.result as string);
  if(image.src){
    placeholder.replaceChild($this.renderer.createText("Change"),text);
  }else{
    placeholder.replaceChild($this.renderer.createText("Add"),text);
  }
  }
  reader.readAsDataURL(file);
  $this.removeClass(image,['d-none']);
   $this.renderer.setAttribute(image,'height','100%');
  // $this.renderer.setAttribute(image,'width','200');
  }
  });
    if(standAlone){
      attachEvents(cm);
    }
    return bc;
    }
    attachEvents($cm);
    function attachEvents(cMenu:HTMLAnchorElement):void{
      let row:HTMLDivElement;
      let parent:HTMLDivElement;
    if(bc){
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
    }
    else{
      cm = cMenu;
      bc = cm.closest('.container') as HTMLDivElement;
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
      el = parent.firstElementChild as HTMLElement;
      image = el.children[1].firstElementChild as HTMLImageElement;
      input = el.children[2] as HTMLInputElement;
      placeholder = el.children[0] as HTMLAnchorElement;
    }
 //alignment
    //left
    let left = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(left,$this.renderer.createText('Left'));
    $this.listen(left,'click',()=>{
      $this.addClass(parent,['d-flex','justify-content-start']);
      $this.removeClass(parent,['justify-content-center','justify-content-end']);
    });
    //center
    let center = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(center,$this.renderer.createText('Center'));
     $this.listen(center,'click',()=>{
      $this.addClass(parent,['d-flex','justify-content-center']);
      $this.removeClass(parent,['justify-content-start','justify-content-end']);
    });
    //right
    let right = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(right,$this.renderer.createText('Right'));
      $this.listen(right,'click',()=>{
      $this.addClass(parent,['d-flex','justify-content-end']);
      $this.removeClass(parent,['justify-content-start','justify-content-center']);
    });

    let remove = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(remove,$this.renderer.createText('Delete'));
    $this.listen(remove,'click',()=>{
    $this.deleteBlock(el,row);
    });

    let replace = $this.renderer.createElement('a')as HTMLAnchorElement;
    $this.renderer.appendChild(replace,$this.renderer.createText('Replace'));
    $this.listen(replace,'click',()=>{
      input.click();
    });

    $this.listen(cm,'click',(e)=>{
     if(image.src){
      $this.getContextMenu([left,center,right,replace,remove],e);
      }else{
        $this.getContextMenu([remove],e);
      }
      })//cm click;   
    }//inner()

  }//
  private getRichTextBlock(standAlone:boolean,$cm?:HTMLAnchorElement):HTMLDivElement|void{
    const $this = this;
    let bc:HTMLDivElement;
    let cm:HTMLAnchorElement;
    let el:HTMLElement;
    if(!$cm){
    let r =this.getBlockContainer(standAlone,'main','',['sp-rich-text']);
    bc = r.bc;
    cm=r.cm;
    el=r.el;
    this.addClass(bc,['sp-block']);
    this.renderer.setAttribute(el,'contenteditable','plaintext-only');
    //initial content
      let p = this.renderer.createElement('p');
      this.renderer.appendChild(p,this.renderer.createText(this.initialText));
      this.renderer.appendChild(el,p);
      if(standAlone){
      attachEvents(cm);
    }
    return bc;
    }
    attachEvents($cm);
    function attachEvents(cMenu:HTMLAnchorElement):void{
    let row:HTMLDivElement;
    let parent:HTMLDivElement;
    if(bc){
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
    }
    else{
      cm = cMenu;
      bc = cm.closest('.container') as HTMLDivElement;
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
      el = parent.firstElementChild as HTMLElement;
    }
    let remove = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(remove,$this.renderer.createText('Delete'));
    $this.listen(cm,'click',(e)=>{
    $this.getContextMenu([remove],e);
      $this.listen(remove,'click',()=>{
      $this.deleteBlock(el,row);
    });
	});

    $this.listen(el,'mouseout',()=>{
      const selection = document.getSelection();
      if(selection){
      const selectedText = selection?.toString();
      $this.selectedText = selectedText as string;
      const range = selection?.getRangeAt(0);
      $this.selectionRange = range?.cloneRange() as Range;
      }
      
      });
    }

  }//
  private getFormBlock(standAlone:boolean,$cm?:HTMLAnchorElement):HTMLDivElement|void{
    const $this = this;
    let bc:HTMLDivElement;
    let cm:HTMLAnchorElement;
    let el:HTMLElement;
    let controls:HTMLDivElement;
    let addField:HTMLAnchorElement;
    if(!$cm){
    let r = this.getBlockContainer(standAlone,'form','',['sp-form']);
    bc = r.bc;
    cm=r.cm;
    el=r.el;
    this.addClass(bc,['sp-block']);
    //section for controls
     controls = this.createElement('div',['sp-form-controls']) as  HTMLDivElement;
     this.renderer.appendChild(el,controls);
      //initial field
      this.renderer.appendChild(controls,this.getFormControl());
      //section for message ie textarea
      let div2 = this.createElement('div',[this.blockMargin]);
      this.renderer.appendChild(el,div2);
      let id2 = 'sp-form-message';
      let label2 = this.createElement('label',['form-label'],[]);
      this.renderer.appendChild(label2,this.renderer.createText('Message'));
      let textarea = this.createElement('textarea',['form-control'],[{n:'id',v:id2},{n:'rows',v:'3'}]);
      this.renderer.appendChild(div2,label2);
      this.renderer.appendChild(div2,textarea);

      let submit = this.createElement('a',['btn','sp-form-submit'],[{n:'type',v:'button'}]);
      this.renderer.appendChild(submit,this.renderer.createText('Submit'));
      this.renderer.appendChild(el,submit);

      addField = this.createElement('a',['sp-form-add-field','btn','btn-sm','float-end' ],[{n:'type',v:'button'},{n:'contenteditable',v:'false'}])as HTMLAnchorElement;
      this.renderer.appendChild(addField,this.renderer.createText('+ Add Field'));
      this.renderer.appendChild(el,addField);
      //attach event
      if(standAlone){
      attachEvents(cm);
    }
    return bc;
    }
    attachEvents($cm);
    function attachEvents(cMenu:HTMLAnchorElement):void{
    let row:HTMLDivElement;
      let parent:HTMLDivElement;
    if(bc){
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
    }
    else{
      cm = cMenu;
      bc = cm.closest('.container') as HTMLDivElement;
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
      el = parent.firstElementChild as HTMLElement;
      controls = el.firstChild as HTMLDivElement;
      addField = el.lastElementChild as HTMLAnchorElement;
      
    } 
    let remove = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(remove,$this.renderer.createText('Delete'));
    $this.listen(remove,'click',()=>{
    $this.deleteBlock(el,row);
    });

    $this.listen(addField,'click',()=>{
      $this.renderer.appendChild(controls,$this.getFormControl());
    });
  
    $this.listen(cm,'click',(e)=>{
    $this.getContextMenu([remove],e);
    
    });

    

    }
    
  }//
  private getFormControl($el?:HTMLAnchorElement):HTMLDivElement|void{
  //this method was initially an inner function in the getFormBlock()
      const $this = this;
      if(!$el){
      let row = this.createElement('div',['row']);
      let col1 = this.createElement('div',['col-10']);
      let col2 = this.createElement('div',['col-2']);
      this.renderer.appendChild(row,col1);
      this.renderer.appendChild(row,col2);
      let div = this.createElement('div',['mb-3']);
      let label1 = this.createElement('label',['form-label'],[]);
      let title = this.createElement('span',['sp-form-title'],[]);
      //let title = this.createElement('span',['sp-form-title'],[{n:'contenteditable',v:'plaintext-only'}]);
      this.renderer.appendChild(title,this.renderer.createText('Title'));
      this.renderer.appendChild(label1,title);
      let control = this.createElement('input',['form-control'],[]);
      this.renderer.appendChild(div,label1);
      this.renderer.appendChild(div,control);
      this.renderer.appendChild(col1,div);
      //create a button to remove the form field
      let remove = this.createElement('a',['sp-cm-form-remove-field','btn','btn-danger','btn-sm','float-end' ],[{n:'type',v:'button'}]);
      this.renderer.appendChild(remove,this.renderer.createText('X'));
      this.renderer.appendChild(col2,remove);
      //attach even to delete button
      attachEvents(remove as HTMLAnchorElement);
      return row as HTMLDivElement;
      }
      attachEvents($el);
      function attachEvents(el:HTMLAnchorElement):void{
      $this.listen(el,'click',()=>{
      let controls = el.closest<HTMLDivElement>('div.sp-form-controls');
       let col = el.parentNode;
       let row = col?.parentNode;
       $this.renderer.removeChild(controls,row);
    });
      }
    }//
  private getHeadingBlock(standAlone:boolean,tag:string,text:string,clasz:string[],$cm?:HTMLAnchorElement):HTMLDivElement|void{
    const $this = this;
    let bc:HTMLDivElement;
    let cm:HTMLAnchorElement;
    let el:HTMLElement;
    if(!$cm){
    const r = this.getBlockContainer(standAlone,tag,text,['sp-heading']);
    bc = r.bc;
    cm=r.cm;
    el=r.el;
    this.addClass(bc,['sp-block']);
    this.addClass(el,clasz);
    if(standAlone){
      attachEvents(cm);
    }
    return bc;
    }
    //
    
    attachEvents($cm);
    function attachEvents(cMenu:HTMLAnchorElement):void{
      let row:HTMLDivElement;
      let parent:HTMLDivElement;
    if(bc){
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
    }
    else{
      cm = cMenu;
      bc = cm.closest('.container') as HTMLDivElement;
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
      el = parent.firstElementChild as HTMLElement;
    }
    //small
    let small = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(small,$this.renderer.createText('Small'));
    $this.listen(small,'click',()=>{
      $this.addClass(el,['fs-6']);
      $this.removeClass(el,['fs-1','fs-4']);
    });
    //medium
    let medium = $this.createElement('a')as HTMLAnchorElement;
    $this.renderer.appendChild(medium,$this.renderer.createText('Medium'));
    $this.listen(medium,'click',()=>{
      $this.addClass(el,['fs-4']);
      $this.removeClass(el,['fs-1','fs-6']);
    });
    //large
    let large = $this.createElement('a')as HTMLAnchorElement;
    $this.renderer.appendChild(large,$this.renderer.createText('Large'));
    $this.listen(large,'click',()=>{
      $this.addClass(el,['fs-1']);
      $this.removeClass(el,['fs-4','fs-6']);
    });
    let left = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(left,$this.renderer.createText('Left'));
     //left
    $this.listen(left,'click',()=>{
      $this.addClass(el,['text-start']);
      $this.removeClass(el,['text-center','text-end']);
    });
    //center
    let center = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(center,$this.renderer.createText('Center'));
    $this.listen(center,'click',()=>{
      $this.addClass(el,['text-center']);
      $this.removeClass(el,['text-start','text-end']);
    });
    //right
    let right = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(right,$this.renderer.createText('Right'));
    $this.listen(right,'click',()=>{
      $this.addClass(el,['text-end']);
      $this.removeClass(el,['text-center','text-start']);
    });
    //bgcolor
    let bgColor = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(bgColor,$this.renderer.createText('Background'));
    $this.listen(bgColor,'click',()=>{
    $this.toggleClass(el,'sp-bg-color');
    });
    //delete
    let remove = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(remove,$this.renderer.createText('Delete'));
    $this.listen(remove,'click',()=>{
      $this.deleteBlock(el,row);
    });
    //now
    $this.listen(cm,'click',(e)=>{
    $this.getContextMenu([small,medium,large,left,center,right,bgColor,remove],e);
    });
    }//inner()
  }//
 private getButtonBlock(standAlone:boolean,text:string,clasz:string[],$cm?:HTMLAnchorElement):HTMLDivElement|void{
    const $this = this;
    let bc:HTMLDivElement;
    let cm:HTMLAnchorElement;
    let el:HTMLElement;
    let input:HTMLInputElement;
    if(!$cm){
    let r = this.getBlockContainer(standAlone,'a','',['sp-button']);
    bc = r.bc;
    cm=r.cm;
    el=r.el;
    this.addClass(bc,['sp-block']);//?
    //this.addClass(el,clasz);
    this.addClass(el,['btn','ms-2','d-flex',...clasz]);
    this.renderer.setAttribute(el,'type','button');
    input = this.createElement('input',['px-2','sp-bg-color','focus-ring','border-0'],[{n:'value',v:text},{n:'placeholder',v:'Add Text'}])as HTMLInputElement;
    this.renderer.appendChild(el,input);
    this.listen(input,'mouseleave',()=>{
      this.renderer.setAttribute(input,'value',input.value);
      console.log(input.value);
    });
    //attach context menu
    if(standAlone){
      attachEvents(cm);
    }
    
   return bc;
    }
    attachEvents($cm);
   function attachEvents(cMenu:HTMLAnchorElement):void{
    let row:HTMLDivElement;
    let parent:HTMLDivElement;
    if(bc){
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
    }
    else{
      cm = cMenu;
      bc = cm.closest('.container') as HTMLDivElement;
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
      el = parent.firstElementChild as HTMLElement;
      input = el.firstElementChild as HTMLInputElement;
    }
    $this.addClass(parent,['d-flex']);
      //sizes
      //small
    let small = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(small,$this.renderer.createText('Small'));
    $this.listen(small,'click',()=>{
      $this.addClass(el,['btn-sm']);
      $this.removeClass(el,['btn-md','btn-lg']);
    });
    //medium
    let medium = $this.createElement('a')as HTMLAnchorElement;
    $this.renderer.appendChild(medium,$this.renderer.createText('Medium'));
      $this.listen(medium,'click',()=>{
      $this.addClass(el,['btn-md']);
      $this.removeClass(el,['btn-sm','btn-lg']);
    });
    //large
    let large = $this.createElement('a')as HTMLAnchorElement;
    $this.renderer.appendChild(large,$this.renderer.createText('Large'));
     $this.listen(large,'click',()=>{
      $this.addClass(el,['btn-lg']);
      $this.removeClass(el,['btn-sm','btn-md']);
    });
    //alignment
    //left
    let left = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(left,$this.renderer.createText('Left'));
    $this.listen(left,'click',()=>{
      $this.addClass(parent,['justify-content-start']);
      $this.removeClass(parent,['justify-content-center','justify-content-end']);
    });
    //center
    let center = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(center,$this.renderer.createText('Center'));
     $this.listen(center,'click',()=>{
      $this.addClass(parent,['justify-content-center']);
      $this.removeClass(parent,['justify-content-start','justify-content-end']);
    });
    //right
    let right = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(right,$this.renderer.createText('Right'));
      $this.listen(right,'click',()=>{
      $this.addClass(parent,['justify-content-end']);
      $this.removeClass(parent,['justify-content-start','justify-content-center']);
    });
    //link
    let href =  el.getAttribute('href');
    console.log(el);
    let menuLink = $this.createElement('a')as HTMLAnchorElement;
    $this.renderer.appendChild(menuLink,$this.renderer.createText(href?'UnLink':'Link'));
    let icon = $this.createElement('i');
    $this.addClass(icon,['bi','bi-link']);
    $this.listen(menuLink,'click',()=>{
          if(href){
            el.removeAttribute('href');
            href='';
            if(el.lastElementChild?.classList.contains("bi-link")){
              el.removeChild(el.lastElementChild);
            }
          }else{
        let modalButton = $this.modalButton.nativeElement as HTMLButtonElement;
        let saveLinkButton = $this.saveLinkButton.nativeElement as HTMLButtonElement;
        let linkInputField = $this.linkInputField.nativeElement as HTMLInputElement;
        modalButton.click();
        linkInputField.focus();
        $this.renderer.listen(saveLinkButton,'click',()=>{
        //href = 'http://www.'+linkInputField.value;
        href = linkInputField.value;
        $this.renderer.setAttribute(el,'href',href);
        el.appendChild(icon);
        ($this.closeModalButton.nativeElement).click();
          });
      }
    });//#Link

    //delete
    let remove = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(remove,$this.renderer.createText('Delete'));
    $this.listen(remove,'click',(e)=>{
      $this.deleteBlock(el,row);
    });
    // let duplicate:HTMLAnchorElement;
    // if(el.classList.contains('sp-cover-button')){
    //   duplicate = $this.createElement('a')as HTMLAnchorElement;
    //    $this.renderer.appendChild(duplicate,$this.renderer.createText('Duplicate'));
    //    $this.listen(duplicate,'click',()=>{
    //   let d = row.cloneNode(true);
    //   $this.addClass(bc,['d-flex','justify-content-center']);
    //   //lets remove the context menu, which could have been cloned alone the button
    //   let menu = d.firstChild as HTMLDivElement;
    //   if(menu.classList.contains('small')){
    //     d.removeChild(menu);
    //   }
    //    let dcm = d.firstChild?.firstChild as HTMLAnchorElement;//context menu of duplicate
    //   attachEvents(dcm);
    //   $this.renderer.appendChild(parent,d);
    // });
    // }
    $this.listen(cm,'click',(e)=>{
    menuLink.removeChild(menuLink.firstChild as Node);
    $this.renderer.appendChild(menuLink,$this.renderer.createText(href?'UnLink':'Link'));
    $this.getContextMenu([small,medium,large,left,center,right,menuLink,remove],e);
    });

   }//inner()
}//
  //########### COMPONENTS ##########
  private getCoverComponent($cm?:HTMLAnchorElement):HTMLDivElement|void{
    const $this = this;
    let bc:HTMLDivElement;
    let cm:HTMLAnchorElement;
    let el:HTMLElement;
    let buttonSection:HTMLDivElement;
    if(!$cm){
    let r = this.getBlockContainer(true,'main','',['sp-cover']);
    bc = r.bc;
    cm=r.cm;
    el=r.el;
    this.addClass(bc,['sp-component']);
    this.addClass(el,['px-3']);
    this.renderer.setAttribute(el,'sp-block','sp-cover');
    // let p = this.createElement('p',['display-6']);
    // this.renderer.appendChild(p,this.renderer.createText('Welcome to Godly Sensation'));
    this.renderer.appendChild(el,this.getHeadingBlock(false,'h2','Enter Heading',['fs-2']));
    this.renderer.appendChild(el,this.getRichTextBlock(false));
    buttonSection = this.createElement('div',['d-flex','justify-content-center']) as HTMLDivElement;
    this.renderer.appendChild(el,buttonSection);
    this.renderer.appendChild(buttonSection,this.getButtonBlock(true,'Learn More',['sp-cover-button']));
    attachEvents(cm);
    return bc;
    }
    attachEvents($cm);
    function attachEvents(cMenu:HTMLAnchorElement):void{
    let row:HTMLDivElement;
    let parent:HTMLDivElement;
    if(bc){
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
    }
    else{
      cm = cMenu;
      bc = cm.closest('.container') as HTMLDivElement;
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
      el = parent.firstElementChild as HTMLElement;
      buttonSection = el.lastElementChild as HTMLDivElement;
    }

    let remove = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(remove,$this.renderer.createText('Delete'));
     $this.listen(remove,'click',()=>{
      $this.deleteComponent(el,row);
    });

    let bgColor = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(bgColor,$this.renderer.createText('Background'));
      $this.listen(bgColor,'click',()=>{
        $this.toggleClass(el,'sp-bg-color');
    });

    let addButton = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(addButton,$this.renderer.createText('Add Button'));
      $this.listen(addButton,'click',()=>{
        $this.renderer.appendChild(buttonSection,$this.getButtonBlock(true,'Learn More',[]));
    });
    $this.listen(cm,'click',(e)=>{
    $this.getContextMenu([remove,bgColor,addButton],e);
    });//inner()
    }
  }//

  private getCardComponent($cm?:HTMLAnchorElement):HTMLDivElement|void{
    const $this = this;
    let bc:HTMLDivElement;
    let cm:HTMLAnchorElement;
    let el:HTMLElement;
    if(!$cm){
    let r = this.getBlockContainer(true,'div','',['sp-card']);
    bc = r.bc;
    cm=r.cm;
    el=r.el;
    this.addClass(bc,['sp-component']);
    let card = this.renderer.createElement('div');
    this.addClass(card,['card']);
    this.renderer.setStyle(card,'width','18rem');
    //now append to block container
    this.renderer.appendChild(el,card);
    this.renderer.appendChild(card,this.getImageBlock(false,['img-thumbnail']));
    //
    let cardBody = this.renderer.createElement('div');
    this.addClass(card,['card-body']);
    //now append to card
    this.renderer.appendChild(card,cardBody);
    // let p = this.createElement('p',['display-6']);
    // this.renderer.appendChild(p,this.renderer.createText('Welcome to Godly Sensation'))
    this.renderer.appendChild(cardBody,this.getHeadingBlock(false,'h3','Enter Heading',['fs-4']));
 
    this.renderer.appendChild(cardBody,this.getRichTextBlock(false));
    this.renderer.appendChild(cardBody,this.getButtonBlock(true,'Learn More',[]));
    attachEvents(cm);
    return bc;
    }
    attachEvents($cm);
    function attachEvents(cMenu:HTMLAnchorElement):void{
    let row:HTMLDivElement;
    let parent:HTMLDivElement;
    if(bc){
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
    }
    else{
      cm = cMenu;
      bc = cm.closest('.container') as HTMLDivElement;
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
      el = parent.firstElementChild as HTMLElement;
    }
    let remove = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(remove,$this.renderer.createText('Delete'));
    $this.listen(remove,'click',()=>{
      $this.deleteComponent(el,row);
    });
    $this.renderer.listen(cm,'click',(e)=>{
    $this.getContextMenu([remove],e);
    });
    }
    
  }//
   private getCtaComponent($cm?:HTMLAnchorElement):HTMLDivElement|void{
    const $this = this;
    let bc:HTMLDivElement;
    let cm:HTMLAnchorElement;
    let el:HTMLElement;
    if(!$cm){
    let r = this.getBlockContainer(true,'main','',['sp-cta']);
    bc = r.bc;
    cm=r.cm;
    el=r.el;
    this.addClass(bc,['sp-component']);

    this.addClass(el,['row']);
    //now append to block container
    let col1 = this.createElement('div',['col-8']);
    let col2 = this.createElement('div',['col-4','d-flex','align-items-center']);
    //let col2 = this.createElement('div',['col-4','d-flex','align-items-center','h-100']);
    //this.renderer.setStyle(col2,'min-height','200px');
    //now append to row
    this.renderer.appendChild(el,col1);
    this.renderer.appendChild(el,col2);
    //append block to col1
    // let p = this.createElement('p',['display-6']);
    // this.renderer.appendChild(p,this.renderer.createText('Welcome to Godly Sensation'))
    this.renderer.appendChild(col1,this.getHeadingBlock(false,'h3','Enter Heading',['fs-4']));
    this.renderer.appendChild(col1,this.getRichTextBlock(false));
    //append block to col2
    this.renderer.appendChild(col2,this.getButtonBlock(true,'Learn More',[]));
    attachEvents(cm);
    return bc;
    }
    attachEvents($cm);
    function attachEvents(cMenu:HTMLAnchorElement):void{
      let row:HTMLDivElement;
      let parent:HTMLDivElement;
    if(bc){
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
    }
    else{
      cm = cMenu;
      bc = cm.closest('.container') as HTMLDivElement;
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
      el = parent.firstElementChild as HTMLElement;
    }
    let remove = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(remove,$this.renderer.createText('Delete'));
    $this.listen(remove,'click',()=>{
    $this.deleteComponent(el,row);
    });
      $this.listen(cm,'click',(e)=>{
    $this.getContextMenu([remove],e);
    });
    }
  }//
  private getFaqComponent($cm?:HTMLAnchorElement):HTMLDivElement|void{
    const $this = this;
    let bc:HTMLDivElement;
    let cm:HTMLAnchorElement;
    let el:HTMLElement;
    let questionAndAnswerSection:HTMLDivElement;
    let footer:HTMLDivElement;
    let addFaq:HTMLAnchorElement;
    if(!$cm){
    let r = this.getBlockContainer(true,'main','',['sp-faq']);
    bc = r.bc;
    cm=r.cm;
    el=r.el;
    this.addClass(bc,['sp-component']);
    //this.addClass(el,['container']);
    //this.addClass(el,['container']);
    let faqTitle = this.createElement('p',['display-6']);
    this.renderer.appendChild(faqTitle,this.renderer.createText('FAQ TITLE'));
    this.renderer.appendChild(el,faqTitle);
    //create question and answer container
    questionAndAnswerSection = this.createElement('div',['row'])as HTMLDivElement;
    //now append to main
    this.renderer.appendChild(el,questionAndAnswerSection);
    //append question to question and answer
    let faqQuestion = this.createElement('p',[]);
    this.renderer.appendChild(faqQuestion,this.renderer.createText('FAQ - What is Love?'));
    this.renderer.appendChild(questionAndAnswerSection,faqQuestion);
    //this.renderer.appendChild(questionAndAnswer,this.getHeadingBlock('h4','FAQ - What is Love?',[]));
    //append answer to question and answer
    this.renderer.appendChild(questionAndAnswerSection,this.getRichTextBlock(false));
    //create footer with button to enable ading more faq
    footer = this.createElement('div',['container'])as HTMLDivElement;
    //now append to block container
    this.renderer.appendChild(el,footer);
    //add button 
    addFaq = this.createElement('a',['sp-faq-button'],[{n:'type',v:'button'},{n:'contenteditable',v:'false'}])as HTMLAnchorElement;
    this.renderer.appendChild(addFaq,this.renderer.createText('Add FAQ'));
    //now append to footer
    this.renderer.appendChild(footer,addFaq);
    //attach event 
    attachEvents(cm);
    return bc;
    }
    attachEvents($cm);
    function attachEvents(cMenu:HTMLAnchorElement):void{
    let row:HTMLDivElement;
      let parent:HTMLDivElement;
    if(bc){
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
    }
    else{
      cm = cMenu;
      bc = cm.closest('.container') as HTMLDivElement;
      row = bc.firstElementChild as HTMLDivElement;
      parent = row.children[1] as HTMLDivElement;
      el = parent.firstElementChild as HTMLElement;
      footer = el.children[2]as HTMLDivElement;
      addFaq = footer.firstElementChild as HTMLAnchorElement;
      questionAndAnswerSection  = el.children[1]as HTMLDivElement;
    }
    let remove = $this.createElement('a') as HTMLAnchorElement;
    $this.renderer.appendChild(remove,$this.renderer.createText('Delete'));
    $this.listen(remove,'click',()=>{
      $this.deleteComponent(el,row);
    });

    $this.listen(cm,'click',(e)=>{
    $this.getContextMenu([remove],e);
    });
    //others
    $this.listen(addFaq,'click',()=>{
      let questionAndAnswer = $this.renderer.createElement('div');
      $this.renderer.addClass(questionAndAnswer,'container');
      $this.renderer.appendChild(questionAndAnswerSection,questionAndAnswer);
      let faqQuestion = $this.createElement('p',[]);
    $this.renderer.appendChild(faqQuestion,$this.renderer.createText('FAQ - What is Love?'));
      $this.renderer.appendChild(questionAndAnswer,faqQuestion);
      $this.renderer.appendChild(questionAndAnswer,$this.getRichTextBlock(false));
    });
    }
  }
  //######## EVENTS ############
  private attachEvents():void{
    //blocks
    const cmRichTexts = this.ne.querySelectorAll('a.sp-cm-sp-rich-text');
     for(let cm of cmRichTexts ){
      this.getRichTextBlock(true,cm as HTMLAnchorElement);
    }
    const cmButtons = this.ne.querySelectorAll('a.sp-cm-sp-button');
    for(let cm of cmButtons){
      this.getButtonBlock(true,'',[],cm as HTMLAnchorElement);
    }
    const cmHeadings = this.ne.querySelectorAll('a.sp-cm-sp-heading');
    for(let cm of cmHeadings){
      this.getHeadingBlock(true,'','',[],cm as HTMLAnchorElement);
    }
    const cmImages = this.ne.querySelectorAll('a.sp-cm-sp-image');
    for(let cm of cmImages){
      this.getImageBlock(true,[],cm as HTMLAnchorElement);
    }
    const cmForms = this.ne.querySelectorAll('a.sp-cm-sp-form');
    for(let cm of cmForms){
  this.getFormBlock(true,cm as HTMLAnchorElement);
}
    const formRemoveButtons = this.ne.querySelectorAll('a.sp-cm-form-remove-field');
    for(let button of formRemoveButtons){
  this.getFormControl(button as HTMLAnchorElement);
}
    //components
    const cmCovers = this.ne.querySelectorAll('a.sp-cm-sp-cover');
    for(let cm of cmCovers ){
  this.getCoverComponent(cm as HTMLAnchorElement);
}
const cmCards = this.ne.querySelectorAll('a.sp-cm-sp-card');
    for(let cm of cmCards ){
  this.getCardComponent(cm as HTMLAnchorElement);
}
const cmCtas = this.ne.querySelectorAll('a.sp-cm-sp-cta');
    for(let cm of cmCtas ){
  this.getCtaComponent(cm as HTMLAnchorElement);
    }
 const cmFaqs = this.ne.querySelectorAll('a.sp-cm-sp-faq');
    for(let cm of cmFaqs){
      this.getFaqComponent(cm as HTMLAnchorElement);
    }
    //dropdowns dropdown-item
    const dropDownItems = this.ne.querySelectorAll('a.dropdown-item');
    for(let dropDownItem of dropDownItems){
     this.listen(dropDownItem as HTMLAnchorElement,'click',()=>{
        this.attachEventsBlockMenu(dropDownItem as HTMLAnchorElement);
      });
      
    }

   
  }//
   private attachEventsBlockMenu(dropDownItem:HTMLAnchorElement):void{
      let dropDown = dropDownItem.closest('div.sp-dropdown') as HTMLDivElement;
      let testContext = dropDownItem.textContent;
      let col = dropDown.parentNode as HTMLDivElement;
         switch(testContext){
          case 'Button':
      col.replaceChild(this.getButtonBlock(true,'Learn More',[])as HTMLDivElement,dropDown);
            break;
          case 'Heading':
      col.replaceChild(this.getHeadingBlock(true,'h3','Enter Heading',[])as HTMLDivElement,dropDown);
            break;
          case 'Image':
            col.replaceChild(this.getImageBlock(true,[])as HTMLDivElement,dropDown);
            break;
          case 'Rich Text':
            col.replaceChild(this.getRichTextBlock(true)as HTMLDivElement,dropDown);
            break;
          case 'Form':
            col.replaceChild(this.getFormBlock(true)as HTMLDivElement,dropDown);
            break;
            //## Components
          case 'Cover':
            col.replaceChild(this.getCoverComponent()as HTMLDivElement,dropDown);
            break;
          case 'Card':
            col.replaceChild(this.getCardComponent()as HTMLDivElement,dropDown);
            break;
          case 'Call To Action':
            col.replaceChild(this.getCtaComponent()as HTMLDivElement,dropDown);
            break;
          case 'FAQ':
            col.replaceChild(this.getFaqComponent()as HTMLDivElement,dropDown);
            break;
         }//#switch
      let d = dropDown;
      let toggleButton = d.firstChild as HTMLButtonElement;//toggleButton
      //this.renderer.addClass(toggleButton,'btn-sm');
      this.removeClass(toggleButton,['btn']);
      this.addClass(toggleButton,['text-decoration-none']);
      toggleButton.replaceChild(this.renderer.createText('+'),toggleButton.firstChild as Node);
      col.appendChild(d);
  }
formatText(format:string):void{
    let selectedText = this.selectedText;
    if(!selectedText){
      return;
    }
    let range = this.selectionRange;
    let parentNode:Node= range.commonAncestorContainer as Node;
      if (parentNode?.nodeType === Node.TEXT_NODE) {
             parentNode = parentNode.parentNode as Node; // Get the parent element of the text node
        }
      let parent = parentNode?.parentNode as Node;
    switch(format){
      case 'B': let isBold = parentNode?.nodeName === 'STRONG';
      if(isBold){
        parent.replaceChild(this.renderer.createText(selectedText as string),parentNode);
      }else{
        let strong = this.renderer.createElement('strong');
        this.renderer.appendChild(strong,this.renderer.createText(selectedText as string));
        range?.deleteContents();
        range?.insertNode(strong);
      }
        break;
      case 'I':let isItalic = parentNode?.nodeName === 'EM';
      if(isItalic){
        parent.replaceChild(this.renderer.createText(selectedText as string),parentNode);
      }else{
        let em = this.renderer.createElement('em');
        this.renderer.appendChild(em,this.renderer.createText(selectedText as string));
        range?.deleteContents();
        range?.insertNode(em);
      }
        break;
      case 'U':let isUnderline = parentNode?.nodeName === 'U';
      if(isUnderline){
        parent.replaceChild(this.renderer.createText(selectedText as string),parentNode);
      }else{
        let u = this.renderer.createElement('u');
        this.renderer.appendChild(u,this.renderer.createText(selectedText as string));
        range?.deleteContents();
        range?.insertNode(u);
      }
        break;
      case 'L':let isLink = parentNode?.nodeName === 'A';
        if(isLink){
            let text = parentNode.textContent as string;
            parent.replaceChild(this.renderer.createText(text),parentNode);
        }else{
        let modalButton = this.modalButton.nativeElement as HTMLButtonElement;
        let saveLinkButton = this.saveLinkButton.nativeElement as HTMLButtonElement;
        let linkInputField = this.linkInputField.nativeElement as HTMLInputElement;
        modalButton.click();
        linkInputField.focus();
        let unlisten = this.renderer.listen(saveLinkButton,'click',()=>{
        let a = this.renderer.createElement('a');
        this.renderer.setAttribute(a,'href','http://'+linkInputField.value);
        (this.closeModalButton.nativeElement).click();
        this.renderer.appendChild(a,this.renderer.createText(selectedText as string));
        range?.deleteContents();
        range?.insertNode(a);
      });
  }
  break;
}
  }//
 

// ######### MENU ##########
  private getContextMenu(items:HTMLAnchorElement[],e:PointerEvent){
    e.preventDefault();
    if(this.contextMenuContainer.innerHTML){
      this.contextMenuContainer.innerHTML = '';
    }
    //hide menu initially
    let menuContainer = this.createElement('div',['list-group','list-group-horizontal','d-none']);
    this.contextMenuContainer.prepend(menuContainer);
    //let cm = e.target as HTMLAnchorElement;
    //let wrapper = cm.closest('.sp-wrapper') as HTMLDivElement;
    //wrapper.before(this.contextMenuContainer);
    document.body.appendChild(this.contextMenuContainer);
     //now position menu 
    let top:string = `${e.clientY - 70}px`;
    let left:string = `${e.clientX - 20}px`;
    this.renderer.setStyle(this.contextMenuContainer,'top',top);
    this.renderer.setStyle(this.contextMenuContainer,'left',left);
    //this.ne.insertBefore(this.contextMenuContainer,wrapper);

    for(let item of items){
      this.addClass(item,['list-group-item','list-group-item-action']);
      this.renderer.appendChild(menuContainer,item);
    }

    this.removeClass(menuContainer,['d-none']);

    this.renderer.listen(this.contextMenuContainer,'mouseleave',()=>{
      this.renderer.removeChild(this.contextMenuContainer,menuContainer);
      document.body.removeChild(this.contextMenuContainer);
    });

    setTimeout(() => this.renderer.removeChild(this.contextMenuContainer,menuContainer), 10000);

    // this.renderer.listen(document,'click',()=>{
    //   this.renderer.removeChild(this.contextMenuContainer,menuContainer);
    // });
    //let menuContainer = this.createElement('div',['list-group','position-absolute','d-none']);
    //then append to page builder
    //created on the view to temporarily hold the menu absolute positioning later
    
    
    

    //now position menu 
    // let top:string = `${e.clientY - 20}px`;
    // let left:string = `${e.clientX - 20}px`;
    
    // let top:string = `${e.clientY}px`;
    // let left:string = `${e.screenX}px`;
    // console.log("top "+top);
    // console.log("left "+left);
    // this.renderer.setStyle(this.contextMenuContainer,'top',top);
    // this.renderer.setStyle(this.contextMenuContainer,'left',left);
    // menuContainer.style.top = top;
    // menuContainer.style.left = left;
    // this.contextMenuContainer.style.top = top;
    // this.contextMenuContainer.style.left = left;
    
  }//
  private getBlockMenu():HTMLDivElement{
    //called within each column of the initially added row
    let dropDown = this.createElement('div',['dropdown','sp-dropdown','w-25'])as HTMLDivElement;
    let toggleButton = this.createElement('a',['btn','dropdown-toggle','d-block'],[{n:'type',v:'button'},{n:'contenteditable',v:'false'},{n:'data-bs-toggle',v:'dropdown'},{n:'aria-expanded',v:'false'}]);
    this.renderer.appendChild(toggleButton,this.renderer.createText("Add"));
    let dropDownMenu = this.createElement('ul',['dropdown-menu']);
    //now create each button and attach event
    //button
    let li1 = this.createElement('li');
    let button = this.createElement('a',['dropdown-item']) as HTMLAnchorElement;
    this.renderer.appendChild(button,this.renderer.createText("Button"));
    this.renderer.appendChild(li1,button);
     //attach click event
    this.renderer.listen(button,'click',()=>{
      this.attachEventsBlockMenu(button);
    });//#listen

    //heading
    let li2 = this.renderer.createElement('li');
    let heading = this.createElement('a',['dropdown-item']) as HTMLAnchorElement;
    this.renderer.appendChild(heading,this.renderer.createText("Heading"));
    this.renderer.appendChild(li2,heading);
    //attach click event
    this.renderer.listen(heading,'click',()=>{
      this.attachEventsBlockMenu(heading);
    });//#listen

    //image
    let li3 = this.renderer.createElement('li');
    let image = this.createElement('a',['dropdown-item']) as HTMLAnchorElement;
    this.renderer.appendChild(image,this.renderer.createText("Image"));
    this.renderer.appendChild(li3,image);
    //attach click event
    this.renderer.listen(image,'click',()=>{
      this.attachEventsBlockMenu(image);
    });//#listen


    //rich text
    let li4 = this.renderer.createElement('li');
    let richText = this.createElement('a',['dropdown-item']) as HTMLAnchorElement;
    this.renderer.appendChild(richText,this.renderer.createText("Rich Text"));
    this.renderer.appendChild(li4,richText);
     //attach click event
    this.renderer.listen(richText,'click',(e)=>{
      this.attachEventsBlockMenu(richText);
    });//#listen

    //rich text
    let li5 = this.renderer.createElement('li');
    let form = this.createElement('a',['dropdown-item']) as HTMLAnchorElement;
    this.renderer.appendChild(form,this.renderer.createText("Form"));
    this.renderer.appendChild(li5,form);
     //attach click event
    this.renderer.listen(form,'click',()=>{
      this.attachEventsBlockMenu(form);
    });//#listen

    //############# COMPONENTS BUTTONS ########
    //add a divider to menu
    let divider = this.renderer.createElement('li');
    let hr = this.createElement('hr',['dropdown-divider']);
    this.renderer.appendChild(divider,hr);
     //start section with 11
    //Cover
    let li11 = this.renderer.createElement('li');
    let cover = this.createElement('a',['dropdown-item']) as HTMLAnchorElement;
    this.renderer.appendChild(cover,this.renderer.createText("Cover"));
    this.renderer.appendChild(li11,cover);
     //attach click event
    this.renderer.listen(cover,'click',(e)=>{
      this.attachEventsBlockMenu(cover);
    });//#listen
    //Card
    let li12 = this.renderer.createElement('li');
    let card = this.createElement('a',['dropdown-item']) as HTMLAnchorElement;
    this.renderer.appendChild(card,this.renderer.createText("Card"));
    this.renderer.appendChild(li12,card);
     //attach click event
    this.renderer.listen(card,'click',()=>{
      this.attachEventsBlockMenu(card);
    });//#listen
    //Cta
    let li13 = this.renderer.createElement('li');
    let cta = this.createElement('a',['dropdown-item']) as HTMLAnchorElement;
    this.renderer.appendChild(cta,this.renderer.createText("Call To Action"));
    this.renderer.appendChild(li13,cta);
     //attach click event
    this.renderer.listen(cta,'click',()=>{
      this.attachEventsBlockMenu(cta);
    });//#listen
    //Faq
    let li14 = this.renderer.createElement('li');
    let faq = this.createElement('a',['dropdown-item']) as HTMLAnchorElement;
    this.renderer.appendChild(faq,this.renderer.createText("FAQ"));
    this.renderer.appendChild(li14,faq);
     //attach click event
    this.renderer.listen(faq,'click',()=>{
      this.attachEventsBlockMenu(faq);
    });//#listen

    //now append all li to ul
    this.renderer.appendChild(dropDownMenu,li1);
    this.renderer.appendChild(dropDownMenu,li2);
    this.renderer.appendChild(dropDownMenu,li3);
    this.renderer.appendChild(dropDownMenu,li4);
    this.renderer.appendChild(dropDownMenu,li5);
    this.renderer.appendChild(dropDownMenu,divider);
    this.renderer.appendChild(dropDownMenu,li11);
    this.renderer.appendChild(dropDownMenu,li12);
    this.renderer.appendChild(dropDownMenu,li13);
    this.renderer.appendChild(dropDownMenu,li14);

    //now append to dropdown
    this.renderer.appendChild(dropDown,toggleButton);
    this.renderer.appendChild(dropDown,dropDownMenu);

    return dropDown;

  }//
  private moveBlock(el:HTMLElement,move:string):void{
    let parent = this.renderer.parentNode(el);
    if(move=='up'){
      let previousSibling = el.previousElementSibling;
      this.renderer.insertBefore(parent,el,previousSibling);
    }else{
      //moving down
      let nextSibling = this.renderer.nextSibling(el);
      this.renderer.insertBefore(parent,nextSibling,el);
    }
  }//
  private deleteBlock(el:HTMLElement,row:HTMLElement):void{
    let bc = el.closest('div.sp-block');
    if(el.closest('div.sp-component')){
        let add = this.createElement('a',['btn']);
        this.renderer.setStyle(add,'cursor','pointer');
        this.renderer.appendChild(add,this.renderer.createText('+'));
        bc?.replaceChild(add,row);
        this.renderer.listen(add,'click',()=>{
        bc?.replaceChild(row,add);
        });
    }else{
      bc?.replaceChild(this.getBlockMenu(),row);
    let m = bc?.nextElementSibling;
    if(m && m.classList.contains('sp-dropdown')){
      this.renderer.removeChild(bc?.parentElement,m);
    }
    }
  }//
  private deleteComponent(el:HTMLElement,row:HTMLElement){
      let bc = el.closest('div.sp-component');
      bc?.replaceChild(this.getBlockMenu(),row);
    let m = bc?.nextElementSibling;
    if(m && m.classList.contains('sp-dropdown')){
      this.renderer.removeChild(bc?.parentElement,m);
    }
    }//

  private createElement(element:string,clasz?:string[],attr?:{n:string,v:string}[]):HTMLElement{
    let el = this.renderer.createElement(element);
    if(clasz){
      for(let c of clasz){
        this.renderer.addClass(el,c);
      }
    }
    if(attr){
      for(let a of attr){
        this.renderer.setAttribute(el,a.n,a.v);
      }
    }
    return el;
  }//
  private createColumn(n:number):HTMLDivElement{
    const container = this.renderer.createElement('div');
    this.renderer.addClass(container,'container');
    
    if(n==1){
      const row = this.renderer.createElement('div');
    this.renderer.addClass(row,'row');
    this.renderer.appendChild(container,row);//
      const col1 = this.renderer.createElement('div');
      this.renderer.addClass(col1,'col-12');
      this.renderer.addClass(col1,'sp-col');
      this.renderer.appendChild(row,col1);
      //append the blockMenu to enable block section
      this.renderer.appendChild(col1,this.getBlockMenu());
    }else if(n==2){
      const row = this.renderer.createElement('div');
    this.renderer.addClass(row,'row');
    this.renderer.appendChild(container,row);//
      const col1 = this.renderer.createElement('div');
      const col2 = this.renderer.createElement('div');
      this.renderer.addClass(col1,'col-6');
      this.renderer.addClass(col2,'col-6');
      this.renderer.addClass(col1,'sp-col');
      this.renderer.addClass(col2,'sp-col');

      this.renderer.appendChild(row,col1);
      this.renderer.appendChild(row,col2);
      this.renderer.appendChild(col1,this.getBlockMenu());
      this.renderer.appendChild(col2,this.getBlockMenu());
    }
    else if(n==3){
      const row = this.renderer.createElement('div');
    this.renderer.addClass(row,'row');
    this.renderer.appendChild(container,row);//
      const col1 = this.renderer.createElement('div');
      const col2 = this.renderer.createElement('div');
      const col3 = this.renderer.createElement('div');
      this.renderer.addClass(col1,'col-4');
      this.renderer.addClass(col2,'col-4');
      this.renderer.addClass(col3,'col-4');
      this.renderer.addClass(col1,'sp-col');
      this.renderer.addClass(col2,'sp-col');
      this.renderer.addClass(col3,'sp-col');

      this.renderer.appendChild(row,col1);
      this.renderer.appendChild(row,col2);
      this.renderer.appendChild(row,col3);

      this.renderer.appendChild(col1,this.getBlockMenu());
      this.renderer.appendChild(col2,this.getBlockMenu());
      this.renderer.appendChild(col3,this.getBlockMenu());


    }else if(n==4){
      const row = this.renderer.createElement('div');
    this.renderer.addClass(row,'row');
    this.renderer.appendChild(container,row);//
      const col1 = this.renderer.createElement('div');
      const col2 = this.renderer.createElement('div');
      this.renderer.addClass(col1,'col-4');
      this.renderer.addClass(col2,'col-8');
      this.renderer.addClass(col1,'sp-col');
      this.renderer.addClass(col2,'sp-col');


      this.renderer.appendChild(row,col1);
      this.renderer.appendChild(row,col2);
      this.renderer.appendChild(col1,this.getBlockMenu());
      this.renderer.appendChild(col2,this.getBlockMenu());
    }
    else if(n==5){
      const row = this.renderer.createElement('div');
      this.renderer.addClass(row,'row');
      this.renderer.appendChild(container,row);//
      const col1 = this.renderer.createElement('div');
      const col2 = this.renderer.createElement('div');
      this.renderer.addClass(col1,'col-8');
      this.renderer.addClass(col2,'col-4');
      this.renderer.addClass(col1,'sp-col');
      this.renderer.addClass(col2,'sp-col');

      this.renderer.appendChild(row,col1);
      this.renderer.appendChild(row,col2);
      this.renderer.appendChild(col1,this.getBlockMenu());
      this.renderer.appendChild(col2,this.getBlockMenu());
      //this.renderer.appendChild(col2,this.blockMenu.nativeElement.cloneNode(true)as HTMLElement);
    }else{}
    return container;

  }
  addRow(init:boolean):void|HTMLDivElement{
    const wrapper = this.createElement('div',['row','sp-wrapper',this.blockMargin]) as HTMLDivElement;
    //for element to create
    const blockContainer = this.createElement('div',['col-11','sp-block-container'],[{n:'contenteditable',v:'plaintext-only'}]);
    if(init==false){
      //to hold initial col seclection
      let buttonGroup = this.createElement('div',['row','sp-button-group-placeholder']);
        let b1 = this.createElement('button',['col','d-flex','justify-content-center']);
        //let b1Icon = this.createElement('i',['bi','bi-square']);
        //this.setStyle(b1Icon,[{n:'',v:''}]);
        //this.setStyle(b1,[{n:'width',v:'500px'}]);
        this.renderer.appendChild(b1,this.createElement('div',['w-100','h-75','align-self-center','sp-border-dashed']));
        let b2 = this.createElement('button',['col','d-flex','justify-content-center']);
        this.renderer.appendChild(b2,this.createElement('div',['w-50','h-75','align-self-center','sp-border-dashed']));
        this.renderer.appendChild(b2,this.createElement('div',['w-50','h-75','sp-border-dashed']));
        let b3 = this.createElement('button',['col']);
        this.renderer.appendChild(b3,this.createElement('i',['bi','bi-square']));
        this.renderer.appendChild(b3,this.createElement('i',['bi','bi-square']));
        this.renderer.appendChild(b3,this.createElement('i',['bi','bi-square']));
        let b4 = this.createElement('button',['col']);
        this.renderer.appendChild(b4,this.createElement('i',['bi','bi-square']));
        this.renderer.appendChild(b4,this.createElement('i',['bi','bi-square']));
        let b5 = this.createElement('button',['col']);
        this.renderer.appendChild(b5,this.createElement('i',['bi','bi-square']));
        this.renderer.appendChild(b5,this.createElement('i',['bi','bi-square']));

        // this.renderer.appendChild(b1,this.renderer.createText("+ 100%"));
        // this.renderer.appendChild(b2,this.renderer.createText("++ 50 50"));
        // this.renderer.appendChild(b3,this.renderer.createText("+++ 4/4/4"));
        // this.renderer.appendChild(b4,this.renderer.createText("++ 4/8"));
        // this.renderer.appendChild(b5,this.renderer.createText("++ 8/4"));

        this.renderer.appendChild(buttonGroup,b1);
        this.renderer.appendChild(buttonGroup,b2);
        this.renderer.appendChild(buttonGroup,b3);
        this.renderer.appendChild(buttonGroup,b4);
        this.renderer.appendChild(buttonGroup,b5);

        this.renderer.appendChild(blockContainer,buttonGroup);

        this.listen(b1,'click',()=>{
          blockContainer.replaceChild(this.createColumn(1),buttonGroup);
        });

         this.listen(b2,'click',()=>{
          blockContainer.replaceChild(this.createColumn(2),buttonGroup);
        });

         this.listen(b3,'click',()=>{
          blockContainer.replaceChild(this.createColumn(3),buttonGroup);
        });

        this.listen(b4,'click',()=>{
          blockContainer.replaceChild(this.createColumn(4),buttonGroup);
        });

        this.listen(b5,'click',()=>{
          blockContainer.replaceChild(this.createColumn(5),buttonGroup);
        });
    }
        //######### section to delete and move block #########
    const handle = this.createElement('div',['col-1','sp-block-container-handle','btn-group-vertical']);
    //delete button
    const remove= this.createElement('button');
    this.renderer.appendChild(remove,this.createElement('i',['bi','bi-x-square']));
    //this.renderer.appendChild(remove,this.createElement('i',['bi','bi-x-square']));
    //up button
    const moveUp= this.createElement('button');
    this.renderer.appendChild(moveUp,this.createElement('i',['bi','bi-arrow-up-square']));
    //this.renderer.appendChild(moveUp,this.createElement('i',['bi','bi-arrow-up-square']));
    //down button
    const moveDown= this.createElement('button');
    this.renderer.appendChild(moveDown,this.createElement('i',['bi','bi-arrow-down-square']));
    //this.renderer.appendChild(moveDown,this.createElement('i',['bi','bi-arrow-down-square']));
    //now append to handle
    this.renderer.appendChild(handle,remove);
    this.renderer.appendChild(handle,moveUp);
    this.renderer.appendChild(handle,moveDown);
    //append to wrapper
    this.renderer.appendChild(wrapper,blockContainer);
    this.renderer.appendChild(wrapper,handle);
    //############
    this.renderer.appendChild(this.ne,wrapper);

    //attach event to remove or move block
    this.listen(remove,'click',()=>{
      this.renderer.removeChild(this.renderer.parentNode(wrapper),wrapper);   
    });

    this.listen(moveUp,'click',()=>{
      this.moveBlock(wrapper,'up');
    });

    this.listen(moveDown,'click',()=>{
      this.moveBlock(wrapper,'down');
    });
    if(init){
      return wrapper;
    }
  }//

  private initilizePageBuilder(){
    this.ne.innerHTML='';
    this.pageTitle = this.initTitle as string;
    let tempDiv = this.renderer.createElement('div');
    tempDiv.innerHTML = this.initMessage as string;
    let containers= tempDiv.firstChild.children;
    for(let c of containers){
      let wrapper = this.addRow(true) as HTMLDivElement;
      this.renderer.appendChild(wrapper.firstElementChild,c.cloneNode(true));
      this.ne.appendChild(wrapper);
    }
    

  }//

  save(publish:boolean):void{
    //validate form 
    if(!this.pageTitle){
      this.formMessage = "Title Required";
      return;
    }
    let tempDiv = this.renderer.createElement('div');
    let wrappers = this.ne.children;
    for(let wrapper of wrappers){
      //check and skip appended context menu
      if(wrapper.classList.contains('small')){
        continue;
      }
      let blockContainer = wrapper.firstElementChild as HTMLDivElement;//
      //remove rows without selected column
       if (blockContainer.firstElementChild?.classList.contains('sp-button-group-placeholder')){
        continue;
      }
      this.renderer.appendChild(tempDiv,blockContainer.firstElementChild?.cloneNode(true));
    }
    let serial = tempDiv.outerHTML;
    this.pageMessage.emit({title:this.pageTitle,message:serial,publish:publish});
  }//
 //####### UTILS
  private addClass(el:HTMLElement,clasz:string[]):void{
    for(let c of clasz){
     this.renderer.addClass(el,c);
    }
  }//
  private removeClass(el:HTMLElement,clasz:string[]):void{
    for(let c of clasz){
    this.renderer.removeClass(el,c);
    }
  }//
  private toggleClass(el:HTMLElement,clasz:string):void{
    if(el.classList.contains(clasz)){
      this.renderer.removeClass(el,clasz);
    }else{
      this.renderer.addClass(el,clasz);
    }
  }
  private addAttribute(el:HTMLElement,attr:{n:string,v:string}[]):void{
    for(let a of attr){
      this.renderer.setAttribute(a,a.n,a.v);
    }
  }//
  private removeAttribute(el:HTMLElement,attr:{n:string,v:string}[]):void{
    for(let a of attr){
      this.renderer.removeAttribute(a,a.n,a.v);
    }
  }//
 private setStyle(el:HTMLElement,styles:{n:string,v:string}[]):void{
    for(let s of styles){
      this.renderer.setStyle(el,s.n,s.v);
    }
  }//
  private listen(el:HTMLElement,eventType:string,func:(e?:any)=>void):void{
    let unlisten = this.renderer.listen(el,eventType,(e)=>{
      func(e);
    });
    this.subscriptions.push(unlisten);
  }//

  private getBlockContainer(standAlone:boolean,tag:string,text:string,clasz:string[]):{bc:HTMLDivElement,cm:HTMLAnchorElement,el:HTMLElement}{
    let blockContainer = this.createElement('div',clasz) as HTMLDivElement;
    this.addClass(blockContainer,[this.blockMargin,'container']);
    //this.renderer.setAttribute(blockContainer,'contenteditable','plaintext-only');

    let row = this.createElement('div',['row','position-relative']);
    let col1 = this.createElement('div',['col-1'],[{n:'contenteditable',v:'false'}]);
    this.renderer.setStyle(col1,'width','1px');
    let cm = this.createElement('a',['sp-cm',`sp-cm-${clasz[0]}`,'position-absolute','link-danger'],[{n:'type',v:'button'}])as HTMLAnchorElement;
    this.renderer.setStyle(cm,'top','0px');
    this.renderer.setStyle(cm,'left','20px');
    this.renderer.setStyle(cm,'cursor','pointer');
    let icon = this.createElement('i',['bi','bi-three-dots-vertical']);
    this.renderer.appendChild(cm,icon);
    this.renderer.appendChild(col1,cm);
    if(!standAlone){
      this.addClass(col1,['d-none']);
    }
    let col2 = this.createElement('div',['col-11']);
    this.renderer.appendChild(row,col1);
    this.renderer.appendChild(row,col2);
    this.renderer.appendChild(blockContainer,row);
    
    let main= this.createElement(tag,clasz);
    if(text){
      this.renderer.appendChild(main,this.renderer.createText(text));
    }
    this.renderer.appendChild(col2,main);
    return {bc:blockContainer,cm:cm,el:main};
  }//

  private getMostInnerElement(node: HTMLElement): HTMLElement | null {
  let currentElement: HTMLElement | null = node;
  while (currentElement && currentElement.firstElementChild) {
    currentElement = currentElement.firstElementChild as HTMLElement;
  }
  return currentElement;
}//

}//#class
