from flask import Flask
from flask_cors import CORS
from config import Config
from .extensions import db, migrate, jwt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions with app context
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Register blueprints
    from app.routes.api import api
    from app.routes.reports import reports
    
    app.register_blueprint(api)
    app.register_blueprint(reports)
    
    # Ensure the instance folder exists
    import os
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
        
    return app
