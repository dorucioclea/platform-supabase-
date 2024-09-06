import { CustomDataTable } from '@/components/custom-data-table';
import { basicColumns } from '@/data/columns/basic';
import { UserGroup } from '@/types/primitives/UserGroup';
import { createClient } from '@/utils/supabase/server';
import FeatureSummary from '@repo/ui/components/ui/custom/feature-summary';
import { Separator } from '@repo/ui/components/ui/separator';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: {
    wsId: string;
  };
  searchParams: {
    q: string;
    page: string;
    pageSize: string;
  };
}

export default async function WorkspaceProductCategoriesPage({
  params: { wsId },
  searchParams,
}: Props) {
  const t = await getTranslations();
  const { data, count } = await getData(wsId, searchParams);

  return (
    <>
      <FeatureSummary
        pluralTitle={t('ws-inventory-categories.plural')}
        singularTitle={t('ws-inventory-categories.singular')}
        description={t('ws-inventory-categories.description')}
        createTitle={t('ws-inventory-categories.create')}
        createDescription={t('ws-inventory-categories.create_description')}
        // form={<CategoryForm wsId={wsId} />}
      />
      <Separator className="my-4" />
      <CustomDataTable
        data={data}
        columnGenerator={basicColumns}
        namespace="basic-data-table"
        count={count}
        defaultVisibility={{
          id: false,
          created_at: false,
        }}
      />
    </>
  );
}

async function getData(
  wsId: string,
  {
    q,
    page = '1',
    pageSize = '10',
  }: { q?: string; page?: string; pageSize?: string }
) {
  const supabase = createClient();

  const queryBuilder = supabase
    .from('product_categories')
    .select('*', {
      count: 'exact',
    })
    .eq('ws_id', wsId);

  if (q) queryBuilder.ilike('name', `%${q}%`);

  if (page && pageSize) {
    const parsedPage = parseInt(page);
    const parsedSize = parseInt(pageSize);
    const start = (parsedPage - 1) * parsedSize;
    const end = parsedPage * parsedSize;
    queryBuilder.range(start, end).limit(parsedSize);
  }

  const { data, error, count } = await queryBuilder;
  if (error) throw error;

  return { data, count } as { data: UserGroup[]; count: number };
}
