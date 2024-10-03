alter table "public"."workspace_boards_columns" drop constraint "workspace_boards_columns_board_id_fkey";

alter table "public"."workspace_board_tasks" add column "position" bigint;

alter table "public"."workspace_board_tasks" disable row level security;

alter table "public"."workspace_boards_columns" drop column "board_id";

alter table "public"."workspace_boards_columns" add column "boardId" uuid default gen_random_uuid();

alter table "public"."workspace_boards_columns" add constraint "workspace_boards_columns_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES workspace_boards(id) not valid;

alter table "public"."workspace_boards_columns" validate constraint "workspace_boards_columns_boardId_fkey";


