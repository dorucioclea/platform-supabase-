import { UserDatabaseFilter } from '../filters';
import { UserGroup } from '@/types/primitives/UserGroup';
import { createClient } from '@/utils/supabase/server';
import { MinusCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';

interface SearchParams {
  q?: string;
  page?: string;
  pageSize?: string;
  includedGroups?: string | string[];
  excludedGroups?: string | string[];
}

export default async function Filters({
  wsId,
  searchParams,
}: {
  wsId: string;
  searchParams: SearchParams;
}) {
  const t = useTranslations('user-data-table');

  const { data: userGroups } = await getUserGroups(wsId);
  const { data: excludedUserGroups } = await getExcludedUserGroups(
    wsId,
    searchParams
  );

  return (
    <>
      <UserDatabaseFilter
        key="included-user-groups-filter"
        tag="includedGroups"
        title={t('included_groups')}
        icon={<PlusCircledIcon className="mr-2 h-4 w-4" />}
        options={userGroups.map((group) => ({
          label: group.name || 'No name',
          value: group.id,
          count: group.amount,
        }))}
      />
      <UserDatabaseFilter
        key="excluded-user-groups-filter"
        tag="excludedGroups"
        title={t('excluded_groups')}
        icon={<MinusCircledIcon className="mr-2 h-4 w-4" />}
        options={excludedUserGroups.map((group) => ({
          label: group.name || 'No name',
          value: group.id,
          count: group.amount,
        }))}
      />
    </>
  );
}

async function getUserGroups(wsId: string) {
  const supabase = createClient();

  const queryBuilder = supabase
    .from('workspace_user_groups_with_amount')
    .select('id, name, amount', {
      count: 'exact',
    })
    .eq('ws_id', wsId)
    .order('name');

  const { data, error, count } = await queryBuilder;
  if (error) throw error;

  return { data, count } as { data: UserGroup[]; count: number };
}

async function getExcludedUserGroups(
  wsId: string,
  { includedGroups }: SearchParams
) {
  const supabase = createClient();

  if (!includedGroups || includedGroups.length === 0) {
    return getUserGroups(wsId);
  }

  const queryBuilder = supabase
    .rpc(
      'get_possible_excluded_groups',
      {
        _ws_id: wsId,
        included_groups: Array.isArray(includedGroups)
          ? includedGroups
          : [includedGroups],
      },
      {
        count: 'exact',
      }
    )
    .select('id, name, amount')
    .order('name');

  const { data, error, count } = await queryBuilder;
  if (error) throw error;

  return { data, count } as { data: UserGroup[]; count: number };
}
