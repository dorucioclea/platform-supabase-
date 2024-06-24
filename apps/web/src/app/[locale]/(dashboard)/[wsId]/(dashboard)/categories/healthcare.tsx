import { verifyHasSecrets } from '@/lib/workspace-helper';
import { useTranslations } from 'next-intl';

export default async function HealthcareCategoryStatistics({
  wsId,
}: {
  wsId: string;
}) {
  const t = useTranslations('ws-home');

  const forceEnable = false;
  const enabled =
    forceEnable || (await verifyHasSecrets(wsId, ['ENABLE_HEALTHCARE']));

  if (!enabled) return null;

  return (
    <div className="mb-2 mt-4 text-2xl font-semibold">
      {t('sidebar-tabs:healthcare')}
    </div>
  );
}
