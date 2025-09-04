import { ISelectedMenu } from "./menu-item";
import { IOption } from "./option";
import { IUser } from "./user";

export interface ILocalCache{
    user:IUser,
    option:IOption,
    displayMenu:ISelectedMenu[]
}