'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import useTranslation from 'next-translate/useTranslation';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const { t } = useTranslation('common');

  const isShowingAll = table
    .getAllColumns()
    .every((column) => column.getIsVisible());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          {t('view-options')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>{t('toggle-columns')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <Button
            className="w-full"
            size="sm"
            onClick={() => {
              table
                .getAllColumns()
                .forEach((column) =>
                  column.toggleVisibility(isShowingAll ? false : true)
                );
            }}
          >
            {isShowingAll ? t('hide-all') : t('show-all')}
          </Button>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
