import {Card} from './Card'
export class BoardColumn {
    private static count=0;
    id: number;
    name: string
    items: Array<Card>;

    constructor(name: string, items: Array<Card>){
        this.name = name;
        this.items = items;
        this.id = ++BoardColumn.count;
    }
}