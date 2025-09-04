export class Comment{
    constructor(
        public id:number,
		public mainContent:string,
		public isApproved:boolean,
		public postId:number,
		public userId:number
    ){

    }
}