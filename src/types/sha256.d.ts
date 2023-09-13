
declare namespace sha256 {

	export function sha256_digest(options: string): string;
	
}

declare module 'libs/sha256' {
    export = sha256;
}