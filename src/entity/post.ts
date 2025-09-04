import { ICategory } from "./category";
import { ISelectedMenu } from "./menu-item";
import { IOption } from "./option";


export interface IPost{
	id:number,
	title:string,
	mainContent:string,
	excerpt:string,
	postType:string,
	contentStatus:string,
	featuredImageUrl:string,
	keywords:string|null,
	tags:string,
	likes:number,
	views:number,
	sidebarType:string,

	allowComments:boolean,
	isFeatured:boolean,
	isSticky:boolean,

	isHome:boolean,
	isBlog:boolean,
	isContact:boolean,
	isAbout:boolean,
	isPrivacyPolicy:boolean,
	isTos:boolean,
	isStore:boolean,

	creationDate:Date|string|null,
	lastUpdate:Date|string|null,

	tenantsId:number,
	tenantsUuid:string,
	sidebarsId:number|null,
	customFieldsId:number|null,
	localHeadersId:number|null,
	localFootersId:number|null,
	categoryIds:number[],
	categories:ICategory[],
	commentIds:number[]
}//IPost

export function newPost():IPost{
	let newPost:IPost = {
        id:-1,
		title:"",
		mainContent:"",
        excerpt:"",
		postType:"",
		contentStatus:"DRAFT",
		featuredImageUrl:"",
		keywords:"",
		tags:"",
		likes:0,
		views:0,
		sidebarType:"NONE",

		allowComments:false,
		isFeatured:false,
		isSticky:false,

		isHome:false,
		isBlog:false,
		isContact:false,
		isAbout:false,
		isPrivacyPolicy:false,
		isTos:false,
		isStore:false,

		creationDate:null,
		lastUpdate:null,
		
		sidebarsId:null,
		categoryIds:[],
		categories:[],
		tenantsId:-1,
		localHeadersId:null,
		localFootersId:null,
		customFieldsId:null,
		commentIds:[],
		tenantsUuid:''
}
return newPost;
}//newPost()

export interface IPostRecord{
	posts:IPost[];//post has its own tags and categories
	categories:ICategory[]; //all categories
	allTags:string[]; //all tags
	option:IOption;
	menus:ISelectedMenu[];
}//



