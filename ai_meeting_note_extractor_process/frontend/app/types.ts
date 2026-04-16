export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
  priority: string;
}

export interface MeetingSummary {
  summary: string;
  action_items: ActionItem[];
  decisions: string[];
  attendees: string[];
}