export interface User {
  id: string;
  name: string;
  sex: string;
  month: string;
  day: string;
  year: string;
  countryCode: string;
  phone: string;
  createdAt: string;
  notes?: string;
  daysAvailable?: string[];
  fromTime?: string;
  toTime?: string;
  frequency?: string;
  callbacksPerDay?: number;
  personalContext?: string;
  receivingCalls?: boolean;
} 