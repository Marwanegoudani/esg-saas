export interface Company {
  id: number;
  name: string;
  industry: string;
  size: string;
  country: string;
  description?: string;
  environmental_highlight?: string;
  social_highlight?: string;
  governance_highlight?: string;
}

export interface ESGMetrics {
  environmental: {
    co2_emissions: number;
    energy_consumption: number;
    water_usage: number;
    waste_generated: number;
    renewable_energy_percent: number;
  };
  social: {
    employee_count: number;
    diversity_ratio: number;
    safety_incidents: number;
    training_hours: number;
    community_investment: number;
  };
  governance: {
    board_independence: number;
    board_diversity: number;
    ethics_violations: number;
    data_breaches: number;
  };
}

export interface ESGData extends ESGMetrics {
  id: number;
  company_id: number;
  date: string;
}

export interface ChartData {
  date: string;
  environmental: ESGMetrics['environmental'];
  social: ESGMetrics['social'];
  governance: ESGMetrics['governance'];
} 