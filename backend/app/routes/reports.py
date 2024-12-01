from flask import Blueprint, send_file, request, jsonify, current_app
from flask_cors import cross_origin
from app.services.report_generator import ReportGenerator
from app.models.company import Company
from app.models.esg_data import ESGData
from fpdf import FPDF
import pandas as pd
import os
import logging
import traceback
from datetime import datetime

reports = Blueprint('reports', __name__)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def generate_excel_report(company, esg_data, sections):
    # Create a dictionary to store all data
    data = {
        'Company Name': [company.name],
        'Industry': [company.industry],
        'Size': [company.size],
        'Country': [company.country],
        'Report Date': [datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
    }
    
    if sections.get('overview', False):
        data.update({
            'Description': [company.description],
            'Environmental Highlight': [company.environmental_highlight],
            'Social Highlight': [company.social_highlight],
            'Governance Highlight': [company.governance_highlight]
        })
        
    if sections.get('environmental', False):
        data.update({
            'CO2 Emissions (tonnes)': [esg_data.co2_emissions],
            'Energy Consumption (MWh)': [esg_data.energy_consumption],
            'Renewable Energy (%)': [esg_data.renewable_energy_percent],
            'Water Usage (m³)': [esg_data.water_usage]
        })
        
    if sections.get('social', False):
        data.update({
            'Board Diversity (%)': [esg_data.board_diversity],
            'Ethics Violations': [esg_data.ethics_violations]
        })
        
    if sections.get('governance', False):
        data.update({
            'Board Diversity (%)': [esg_data.board_diversity],
            'Ethics Violations': [esg_data.ethics_violations]
        })
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Create Excel file path
    temp_dir = os.path.join(current_app.root_path, 'temp')
    os.makedirs(temp_dir, exist_ok=True)
    temp_file = os.path.join(temp_dir, f'esg_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx')
    
    # Write to Excel
    df.to_excel(temp_file, index=False, engine='xlsxwriter')
    
    return temp_file


@reports.route('/reports/generate', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'])
def generate_report():
    try:
        logger.debug('Received report generation request')
        config = request.get_json()
        logger.debug(f'Config received: {config}')
        
        # Get company_id from request
        company_id = config.get('company_id')
        if not company_id:
            return jsonify({'error': 'company_id is required'}), 400
            
        # Get specific company
        company = Company.query.get(company_id)
        if not company:
            return jsonify({'error': f'No company found with id {company_id}'}), 404
            
        esg_data = ESGData.query.filter_by(company_id=company.id).order_by(ESGData.date.desc()).first()
        if not esg_data:
            return jsonify({'error': f'No ESG data found for company {company.name}'}), 404
        
        # Create temp directory
        temp_dir = os.path.join(current_app.root_path, 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        
        # Generate backup Excel file first
        backup_file = os.path.join(temp_dir, 'backup.xlsx')
        df = pd.DataFrame(data={
            'Company Name': [company.name],
            'Industry': [company.industry],
            'Size': [company.size],
            'Country': [company.country],
            'Report Date': [datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
        })
        df.to_excel(backup_file, index=False)
        logger.debug(f"Backup Excel file created at: {backup_file}")
        
        # Generate requested format
        if config.get('format', '').lower() in ['excel', 'xlsx']:
            temp_file = generate_excel_report(company, esg_data, config.get('sections', {}))
            mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            download_name = 'ESG_Report_{}.xlsx'.format(datetime.now().strftime("%Y-%m-%d"))
        else:
            pdf = FPDF()
            
            # Set up document properties
            pdf.set_title(f'ESG Report - {company.name}')
            pdf.set_author('Sustain.ai')
            pdf.set_creator('Sustain.ai')
            
            # Cover page
            pdf.add_page()
            
            # Add logo
            logo_path = os.path.join(current_app.root_path, 'static', 'logo.png')
            if os.path.exists(logo_path):
                pdf.image(logo_path, x=75, y=20, w=60)
            
            # Title section with reduced spacing after logo
            pdf.ln(45)  # Reduced from 70 to bring title closer to logo
            pdf.set_font('Arial', 'B', 28)
            pdf.cell(190, 15, 'ESG Analytics Report', ln=True, align='C')
            pdf.ln(8)
            pdf.set_font('Arial', 'B', 20)
            pdf.cell(190, 15, f'Annual Assessment {datetime.now().year}', ln=True, align='C')
            
            pdf.ln(20)
            pdf.set_font('Arial', 'B', 28)
            pdf.cell(190, 15, company.name, ln=True, align='C')
            
            # Add decorative line under company name
            pdf.ln(8)
            pdf.set_draw_color(43, 75, 128)
            pdf.set_line_width(0.5)
            pdf.line(30, pdf.get_y(), 180, pdf.get_y())
            
            # Company details centered with more spacing
            pdf.ln(30)
            pdf.set_font('Arial', 'B', 12)
            pdf.cell(190, 8, f'Industry: {company.industry}', ln=True, align='C')
            pdf.ln(5)
            pdf.cell(190, 8, f'Location: {company.country}', ln=True, align='C')
            pdf.ln(5)
            pdf.cell(190, 8, f'Report Period: FY {datetime.now().year}', ln=True, align='C')
            
            # Add report details with more spacing
            pdf.ln(30)
            pdf.set_font('Arial', 'I', 11)
            pdf.cell(190, 8, f'Generated on {datetime.now().strftime("%B %d, %Y")}', ln=True, align='C')
            pdf.cell(190, 8, 'Powered by Sustain.ai Analytics Platform', ln=True, align='C')
            
            # Add confidentiality notice
            pdf.ln(30)
            pdf.set_fill_color(243, 243, 243)
            pdf.rect(25, pdf.get_y(), 160, 25, 'F')
            pdf.ln(5)
            pdf.set_font('Arial', 'B', 10)
            pdf.cell(190, 5, 'CONFIDENTIAL', ln=True, align='C')
            pdf.set_font('Arial', '', 9)
            pdf.multi_cell(190, 4,
                'This document contains confidential information. Unauthorized disclosure or reproduction '
                'is strictly prohibited and may result in legal action.',
                align='C')
            
            # Professional footer
            pdf.ln(20)
            pdf.set_font('Arial', '', 10)
            pdf.cell(63, 5, 'www.sustain.ai', align='C')
            pdf.cell(64, 5, 'support@sustain.ai', align='C')
            pdf.cell(63, 5, '+1 (555) 123-4567', align='C', ln=True)
            
            # Table of contents
            pdf.add_page()
            pdf.set_font('Arial', 'B', 16)
            pdf.cell(190, 10, 'Table of Contents', ln=True)
            pdf.ln(10)  # More space after title
            
            sections = config.get('sections', {})
            current_page = 3  # Start after cover and contents
            
            def add_toc_entry(number, title, page):
                text = f"{number}. {title}"
                dots = "." * (40 - len(text))  # Adjust number of dots
                pdf.cell(190, 8, f"{text} {dots} {page}", ln=True)
            
            if sections.get('overview', False):
                add_toc_entry(1, "Company Overview", current_page)
                current_page += 1
            if sections.get('environmental', False):
                add_toc_entry(2, "Environmental Metrics", current_page)
                current_page += 1
            if sections.get('social', False):
                add_toc_entry(3, "Social Metrics", current_page)
                current_page += 1
            if sections.get('governance', False):
                add_toc_entry(4, "Governance Metrics", current_page)
                current_page += 1
            if sections.get('risks', False):
                add_toc_entry(5, "Risk Assessment", current_page)
            
            # Helper function for metric tables
            def add_metric_row(pdf, label, value, first=False):
                if not first:
                    pdf.ln(1)
                pdf.set_fill_color(240, 240, 240)
                pdf.cell(95, 8, label, border=1, fill=True)
                pdf.cell(95, 8, str(value), border=1)
                pdf.ln()
            
            # Overview Section
            if sections.get('overview', False):
                pdf.add_page()
                pdf.set_font('Arial', 'B', 16)
                pdf.cell(190, 15, '1. Company Overview', ln=True)
                pdf.ln(5)
                
                pdf.set_font('Arial', '', 12)
                pdf.multi_cell(190, 8, company.description)
                pdf.ln(10)
                
                # Company details table
                add_metric_row(pdf, 'Industry', company.industry, True)
                add_metric_row(pdf, 'Size', company.size)
                add_metric_row(pdf, 'Country', company.country)
            
            # Environmental Section
            if sections.get('environmental', False):
                pdf.add_page()
                pdf.set_font('Arial', 'B', 16)
                pdf.cell(190, 15, '2. Environmental Metrics', ln=True)
                pdf.ln(5)
                
                add_metric_row(pdf, 'CO2 Emissions', f"{esg_data.co2_emissions} tonnes", True)
                add_metric_row(pdf, 'Energy Consumption', f"{esg_data.energy_consumption} MWh")
                add_metric_row(pdf, 'Renewable Energy', f"{esg_data.renewable_energy_percent}%")
                add_metric_row(pdf, 'Water Usage', f"{esg_data.water_usage} m³")
                
                pdf.ln(10)
                pdf.set_font('Arial', 'B', 12)
                pdf.cell(190, 8, 'Environmental Highlight:', ln=True)
                pdf.set_font('Arial', '', 12)
                pdf.multi_cell(190, 8, company.environmental_highlight)
            
            if sections.get('social', False):
                pdf.add_page()
                pdf.set_font('Arial', 'B', 16)
                pdf.cell(190, 15, '3. Social Metrics', ln=True)
                pdf.ln(5)
                
                add_metric_row(pdf, 'Employee Count', f"{esg_data.employee_count:,.0f}", True)
                add_metric_row(pdf, 'Diversity Ratio', f"{esg_data.diversity_ratio:.2f}%")
                add_metric_row(pdf, 'Safety Incidents', f"{esg_data.safety_incidents}")
                add_metric_row(pdf, 'Training Hours', f"{esg_data.training_hours:,.0f} hours")
                
                pdf.ln(10)
                pdf.set_font('Arial', 'B', 12)
                pdf.cell(190, 8, 'Social Highlight:', ln=True)
                pdf.set_font('Arial', '', 12)
                pdf.multi_cell(190, 8, company.social_highlight)
            
            if sections.get('governance', False):
                pdf.add_page()
                pdf.set_font('Arial', 'B', 16)
                pdf.cell(190, 15, '4. Governance Metrics', ln=True)
                pdf.ln(5)
                
                add_metric_row(pdf, 'Board Independence', f"{getattr(esg_data, 'board_independence', 'N/A')}%", True)
                add_metric_row(pdf, 'Ethics Policy', getattr(esg_data, 'ethics_policy', 'N/A'))
                add_metric_row(pdf, 'Data Breaches', str(getattr(esg_data, 'data_breaches', 'N/A')))
                add_metric_row(pdf, 'Ethics Violations', str(getattr(esg_data, 'ethics_violations', 'N/A')))
                
                pdf.ln(10)
                pdf.set_font('Arial', 'B', 12)
                pdf.cell(190, 8, 'Governance Highlight:', ln=True)
                pdf.set_font('Arial', '', 12)
                pdf.multi_cell(190, 8, company.governance_highlight)
                
            if sections.get('risks', False):
                pdf.add_page()
                pdf.set_font('Arial', 'B', 16)
                pdf.cell(190, 15, '5. Risk Assessment', ln=True)
                pdf.ln(5)
                
                add_metric_row(pdf, 'Environmental Risks', getattr(esg_data, 'environmental_risks', 'N/A'), True)
                add_metric_row(pdf, 'Social Risks', getattr(esg_data, 'social_risks', 'N/A'))
                add_metric_row(pdf, 'Governance Risks', getattr(esg_data, 'governance_risks', 'N/A'))
                
                pdf.ln(10)
                pdf.set_font('Arial', 'B', 12)
            
            temp_file = os.path.join(temp_dir, f'esg_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf')
            pdf_content = pdf.output(dest='S').encode('latin-1')
            with open(temp_file, 'wb') as f:
                f.write(pdf_content)
            mimetype = 'application/pdf'
            download_name = 'ESG_Report_{}.pdf'.format(datetime.now().strftime("%Y-%m-%d"))
        
        logger.debug(f"Generated requested file at: {temp_file}")
        
        return send_file(
            temp_file,
            mimetype=mimetype,
            as_attachment=True,
            download_name=download_name
        )
        
    except Exception as e:
        logger.error('Error generating report:')
        logger.error(traceback.format_exc())
        return jsonify({
            'error': 'Failed to generate report',
            'details': str(e)
        }), 500