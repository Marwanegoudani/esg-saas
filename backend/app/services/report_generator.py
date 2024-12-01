from app.models.company import Company
from app.models.esg_data import ESGData
from app import db
from fpdf import FPDF
import pandas as pd
from datetime import datetime
import os
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class ReportGenerator:
    def __init__(self, data: Dict[str, Any]):
        self.data = data
        
        # Get company_id from the request data
        company_id = data.get('company_id')
        if not company_id:
            raise ValueError("company_id is required")
            
        # Query for specific company
        self.company = Company.query.get(company_id)
        if not self.company:
            raise ValueError(f"No company found with id {company_id}")
            
        self.esg_data = ESGData.query.filter_by(company_id=self.company.id).order_by(ESGData.date.desc()).first()
        if not self.esg_data:
            raise ValueError(f"No ESG data found for company {self.company.name}")
            
        self.temp_dir = os.path.join(os.getcwd(), 'temp')
        os.makedirs(self.temp_dir, exist_ok=True)

    def generate_pdf_report(self) -> bytes:
        try:
            logger.debug("Generating PDF report")
            pdf = FPDF()
            pdf.add_page()
            
            # Add title
            pdf.set_font('Arial', 'B', 16)
            pdf.cell(190, 10, f'ESG Report - {self.company.name}', ln=True, align='C')
            
            # Add date
            pdf.set_font('Arial', '', 10)
            pdf.cell(190, 10, f'Generated on: {datetime.now().strftime("%Y-%m-%d")}', ln=True, align='R')
            
            # Add sections based on config
            if self.data['sections'].get('overview', False):
                self._add_overview_section(pdf)
            if self.data['sections'].get('environmental', False):
                self._add_environmental_section(pdf)
            if self.data['sections'].get('social', False):
                self._add_social_section(pdf)
            if self.data['sections'].get('governance', False):
                self._add_governance_section(pdf)
                
            return pdf.output(dest='S').encode('latin-1')
            
        except Exception as e:
            logger.error(f"Error generating PDF report: {str(e)}")
            raise

    def generate_excel_report(self) -> bytes:
        try:
            logger.debug("Generating Excel report")
            data = {
                'Company': self.company.name,
                'Date': datetime.now().strftime("%Y-%m-%d"),
            }
            
            if self.data['sections'].get('environmental', False):
                data.update({
                    'CO2 Emissions': self.esg_data.co2_emissions,
                    'Energy Consumption': self.esg_data.energy_consumption,
                    'Water Usage': self.esg_data.water_usage,
                    'Renewable Energy %': self.esg_data.renewable_energy_percent,
                })
                
            if self.data['sections'].get('social', False):
                data.update({
                    'Employee Count': self.esg_data.employee_count,
                    'Diversity Ratio': self.esg_data.diversity_ratio,
                    'Safety Incidents': self.esg_data.safety_incidents,
                    'Training Hours': self.esg_data.training_hours,
                })
                
            if self.data['sections'].get('governance', False):
                data.update({
                    'Board Diversity': self.esg_data.board_diversity,
                    'Ethics Violations': self.esg_data.ethics_violations,
                    'Data Breaches': self.esg_data.data_breaches,
                })
                
            df = pd.DataFrame([data])
            excel_buffer = pd.ExcelWriter(os.path.join(self.temp_dir, 'temp.xlsx'), engine='xlsxwriter')
            df.to_excel(excel_buffer, index=False)
            excel_buffer.save()
            
            with open(os.path.join(self.temp_dir, 'temp.xlsx'), 'rb') as f:
                return f.read()
                
        except Exception as e:
            logger.error(f"Error generating Excel report: {str(e)}")
            raise

    def _add_overview_section(self, pdf: FPDF):
        pdf.add_page()
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(190, 10, '1. Company Overview', ln=True)
        
        # Create table with company info
        data = [
            ['Company Name', self.company.name],
            ['Industry', self.company.industry],
            ['Size', self.company.size],
            ['Country', self.company.country]
        ]
        
        # Set up table formatting
        pdf.set_font('Arial', '', 10)
        line_height = 6
        
        # Draw table
        for i, row in enumerate(data):
            if i % 2 == 1:
                pdf.set_fill_color(240, 248, 255)
            else:
                pdf.set_fill_color(255, 255, 255)
            
            pdf.cell(90, line_height, row[0], 1, 0, 'L', True)
            pdf.cell(100, line_height, row[1], 1, 1, 'L', True)
        
        # Add description
        pdf.ln(10)
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(190, 6, 'Company Description:', ln=True)
        pdf.set_font('Arial', '', 10)
        pdf.multi_cell(190, 5, self.company.description)

    def _add_environmental_section(self, pdf: FPDF):
        pdf.add_page()
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(190, 10, 'Environmental Metrics', ln=True)
        pdf.set_font('Arial', '', 10)
        pdf.multi_cell(190, 10, f"""
        CO2 Emissions: {self.esg_data.co2_emissions} tonnes CO2e
        Energy Consumption: {self.esg_data.energy_consumption} MWh
        Water Usage: {self.esg_data.water_usage} m3
        Renewable Energy: {self.esg_data.renewable_energy_percent}%
        
        Highlight: {self.company.environmental_highlight}
        """)

    def _add_social_section(self, pdf: FPDF):
        pdf.add_page()
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(190, 10, '3. Social Metrics', ln=True)
        
        # Create table with same formatting
        data = [
            ['Employee Count', f'{self.esg_data.employee_count:,.0f}'],
            ['Diversity Ratio', f'{self.esg_data.diversity_ratio:.2f}%'],
            ['Safety Incidents', f'{self.esg_data.safety_incidents}'],
            ['Training Hours', f'{self.esg_data.training_hours:,.0f} hours']
        ]
        
        # Set up table formatting
        pdf.set_font('Arial', '', 10)
        line_height = 6
        
        # Draw table with alternating background
        for i, row in enumerate(data):
            # Add light blue background for even rows
            if i % 2 == 1:
                pdf.set_fill_color(240, 248, 255)  # Light blue
            else:
                pdf.set_fill_color(255, 255, 255)  # White
            
            # Draw cells with borders
            pdf.cell(90, line_height, row[0], 1, 0, 'L', True)
            pdf.cell(100, line_height, row[1], 1, 1, 'L', True)
        
        # Add highlight section with same formatting
        pdf.ln(10)
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(190, 6, 'Social Highlight:', ln=True)
        pdf.set_font('Arial', '', 10)
        pdf.multi_cell(190, 5, self.company.social_highlight)

    def _add_governance_section(self, pdf: FPDF):
        pdf.add_page()
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(190, 10, '4. Governance Metrics', ln=True)
        
        # Create table with governance metrics
        data = [
            ['Board Independence', f'{getattr(self.esg_data, "board_independence", "N/A")}%'],
            ['Ethics Policy', getattr(self.esg_data, 'ethics_policy', 'N/A')],
            ['Data Breaches', str(getattr(self.esg_data, 'data_breaches', 'N/A'))],
            ['Ethics Violations', str(getattr(self.esg_data, 'ethics_violations', 'N/A'))]
        ]
        
        # Set up table formatting
        pdf.set_font('Arial', '', 10)
        line_height = 6
        
        # Draw table
        for i, row in enumerate(data):
            if i % 2 == 1:
                pdf.set_fill_color(240, 248, 255)
            else:
                pdf.set_fill_color(255, 255, 255)
            
            pdf.cell(90, line_height, row[0], 1, 0, 'L', True)
            pdf.cell(100, line_height, row[1], 1, 1, 'L', True)
        
        # Add highlight
        pdf.ln(10)
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(190, 6, 'Governance Highlight:', ln=True)
        pdf.set_font('Arial', '', 10)
        pdf.multi_cell(190, 5, self.company.governance_highlight)

    def _add_risks_section(self, pdf: FPDF):
        pdf.add_page()
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(190, 10, '5. Risk Assessment', ln=True)
        
        # Create table with risk metrics
        data = [
            ['Environmental Risks', getattr(self.esg_data, 'environmental_risks', 'N/A')],
            ['Social Risks', getattr(self.esg_data, 'social_risks', 'N/A')],
            ['Governance Risks', getattr(self.esg_data, 'governance_risks', 'N/A')]
        ]
        
        # Set up table formatting
        pdf.set_font('Arial', '', 10)
        line_height = 6
        
        # Draw table
        for i, row in enumerate(data):
            if i % 2 == 1:
                pdf.set_fill_color(240, 248, 255)
            else:
                pdf.set_fill_color(255, 255, 255)
            
            pdf.cell(90, line_height, row[0], 1, 0, 'L', True)
            pdf.cell(100, line_height, row[1], 1, 1, 'L', True)
