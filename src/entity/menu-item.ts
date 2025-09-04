import { ICategory } from "./category";
import { IPost } from "./post";

export interface IMenuItem{
    pages:IPost[];
    posts:IPost[];
    categories:ICategory[];
    custom:string[];
    selected:ISelectedMenu[];
    display:ISelectedMenu[];

}


export interface ISelectedMenu{
    id:number,
    item:string;
    postType:string;
    label:string;
    link:string;
    menuOrder:number;
    parent:ISelectedMenu|null;
    parentId:number|null;
    children:ISelectedMenu[];
    tenantsUuid:string;
}

export function testMenu():IMenuItem{
    let menu:IMenuItem = {
        pages:[],
        posts:[],
        categories:[],
        custom:["codecapt","google","facebook"],
        selected:[],
        display:[]
    };
    return menu;
}