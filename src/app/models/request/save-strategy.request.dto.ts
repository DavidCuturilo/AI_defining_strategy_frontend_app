import { Strategy } from './generate-strategy.request.dto';

export class SaveStrategyRequestDto {
  name: string;
  content: string;
  opponentClub: string;
  club: string;
  type: Strategy[];
  userId: number;
}
