import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

function StatusIcon({ status }: { status: string }) {
  if (status === "success") return <CheckCircle className="h-4 w-4 text-green-600" />
  if (status === "warning") return <AlertTriangle className="h-4 w-4 text-yellow-500" />
  return <XCircle className="h-4 w-4 text-red-500" />
}

const MOCK_AI_ANALYSIS = {
  status: "completed", // pending | completed | failed
  score: 82,
  confidence: "Alta",
  summary:
    "A imagem apresenta características compatíveis com alagamento urbano. A localização do usuário é próxima ao endereço informado e os metadados são consistentes.",
  checks: [
    {
      label: "Imagem compatível com alagamento",
      status: "success",
    },
    {
      label: "Metadados válidos",
      status: "success",
    },
    {
      label: "Localização compatível",
      status: "warning",
      details: "Diferença de ~120 metros",
    },
    {
      label: "Imagem duplicada",
      status: "error",
      details: "Imagem semelhante encontrada em outro relato",
    },
  ],
}



export function IAAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Análise Automática (IA)
          <Badge variant="outline">Auxiliar</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Confiabilidade
          </span>
          <Badge className="bg-green-600 text-white">
            Alta (82%)
          </Badge>
        </div>

        {/* Resumo */}
        <p className="text-sm text-muted-foreground">
          A imagem apresenta características compatíveis com alagamento urbano.
          A localização do usuário é próxima ao endereço informado e os metadados
          são consistentes.
        </p>

        {/* Checks */}
        <div className="space-y-2">
          {MOCK_AI_ANALYSIS.checks.map((check, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm"
            >
              <StatusIcon status={check.status} />
              <div>
                <p>{check.label}</p>
                {check.details && (
                  <p className="text-xs text-muted-foreground">
                    {check.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
