declare module 'JSONStream' {
    import { Readable } from 'stream';

    function parse(path: string): Readable;
    function stringify(): Readable;

    export { parse, stringify };
}