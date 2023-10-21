export interface GenerateStrategyRequestDto {
  club: string;
  opponentClub: string;
  league: string;
  desiredStrategy: Strategy[];
}

export enum Strategy {
  ATTACK = 'Attack',
  DEFENSE = 'Defense',
  SPECIFIC_STRATEGY = 'Specific strategy',
  INCLUDE_ALL = 'Include all',
}
