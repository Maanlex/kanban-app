import {v4 as uuid} from 'uuid'
export class TaskLabel{
    id: string;
    name: string;
    color: string;

    public constructor(name: string, color: string){
        this.id = uuid();
        this.name = name;
        this.color = color;
    }
}