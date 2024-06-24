'use client';

import ApiKeyEditDialog from './edit-dialog';
import { WorkspaceApiKey } from '@/types/primitives/WorkspaceApiKey';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { toast } from '@repo/ui/hooks/use-toast';
import { Row } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ApiKeyRowActionsProps {
  row: Row<WorkspaceApiKey>;
}

export function ApiKeyRowActions({ row }: ApiKeyRowActionsProps) {
  const router = useRouter();
  const t = useTranslations('ws-api-keys');

  const apiKey = row.original;

  const deleteApiKey = async () => {
    const res = await fetch(
      `/api/v1/workspaces/${apiKey.ws_id}/api-keys/${apiKey.id}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      toast({
        title: 'Failed to delete workspace api key',
        description: data.message,
      });
    }
  };

  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!apiKey.id || !apiKey.ws_id) return null;

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            {t('common:edit')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={deleteApiKey}>
            {t('common:delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ApiKeyEditDialog
        data={apiKey}
        open={showEditDialog}
        setOpen={setShowEditDialog}
        submitLabel={t('edit_key')}
      />
    </>
  );
}
