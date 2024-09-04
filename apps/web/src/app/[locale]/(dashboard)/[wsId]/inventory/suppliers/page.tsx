import { CustomDataTable } from '@/components/custom-data-table';
import { basicColumns } from '@/data/columns/basic';
import { ProductSupplier } from '@/types/primitives/ProductSupplier';
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

export default async function WorkspaceSuppliersPage({
  params: { wsId },
  searchParams,
}: Props) {
  const t = await getTranslations();
  const { data, count } = await getData(wsId, searchParams);

  return (
    <>
      <FeatureSummary
        pluralTitle={t('ws-inventory-suppliers.plural')}
        singularTitle={t('ws-inventory-suppliers.singular')}
        description={t('ws-inventory-suppliers.description')}
        createTitle={t('ws-inventory-suppliers.create')}
        createDescription={t('ws-inventory-suppliers.create_description')}
        // form={<SupplierForm wsId={wsId} />}
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
    .from('inventory_suppliers')
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

  return { data, count } as { data: ProductSupplier[]; count: number };
}
