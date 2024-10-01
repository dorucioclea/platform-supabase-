create table "public"."workspace_board_tasks" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "content" text,
    "columnId" uuid default gen_random_uuid()
);


alter table "public"."workspace_board_tasks" enable row level security;

CREATE UNIQUE INDEX workspace_board_tasks_pkey ON public.workspace_board_tasks USING btree (id);

alter table "public"."workspace_board_tasks" add constraint "workspace_board_tasks_pkey" PRIMARY KEY using index "workspace_board_tasks_pkey";

alter table "public"."workspace_board_tasks" add constraint "workspace_board_tasks_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES workspace_boards_columns(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_board_tasks" validate constraint "workspace_board_tasks_columnId_fkey";

grant delete on table "public"."workspace_board_tasks" to "anon";

grant insert on table "public"."workspace_board_tasks" to "anon";

grant references on table "public"."workspace_board_tasks" to "anon";

grant select on table "public"."workspace_board_tasks" to "anon";

grant trigger on table "public"."workspace_board_tasks" to "anon";

grant truncate on table "public"."workspace_board_tasks" to "anon";

grant update on table "public"."workspace_board_tasks" to "anon";

grant delete on table "public"."workspace_board_tasks" to "authenticated";

grant insert on table "public"."workspace_board_tasks" to "authenticated";

grant references on table "public"."workspace_board_tasks" to "authenticated";

grant select on table "public"."workspace_board_tasks" to "authenticated";

grant trigger on table "public"."workspace_board_tasks" to "authenticated";

grant truncate on table "public"."workspace_board_tasks" to "authenticated";

grant update on table "public"."workspace_board_tasks" to "authenticated";

grant delete on table "public"."workspace_board_tasks" to "service_role";

grant insert on table "public"."workspace_board_tasks" to "service_role";

grant references on table "public"."workspace_board_tasks" to "service_role";

grant select on table "public"."workspace_board_tasks" to "service_role";

grant trigger on table "public"."workspace_board_tasks" to "service_role";

grant truncate on table "public"."workspace_board_tasks" to "service_role";

grant update on table "public"."workspace_board_tasks" to "service_role";


