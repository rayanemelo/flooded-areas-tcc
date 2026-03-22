export function nivelVariant(nivel: string) {
  switch (nivel) {
    case "Leve":
      return "bg-yellow-400 text-white"
    case "Moderado":
      return "bg-orange-400 text-white"
    case "Interditado":
      return "bg-red-500 text-white"
    default:
      return ""
  }
}

export function statusVariant(status: string) {
  switch (status) {
    case "Concluído":
      return "bg-green-500 text-white"
    case "Pendente":
      return "bg-sky-500 text-white"
    case "Rejeitado":
      return "bg-red-500 text-white"
    default:
      return ""
  }
}
