import { Entity } from "./Entity";
import { List } from "./List";
import { Task } from "./Task";
import { TaskLabel } from "./TaskLabel";

export class Board extends Entity{
    name: string;
    lists: Array<List>;
    labels: Array<TaskLabel>;

    public constructor(name: string,
                    lists: Array<List> = new Array<List>,
                    labels: Array<TaskLabel> = new Array<TaskLabel>){
        super();
        this.name = name;
        this.lists = lists;
        this.labels = labels
    }

    
}

export const TestBoard = () => {
    const l1: TaskLabel = new TaskLabel("front","#000315");
    const l2: TaskLabel = new TaskLabel("URGENT","#d03f2c");
    const l3: TaskLabel = new TaskLabel("back","#3493e1");

    return new Board("Test Kanban",[
        new List("To Do",[
            new Task("Android App New Landing Page","Description",[l1,l2]),
            new Task("Analytics")
        ],10),
        new List("Doing",[
            new Task("Authentification","OAuth2",[l1,l3]),
            new Task("IT Solutions page")
        ],4),
        new List("Done")
    ],[l1,l2,l3])
}