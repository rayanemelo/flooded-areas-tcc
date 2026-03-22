"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "react-i18next"

type Props = {
  nivel: string | null
  status: string | null
  onNivelChange: (value: string | null) => void
  onStatusChange: (value: string | null) => void
}

export function AlagamentosFilters({
  nivel,
  status,
  onNivelChange,
  onStatusChange,
}: Props) {
  const { t } = useTranslation()

  function clearFilters() {
    onNivelChange(null)
    onStatusChange(null)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={clearFilters}>
        {t("actions.clear-filters")}
      </Button>

      {/* Select Nível */}
      <Select
        key={`nivel-${nivel ?? "empty"}`}
        value={nivel ?? undefined}
        onValueChange={(value) => onNivelChange(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("alagamentos.filters.level-placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Leve">{t("flood-level.light")}</SelectItem>
          <SelectItem value="Moderado">{t("flood-level.moderate")}</SelectItem>
          <SelectItem value="Interditado">{t("flood-level.interdicted")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Select Status */}
      <Select
        key={`status-${status ?? "empty"}`}
        value={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("alagamentos.filters.status-placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pendente">{t("flood-status.pending")}</SelectItem>
          <SelectItem value="Concluído">{t("flood-status.completed")}</SelectItem>
          <SelectItem value="Rejeitado">{t("flood-status.rejected")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
