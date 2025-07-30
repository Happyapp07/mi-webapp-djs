export interface Event {
  id: string;
  planetId: string;
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: 'party' | 'broadcast' | 'release' | 'sale';
  status: 'upcoming' | 'live' | 'ended';
  participants: string[];
  capacity: number;
  currentAttendees: number;
  djLineup?: string[];
  genres?: string[];
  ticketPrice?: number;
  beatcoinRewards?: number;
}