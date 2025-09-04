export interface IUser{
    id:number;
    tenantsUuid:string;//
    email:string;
    username:string;
    firstName:string;
    middleName:string;
    lastName:string;
    website:string;
    topRole:string;
    accountType:string;
    password:string;
}
export function newUser():IUser{
    let user:IUser={
        id:-1,
        tenantsUuid:"",
        email:"",
        username:"",
        firstName:"",
        middleName:"",
        lastName:"",
        website:"",
        topRole:"",
        password:"",
        accountType:""
    }
    return user;
}