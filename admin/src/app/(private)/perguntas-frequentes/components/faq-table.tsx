import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { formatDateTime } from '@/utils/format-date-time';
import { Faq } from '@/services/faq';
import { BaseTable } from '@/components/base-table/base-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
type Props = {
  list: Faq[] | undefined;
  isLoading: boolean;
  onEdit: (faq: Faq) => void;
  onDelete: (faq: Faq) => void;
  onView: (faq: Faq) => void;
};

export function FaqTable({ list, isLoading, onEdit, onDelete, onView }: Props) {
  const { t } = useTranslation();

  return (
    <BaseTable<Faq>
      list={list}
      isLoading={isLoading}
      skeleton={<FaqTableSkeleton />}
      emptyMessage={t('faq.table.empty')}
      columns={[
        {
          header: t('table.question'),
          className: 'max-w-[260px]',
          cell: (faq) => (
            <div className="flex flex-col">
              <span className="truncate font-medium text-slate-900 dark:text-slate-100">
                {faq.question}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('table.id-prefix')} {faq.id}
              </span>
            </div>
          ),
        },
        {
          header: t('table.answer'),
          className: 'max-w-[320px]',
          cell: (faq) => (
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">
              {faq.answer}
            </p>
          ),
        },
        {
          header: t('table.created-at'),
          cell: (faq) => (
            <span className="text-xs text-slate-700 dark:text-slate-300">
              {formatDateTime(faq.createdAt)}
            </span>
          ),
        },
        {
          header: t('table.updated-at'),
          cell: (faq) => (
            <span className="text-xs text-slate-700 dark:text-slate-300">
              {formatDateTime(faq.updatedAt)}
            </span>
          ),
        },
      ]}
      actions={[
        {
          button: (faq) => (
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-500/15 dark:hover:text-blue-300"
              onClick={() => onView(faq)}
              aria-label={t('actions.view')}
              title={t('actions.view')}
            >
              <Eye className="h-4 w-4" />
            </Button>
          ),
        },
        {
          button: (faq) => (
            <Button
              variant="ghost"
              size="icon"
              className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-500/15 dark:hover:text-amber-300"
              onClick={() => onEdit(faq)}
              aria-label={t('actions.edit')}
              title={t('actions.edit')}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ),
        },
        {
          button: (faq) => (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/15 dark:hover:text-red-300"
              onClick={() => onDelete(faq)}
              aria-label={t('actions.delete')}
              title={t('actions.delete')}
            >
              <Trash className="h-4 w-4" />
            </Button>
          ),
        },
      ]}
    />
  );
}

export function FaqTableSkeleton() {
  const { t } = useTranslation();

  return (
    <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 text-slate-500 dark:bg-slate-800/70 dark:text-slate-300">
            <TableHead>{t('table.question')}</TableHead>
            <TableHead>{t('table.answer')}</TableHead>
            <TableHead>{t('table.created-at')}</TableHead>
            <TableHead>{t('table.updated-at')}</TableHead>
            <TableHead className="w-40 text-center">{t('table.actions')}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow
              key={index}
              className="animate-pulse odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/40"
            >
              <TableCell>
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              </TableCell>

              <TableCell>
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              </TableCell>

              <TableCell>
                <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              </TableCell>

              <TableCell>
                <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              </TableCell>

              <TableCell className="text-center">
                <div className="inline-flex space-x-1">
                  <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
