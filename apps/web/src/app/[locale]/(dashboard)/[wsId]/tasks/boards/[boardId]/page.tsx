import { KanbanBoard } from './kanban';
import { createClient } from '@/utils/supabase/server';

// Use your defined interface for columns and tasks
interface Column {
  id: string;
  board_id: string;
  title: string;
  position: number;
  created_at: string;
}

interface Task {
  id: string;
  columnId: string;
  content: string;
  created_at: string;
}

interface Props {
  params: {
    wsId?: string;
    boardId?: string;
  };
}

export default async function WorkspaceBoardEditor({ params: {wsId ,boardId } }: Props) {
  if (!boardId) {
    return <p>No boardId provided</p>;
  }

  // Fetch the data server-side
  const { columns, tasks } = await getData(boardId);

  // Debug: Log fetched columns and tasks
  // console.log('Fetched columns:', columns);
  // console.log('Fetched tasks:', tasks);

  // Render the Kanban board with the fetched columns and tasks
  return <KanbanBoard wsId= {wsId} defaultCols={columns} initialTasks={tasks} />;
}

async function getData(boardId: string) {
  const supabase = createClient();

  // Fetch all columns for the given board
  const { data: columns, error: columnError } = await supabase
    .from('workspace_boards_columns')
    .select('*')
    .eq('boardId', boardId);

  // Check for errors and return early if columns fetching fails
  if (columnError) {
    console.error('Error fetching columns:', columnError);
    return { columns: [], tasks: [] };
  }
// console.log(columns[0].id,'anh iu e')
  // If columns are empty, return early
  if (!columns || columns.length === 0) {
    console.warn('No columns found for this board');
    return { columns: [], tasks: [] };
  }

  // Debug: Log the fetched columns' IDs


  // Fetch all tasks for the given columns using their column IDs
  const { data: tasks, error: taskError } = await supabase
    .from('workspace_board_tasks')
    .select('*')
 
  if (taskError) {
    console.error('Error fetching tasks:', taskError);
    return { columns, tasks: [] };
  }




  return { columns, tasks };
}
