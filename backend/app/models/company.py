from app.extensions import db

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    industry = db.Column(db.String(50))
    size = db.Column(db.String(20))  # Small, Medium, Large
    country = db.Column(db.String(50))
    description = db.Column(db.Text, nullable=True)
    
    # ESG Highlights
    environmental_highlight = db.Column(db.Text, nullable=True)
    social_highlight = db.Column(db.Text, nullable=True)
    governance_highlight = db.Column(db.Text, nullable=True)
    
    # Relation with ESG data
    esg_data = db.relationship('ESGData', backref='company', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'industry': self.industry,
            'size': self.size,
            'country': self.country,
            'description': self.description,
            'environmental_highlight': self.environmental_highlight,
            'social_highlight': self.social_highlight,
            'governance_highlight': self.governance_highlight
        }
