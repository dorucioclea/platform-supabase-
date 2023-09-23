import { getCurrentSupabaseUser } from '@/lib/user-helper';
import { VercelToolbar } from '@vercel/toolbar/next';

export async function StaffToolbar() {
  const user = await getCurrentSupabaseUser();
  const isEmployee = user?.email?.endsWith('@tuturuuu.com');

  return isEmployee ? <VercelToolbar /> : null;
}
