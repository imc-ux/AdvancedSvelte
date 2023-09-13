
declare namespace md5 {

	export function hex_md5(options: string): string;
	
}

declare module 'libs/md5' {
    export = md5;
}