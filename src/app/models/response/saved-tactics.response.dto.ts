import { Strategy } from "../request/generate-strategy.request.dto";

export class SavedTacticsResponseDto {
  name: string;
  content: string;
  opponentClub: string;
  club: string;
  type: Strategy
}
