
declare namespace json {	
	export function stringify(value: object, replacer?: any, space?: number ):string;
	export function parse(text: string, replacer?: Function ): any;
}

declare module 'libs/json2' {
    export = json;
}
