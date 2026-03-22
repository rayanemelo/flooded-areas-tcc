'use client';

import { useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Loader2Icon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { nivelVariant, statusVariant } from '@/utils/styles';
import { IAAnalysis } from '@/components/ia-analysis/ia-analysis';
import { useFloodArea } from '@/hooks/use-flood-area';
import { formatDateTime } from '@/utils/format-date-time';
import { FloodAreaStatus } from '@/services/flood-area';
import { mapFloodLevel, mapStatus } from '@/utils/mapping';
import { AlagamentoDetalhesLoading } from './components/alagamento-detalhes-loading';
import { AlagamentoDetalhesNotFound } from './components/alagamentos-detalhes-not-found';
import { AlagamentoDetalhesError } from './components/alagamento-detalhes-error';
import { cn } from '@/lib/utils';

const FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1639164631432-fe23c2cfcee7?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function AlagamentoDetalhesPage() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const id = useMemo(() => Number(params.id), [params.id]);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [pendingAction, setPendingAction] = useState<
    'approve' | 'reject' | 'toggle-active' | null
  >(null);
  const [isActiveConfirmOpen, setIsActiveConfirmOpen] = useState(false);
  const { getFloodAreaById, updateFloodArea, isUpdating } = useFloodArea();

  const {
    data: floodArea,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['floodAreaById', id],
    queryFn: () => getFloodAreaById(id),
    enabled: Number.isFinite(id),
  });

  async function handleUpdateStatus(status: FloodAreaStatus) {
    if (!floodArea) return;

    const action = status === 'completed' ? 'approve' : 'reject';
    setPendingAction(action);

    try {
      await updateFloodArea({
        id: floodArea.id,
        active: floodArea.active,
        status,
        commentsAdmin: commentRef.current?.value?.trim() || null,
      });
    } finally {
      setPendingAction(null);
    }
  }

  async function handleToggleActive() {
    if (!floodArea) return;

    setPendingAction('toggle-active');

    try {
      await updateFloodArea({
        id: floodArea.id,
        active: !floodArea.active,
        status: floodArea.status,
        commentsAdmin: commentRef.current?.value?.trim() || null,
      });
    } finally {
      setPendingAction(null);
    }
  }

  function translateFloodLevel(level: string) {
    switch (level) {
      case 'Leve':
        return t('flood-level.light');
      case 'Moderado':
        return t('flood-level.moderate');
      case 'Interditado':
        return t('flood-level.interdicted');
      default:
        return level;
    }
  }

  function translateFloodStatus(status: string) {
    switch (status) {
      case 'Pendente':
        return t('flood-status.pending');
      case 'Concluído':
        return t('flood-status.completed');
      case 'Rejeitado':
        return t('flood-status.rejected');
      default:
        return status;
    }
  }

  if (!Number.isFinite(id)) {
    return <AlagamentoDetalhesNotFound />;
  }

  if (isLoading) {
    return <AlagamentoDetalhesLoading />;
  }

  if (error) {
    return <AlagamentoDetalhesError />;
  }

  if (!floodArea) {
    return <AlagamentoDetalhesNotFound />;
  }

  const nivel = mapFloodLevel(floodArea.floodLevelId);
  const status = mapStatus(floodArea.status);
  const imageUrl = floodArea.images?.[0]?.url ?? FALLBACK_IMAGE_URL;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">{t('menu.alagamentos')}</h1>

      <Card>
        <CardContent className="grid gap-6 md:grid-cols-[500px_1fr] ">
          <div className="relative aspect-3/4 max-w-125 w-full overflow-hidden rounded-lg border">
            <Image
              src={imageUrl}
              alt={t('alagamentos.details.image-alt')}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('table.address')}
              </h3>
              <p className="text-sm">{floodArea.address}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('alagamentos.details.coordinates')}
              </h3>
              <p className="text-sm">
                {t('alagamentos.details.latitude')}: {floodArea.latitude}
              </p>
              <p className="text-sm">
                {t('alagamentos.details.longitude')}: {floodArea.longitude}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('table.level')}
              </h3>
              <Badge className={nivelVariant(nivel)}>
                {translateFloodLevel(nivel)}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('table.status')}
              </h3>
              <Badge className={statusVariant(status)}>
                {translateFloodStatus(status)}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('alagamentos.details.created-at')}
              </h3>
              <p className="text-sm">{formatDateTime(floodArea.createdAt)}</p>
            </div>

            <div className="space-y-3 rounded-lg border bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/5 md:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground dark:text-white">
                    {t('alagamentos.details.system-status')}
                  </h3>
                  <Badge
                    className={
                      floodArea.active
                        ? 'mt-2 border border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'mt-2 border border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300'
                    }
                  >
                    {floodArea.active
                      ? t('alagamentos.details.active')
                      : t('alagamentos.details.inactive')}
                  </Badge>
                </div>

                <div className="flex bg-card items-center gap-3">
                  {pendingAction === 'toggle-active' ? (
                    <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
                  ) : null}

                  <button
                    type="button"
                    role="switch"
                    aria-checked={floodArea.active}
                    aria-label={
                      floodArea.active
                        ? t('actions.deactivate')
                        : t('actions.activate')
                    }
                    onClick={() => setIsActiveConfirmOpen(true)}
                    disabled={isUpdating}
                    className={cn(
                      'relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B6790] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70',
                      floodArea.active
                        ? 'bg-emerald-600 dark:bg-emerald-500'
                        : 'bg-slate-300 dark:bg-slate-600'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 rounded-full bg-white transition-transform dark:bg-slate-100',
                        floodArea.active ? 'translate-x-5' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <IAAnalysis />
            </div>

            <div className="space-y-2 md:col-span-2">
              <h3 className="text-sm font-medium">
                {t('alagamentos.details.manager-comment')}
              </h3>
              <Textarea
                placeholder={t('alagamentos.details.comment-placeholder')}
                className="min-h-25"
                defaultValue={floodArea.commentsAdmin ?? ''}
                ref={commentRef}
              />
            </div>

            <div className="flex flex-col gap-3 pt-4 md:col-span-2 md:flex-row">
              <Button
                variant="outline"
                className="flex-1"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('rejected')}
              >
                {pendingAction === 'reject' ? (
                  <Loader2Icon className="size-5 animate-spin" />
                ) : (
                  t('actions.reject')
                )}
              </Button>

              <Button
                className="flex-1 bg-[#3B6790] hover:bg-[#3B6790]/90 text-white"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('completed')}
              >
                {pendingAction === 'approve' ? (
                  <Loader2Icon className="size-5 animate-spin" />
                ) : (
                  t('actions.approve')
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={isActiveConfirmOpen}
        onOpenChange={setIsActiveConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('alagamentos.details.toggle-active.confirm-title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {floodArea.active
                ? t(
                    'alagamentos.details.toggle-active.confirm-description-deactivate'
                  )
                : t(
                    'alagamentos.details.toggle-active.confirm-description-activate'
                  )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>
              {t('actions.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isUpdating}
              onClick={async (event) => {
                event.preventDefault();
                try {
                  await handleToggleActive();
                  setIsActiveConfirmOpen(false);
                } catch {
                  // Toast is handled inside the mutation hook.
                }
              }}
            >
              {isUpdating && pendingAction === 'toggle-active' ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : floodArea.active ? (
                t('actions.deactivate')
              ) : (
                t('actions.activate')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
