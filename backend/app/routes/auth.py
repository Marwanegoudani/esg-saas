from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.extensions import db
import logging

auth = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

@auth.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401

        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401

        access_token = create_access_token(identity=user.id)
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        })

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@auth.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Check if user already exists
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'error': 'Email already registered'}), 400

        # Create new user
        user = User(
            email=data.get('email'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            company_id=data.get('company_id'),
            role='user'  # Default role
        )
        user.set_password(data.get('password'))

        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=user.id)
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        }), 201

    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Registration failed'}), 500

@auth.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify(user.to_dict())
    except Exception as e:
        logger.error(f"Get current user error: {str(e)}")
        return jsonify({'error': 'Failed to get user info'}), 500 