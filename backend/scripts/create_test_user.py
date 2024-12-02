import sys
import os

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models.user import User

def create_test_user():
    app = create_app()
    
    with app.app_context():
        # Check if test user already exists
        if not User.query.filter_by(email='test@sustain.ai').first():
            user = User(
                email='test@sustain.ai',
                first_name='Test',
                last_name='User',
                role='user',
                is_active=True
            )
            user.set_password('password123')  # You can change this password
            
            db.session.add(user)
            db.session.commit()
            print("Test user created successfully!")
        else:
            print("Test user already exists!")

if __name__ == '__main__':
    create_test_user() 