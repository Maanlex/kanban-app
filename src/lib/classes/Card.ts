export class Card {
    private static count = 0;
    id: number;
    name: string;

    constructor(name: string){
        this.name = name;
        this.id = ++Card.count;
    }

    
}