export interface ReportConfig {
  format: string;
  sections: {
    overview: boolean;
    environmental: boolean;
    social: boolean;
    governance: boolean;
    risks: boolean;
    benchmarks: boolean;
  };
  company_id: number;
}

export interface ReportTemplate {
  id: number;
  name: string;
  description: string;
  isDefault: boolean;
}

export interface AutomatedSchedule {
  id: number;
  name: string;
  frequency: string;
  format: string;
  recipients: string[];
  active: boolean;
}

export interface ESGDisclosureConfig {
  standard: string;
  year: string;
} 