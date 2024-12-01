from app import create_app
from app.extensions import db
from app.models.company import Company
from app.models.esg_data import ESGData
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # Print to console
        logging.FileHandler('app.log')  # Save to file
    ]
)

logger = logging.getLogger(__name__)
app = create_app()

def add_test_data():
    try:
        # Add a test company with the new fields
        company = Company(
            name="Test Company",
            industry="Technology",
            size="Large",
            country="USA",
            description="A leading technology company focused on innovation",
            environmental_highlight="Achieved carbon neutrality in 2023",
            social_highlight="Implemented diverse hiring practices",
            governance_highlight="Strong board oversight and transparency"
        )
        db.session.add(company)
        db.session.commit()
        logger.info(f"Added test company: {company.name}")

        # Add ESG data for the company
        esg_data = ESGData(
            company_id=company.id,
            board_diversity=35.5,
            ethics_violations=2,
            # Add other fields as needed
        )
        db.session.add(esg_data)
        db.session.commit()
        logger.info(f"Added ESG data for company: {company.name}")

    except Exception as e:
        logger.error(f"Error adding test data: {str(e)}")
        raise

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            # Check if data exists
            if not Company.query.first():
                logger.info("No companies found, adding test data")
                add_test_data()
            else:
                logger.info("Database already contains data")
        except Exception as e:
            logger.error(f"Error initializing database: {str(e)}")
            
    app.run(debug=True)
