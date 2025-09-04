export interface IOption{
	[key: string]: string|number,
        id:number,
		tenantsUuid:string,
		siteName:string,

		tagline:string,

		siteUrl:string,

		siteLanguage:string,

		dateFormat:string,

		timeFormat:string,

		timeZone:string,

		currency:string,


		activeTheme:string,

		iconUrl:string,

		logoUrl:string,

		styleSheetUrl:string,
		siteLocationId:number,

		//special pages
	homePageId:number,
	aboutPageId:number,
	contactPageId:number,
	blogPageId:number,
	storePageId:number,
	privacyPolicyPageId:number,
	tosPageId:number,
}
