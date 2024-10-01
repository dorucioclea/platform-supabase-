import { Entity } from "./Entity";

export interface ColumnTasks extends Entity{
    id?:string;
    content?: string;
    columnId?: string;
}