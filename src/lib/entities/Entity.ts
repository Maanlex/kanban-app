import {v4 as uuid} from 'uuid';
export class Entity{
    readonly id: string;
    public constructor(){
        this.id = uuid();
    }
}