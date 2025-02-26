//TT FORMATO ENRIQUECIDO
export function FormatoEnriquecido(text) {
  // Reemplazar todos los '**' por '*'
  let modifiedText = text.replace(/\*\*/g, '*')

  // Reemplazar todos los '__' por '_'
  modifiedText = modifiedText.replace(/__/g, '_')

  return modifiedText
}
