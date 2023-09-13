
declare namespace base64 {
	
	export const Base64: IBase64;
	
	interface IBase64{
		VERSION: string;
		encode(u: string, urisafe?: boolean): string;
		decode(a: string): string;
	}
}

declare module 'libs/base64' {
    export = base64;
}
