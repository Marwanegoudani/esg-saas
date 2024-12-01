from app import create_app, db
from app.models.company import Company
from app.models.esg_data import ESGData
from datetime import datetime, timedelta
import random

app = create_app()

def seed_data():
    with app.app_context():
        # Supprimer les données existantes
        ESGData.query.delete()
        Company.query.delete()
        
        # Créer quelques entreprises
        companies = [
            Company(
                name="Tech Innovators",
                industry="Technology",
                size="Large",
                country="France"
            ),
            Company(
                name="Green Energy Co",
                industry="Energy",
                size="Medium",
                country="Germany"
            ),
            Company(
                name="Sustainable Manufacturing",
                industry="Manufacturing",
                size="Large",
                country="Spain"
            )
        ]
        
        for company in companies:
            db.session.add(company)
        db.session.commit()

        # Ajouter des données ESG sur 12 mois pour chaque entreprise
        for company in companies:
            base_values = {
                'co2_emissions': random.uniform(80, 120),
                'energy_consumption': random.uniform(400, 600),
                'water_usage': random.uniform(800, 1200),
                'waste_generated': random.uniform(40, 60),
                'renewable_energy_percent': random.uniform(15, 25),
                'employee_count': random.randint(800, 1200),
                'diversity_ratio': random.uniform(35, 45),
                'safety_incidents': random.randint(8, 12),
                'training_hours': random.uniform(15, 25),
                'community_investment': random.uniform(40000, 60000),
                'board_independence': random.uniform(70, 80),
                'board_diversity': random.uniform(25, 35),
                'ethics_violations': random.randint(3, 7),
                'data_breaches': random.randint(1, 3)
            }

            for i in range(12):
                date = datetime.now() - timedelta(days=30*i)
                # Ajouter une variation aléatoire aux valeurs de base
                esg_data = ESGData(
                    company_id=company.id,
                    date=date,
                    **{k: v * (1 + random.uniform(-0.1, 0.1)) for k, v in base_values.items()}
                )
                db.session.add(esg_data)
        
        db.session.commit()
        print("Test data has been added successfully!")

if __name__ == "__main__":
    seed_data()
