from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from .extensions import db, migrate
from .routes.auth import auth
from .routes.api import api
from .routes.reports import reports

def create_app():
    app = Flask(__name__)
    
    # Use SQLite instead of PostgreSQL for now
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///esg.db'
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this in production!
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth)
    app.register_blueprint(api)
    app.register_blueprint(reports)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app
