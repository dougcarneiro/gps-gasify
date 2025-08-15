export interface DailyReportResult {
  date: string; // Date string YYYY-MM-DD
  count: number;
}

export interface ReceivedGroup {
  bionexo?: DailyReportResult[];
  sintese?: DailyReportResult[];
  apoio?: DailyReportResult[];
  copilotemails?: DailyReportResult[];
}

export interface RobotResponsesReport {
  results?: DailyReportResult[];
  receivedGroup?: ReceivedGroup;
  total: number | null;
}

