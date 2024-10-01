import { Entity } from "./Entity";

export interface BoardTasks extends Entity{
    id?: string;
    board_id?: string;
    title?: string;
    potition?: Number;
}