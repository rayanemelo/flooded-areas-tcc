'use client';

import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Column<T> = {
  header: string;
  cell: (item: T) => ReactNode;
  className?: string;
};

type Action<T> = {
  button: (item: T) => ReactNode;
};

type Props<T> = {
  list: T[] | undefined;
  isLoading: boolean;

  columns: Column<T>[];

  actions?: Action<T>[];

  emptyMessage: string;

  skeleton: ReactNode;
};

export function BaseTable<T>({
  list,
  isLoading,
  columns,
  actions,
  emptyMessage,
  skeleton,
}: Props<T>) {
  const { t } = useTranslation();
  if (isLoading) return skeleton;

  if (!list || list.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-300">
            {columns.map((col) => (
              <TableHead key={col.header}>{col.header}</TableHead>
            ))}

            {actions && (
              <TableHead className="w-40 text-center">
                {t('table.actions')}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {list.map((item, index) => (
            <TableRow
              key={index}
              className="
                group text-slate-800 transition
                odd:bg-white
                even:bg-slate-50/70
                hover:bg-slate-100
                dark:text-slate-200
                dark:odd:bg-slate-900
                dark:even:bg-slate-800/40
                dark:hover:bg-slate-800/80
              "
            >
              {/* Cells */}
              {columns.map((col) => (
                <TableCell key={col.header} className={col.className}>
                  {col.cell(item)}
                </TableCell>
              ))}

              {/* Actions */}
              {actions && (
                <TableCell className="text-center">
                  {actions.map((action, i) => (
                    <span key={i}>{action.button(item)}</span>
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
