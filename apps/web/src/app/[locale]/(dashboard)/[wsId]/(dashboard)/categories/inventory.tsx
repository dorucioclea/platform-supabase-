import { verifyHasSecrets } from '@/lib/workspace-helper';
import { useTranslations } from 'next-intl';

export default async function InventoryCategoryStatistics({
  wsId,
}: {
  wsId: string;
}) {
  const t = useTranslations('ws-home');

  const forceEnable = false;
  const enabled =
    forceEnable || (await verifyHasSecrets(wsId, ['ENABLE_INVENTORY']));

  if (!enabled) return null;

  return (
    <div className="mb-2 mt-4 text-2xl font-semibold">
      {t('sidebar-tabs:inventory')}
    </div>
  );
}
