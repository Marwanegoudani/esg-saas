import axios from 'axios';
import { Company, ESGData } from '../types';
import { ReportConfig, ReportTemplate, AutomatedSchedule } from '../types/reports';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

export const api = {
  companies: {
    getAll: () => axiosInstance.get<Company[]>('/api/companies'),
    getById: (id: number | string) => axiosInstance.get<Company>(`/api/companies/${id}`),
    create: (data: Partial<Company>) => axiosInstance.post<Company>('/api/companies', data),
  },
  esgData: {
    getAll: () => axiosInstance.get<ESGData[]>('/api/esg-data'),
    getByCompanyId: (id: number) => axiosInstance.get<ESGData[]>(`/api/esg-data/company/${id}`),
  },
  reports: {
    generate: (config: ReportConfig) => axiosInstance.post('/reports/generate', {
      format: config.format === 'excel' ? 'xlsx' : config.format,
      sections: config.sections,
      company_id: config.company_id,
    }, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        'Accept': config.format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf',
      },
    }),
    scheduleReport: (config: AutomatedSchedule) => axiosInstance.post('/reports/schedule', config),
    getTemplates: () => axiosInstance.get<ReportTemplate[]>('/reports/templates'),
    saveTemplate: (template: ReportTemplate) => axiosInstance.post<ReportTemplate>('/reports/templates', template),
  },
};