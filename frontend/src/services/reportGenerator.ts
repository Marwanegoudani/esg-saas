import { api } from './api';

interface ReportConfig {
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

export const generateReport = async (config: ReportConfig) => {
  try {
    const response = await api.reports.generate(config);
    
    // Handle PDF/Excel download
    const blob = new Blob([response.data], {
      type: config.format === 'pdf' 
        ? 'application/pdf' 
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ESG_Report_${new Date().toISOString().split('T')[0]}.${config.format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // Clean up
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}; 