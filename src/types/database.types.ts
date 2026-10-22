// Types για την εφαρμογή Ιστορικοί Δεσμοί

export type School = {
  id: string;
  name: string;
  city: string;
  region: string;
  created_at: string;
};

export type Team = {
  id: string;
  school_id: string;
  name: string;
  active: boolean;
};

export type EntryStatus = 'draft' | 'submitted' | 'returned' | 'approved' | 'archived';

export type HistoricalEntry = {
  id: string;
  school_id: string;
  team_id: string;
  title: string;
  date_display: string;
  year_numeric: number;
  period_tag: string;
  location_tag?: string; // π.χ. 'thasos', 'chania', 'kavala', 'alexandria', 'constantinople'
  historical_context: string;
  research_question: string;
  interpretation: string;
  partner_comment?: string | null;
  partner_team_id?: string | null;
  status: EntryStatus;
  teacher_feedback?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  school?: School;
  team?: Team;
  sources?: Source[];
};

export type SourceType = 'document' | 'photograph' | 'oral_history' | 'newspaper' | 'artifact' | 'video_link';

export type Source = {
  id: string;
  entry_id: string;
  title: string;
  source_type: SourceType;
  origin_holder: string;
  source_url?: string | null;
  licence_type: string;
  critique_notes: string;
  created_at: string;
};

export type TeamSession = {
  team_id: string;
  team_name: string;
  school_name: string;
  school_id: string;
};
