export enum ChartColors {
  Green = '#11d99f',
  Blue = '#456dd0',
  Red = '#cf3434',
  Yellow = '#e1bc51',
  Orange = '#FFA500',
  Purple = '#800080',
  Pink = '#FFC0CB',
}

export enum GroupColors {
  // Principais Itens
  gasolinaComum = ChartColors.Green,
  gasolinaAditivada = ChartColors.Blue,
  alcool = ChartColors.Orange,
  diesel = ChartColors.Purple,
  outros = ChartColors.Yellow,

  // Default
  default = ChartColors.Pink,
}
