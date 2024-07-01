import type { TaskLabel } from "./TaskLabel";
import { Entity } from "./Entity";

export class Task extends Entity implements Item{
    name: string;
    description?: string;
    labels?: Array<TaskLabel>;
    dueDate?: Date;

    public constructor(name: string, description: string = "", labels: Array<TaskLabel> = new Array<TaskLabel>){
        super();
        this.name = name;
        this.description = description;
        this.labels = labels;
    }
}