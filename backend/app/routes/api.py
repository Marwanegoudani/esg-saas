from flask import Blueprint, jsonify, request
from app.models.company import Company
from app.models.esg_data import ESGData
from app import db
from datetime import datetime
from sqlalchemy.exc import OperationalError
import time

api = Blueprint('api', __name__)

@api.route('/api/companies', methods=['GET'])
def get_companies():
    companies = Company.query.all()
    return jsonify([company.to_dict() for company in companies])

@api.route('/api/companies/<int:company_id>', methods=['GET'])
def get_company(company_id):
    company = Company.query.get_or_404(company_id)
    return jsonify(company.to_dict())

@api.route('/api/esg-data/company/<int:company_id>', methods=['GET'])
def get_company_esg_data(company_id):
    esg_data = ESGData.query.filter_by(company_id=company_id).all()
    return jsonify([data.to_dict() for data in esg_data])

@api.route('/api/esg-data', methods=['GET'])
def get_all_esg_data():
    esg_data = ESGData.query.all()
    return jsonify([data.to_dict() for data in esg_data])

@api.route('/api/companies', methods=['POST'])
def create_company():
    data = request.json
    
    # Create new company with data from request
    company = Company(
        name=data.get('name'),
        industry=data.get('industry'),
        size=data.get('size'),
        country=data.get('country'),
        description=data.get('description'),
        environmental_highlight=data.get('environmental_highlight'),
        social_highlight=data.get('social_highlight'),
        governance_highlight=data.get('governance_highlight')
    )
    
    db.session.add(company)
    db.session.commit()
    
    return jsonify(company.to_dict()), 201

@api.route('/api/esg-data/batch', methods=['POST'])
def add_esg_data_batch():
    data = request.json
    results = []
    
    try:
        for entry in data['esg_data']:
            esg_data = ESGData(
                company_id=entry['company_id'],
                date=datetime.fromisoformat(entry['date']),
                # Environmental metrics
                co2_emissions=entry['environmental']['co2_emissions'],
                energy_consumption=entry['environmental']['energy_consumption'],
                water_usage=entry['environmental']['water_usage'],
                waste_generated=entry['environmental']['waste_generated'],
                renewable_energy_percent=entry['environmental']['renewable_energy_percent'],
                # Social metrics
                employee_count=entry['social']['employee_count'],
                diversity_ratio=entry['social']['diversity_ratio'],
                safety_incidents=entry['social']['safety_incidents'],
                training_hours=entry['social']['training_hours'],
                community_investment=entry['social']['community_investment'],
                # Governance metrics
                board_independence=entry['governance']['board_independence'],
                board_diversity=entry['governance']['board_diversity'],
                ethics_violations=entry['governance']['ethics_violations'],
                data_breaches=entry['governance']['data_breaches']
            )
            db.session.add(esg_data)
            results.append(esg_data)
        
        db.session.commit()
        return jsonify([data.to_dict() for data in results]), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route('/api/companies/batch-update', methods=['PUT'])
def update_companies_batch():
    data = request.json
    results = []
    max_retries = 3
    retry_delay = 0.5  # seconds
    
    try:
        for update in data['updates']:
            retries = 0
            while retries < max_retries:
                try:
                    company = Company.query.get(update['id'])
                    if company:
                        company.description = update.get('description', company.description)
                        company.environmental_highlight = update.get('environmental_highlight', company.environmental_highlight)
                        company.social_highlight = update.get('social_highlight', company.social_highlight)
                        company.governance_highlight = update.get('governance_highlight', company.governance_highlight)
                        results.append(company)
                        db.session.commit()
                        break
                except OperationalError as e:
                    if "database is locked" in str(e):
                        retries += 1
                        if retries == max_retries:
                            db.session.rollback()
                            return jsonify({'error': 'Database is locked. Please try again.'}), 503
                        time.sleep(retry_delay)
                    else:
                        raise
        
        return jsonify([company.to_dict() for company in results]), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
