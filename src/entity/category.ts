export interface ICategory{
	id:number,
	name:string,
	description:string,
	categoryImageUrl:string,
	postIds:number[],
	parentName:string|null,
	parentId:number,
    tenantsId:number,
	tenantsUuid:string
}//

export function newCategory():ICategory{
    let category:ICategory = {
        id:-1,
        name:"",
        description:"",
        categoryImageUrl:"",
        postIds:[],
        parentName:null,
        parentId:-1,
        tenantsId:-1,
        tenantsUuid:""
    };
    return category;
}//