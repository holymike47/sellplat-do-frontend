import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-handler',
  imports: [],
  templateUrl: './image-handler.component.html',
  styleUrl: './image-handler.component.css'
})
export class ImageHandlerComponent implements OnInit {
  @Output() 
  outPutMessage = new EventEmitter<string>();
   @Input()
  imageUrl!:string;
  //  @Input()
  // height!:string;
  // @Input()
  // width!:string;
  // @Input()
  // classes!:string;
  @ViewChild('image',{static:false}) image!: ElementRef<HTMLImageElement>;

   ngOnInit(): void {
    console.log(this.imageUrl);
  }
 
  handleImage(el:HTMLInputElement):void{
  const file = (el.files as FileList)[0];
  if (file) {
    //validate file, eg size, type
    //this.imageFile = file;
    let $this=this;
    //read file and preview;
    const reader = new FileReader();
  reader.onload = async function(e) {
    $this.imageUrl = $this.image.nativeElement.src = (e!.target!.result as string);
    $this.outPutMessage.emit($this.imageUrl);
  }
  reader.readAsDataURL(file);
  }
  }//

}//class
