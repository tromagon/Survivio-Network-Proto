export interface Stream<T> {
    read(src:any, dest:T):T;
    write(src:T, dest:any):any;
}