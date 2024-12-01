from app.extensions import db
from datetime import datetime

class ESGData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Environmental Metrics
    co2_emissions = db.Column(db.Float)  # tonnes CO2e
    energy_consumption = db.Column(db.Float)  # MWh
    water_usage = db.Column(db.Float)  # m3
    waste_generated = db.Column(db.Float)  # tonnes
    renewable_energy_percent = db.Column(db.Float)  # %
    
    # Social Metrics
    employee_count = db.Column(db.Integer)
    diversity_ratio = db.Column(db.Float)  # %
    safety_incidents = db.Column(db.Integer)
    training_hours = db.Column(db.Float)  # hours per employee
    community_investment = db.Column(db.Float)  # currency
    
    # Governance Metrics
    board_independence = db.Column(db.Float)  # %
    board_diversity = db.Column(db.Float)  # %
    ethics_violations = db.Column(db.Integer)
    data_breaches = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'company_id': self.company_id,
            'date': self.date.isoformat(),
            'environmental': {
                'co2_emissions': self.co2_emissions,
                'energy_consumption': self.energy_consumption,
                'water_usage': self.water_usage,
                'waste_generated': self.waste_generated,
                'renewable_energy_percent': self.renewable_energy_percent
            },
            'social': {
                'employee_count': self.employee_count,
                'diversity_ratio': self.diversity_ratio,
                'safety_incidents': self.safety_incidents,
                'training_hours': self.training_hours,
                'community_investment': self.community_investment
            },
            'governance': {
                'board_independence': self.board_independence,
                'board_diversity': self.board_diversity,
                'ethics_violations': self.ethics_violations,
                'data_breaches': self.data_breaches
            }
        }
