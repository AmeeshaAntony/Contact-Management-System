from flask import Blueprint, request, jsonify
from app.models import Contact, User
from app.app_setup import db, bcrypt

api = Blueprint('api', __name__)

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    # check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, email=email, password=hashed_pw)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Login successful", "user_id": user.id}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@api.route('/contacts', methods=['POST'])
def create_contact():
    data = request.get_json()
    name = data.get('name')
    phone = data.get('phone')
    email = data.get('email')
    user_id = data.get('user_id')

    if not name or not phone or not user_id:
        return jsonify({'error': 'Missing required fields'}), 400

    contact = Contact(name=name, phone=phone, email=email, user_id=user_id)
    db.session.add(contact)
    db.session.commit()

    return jsonify({'message': 'Contact created'}), 201

@api.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    result = []
    for contact in contacts:
        result.append({
            'id': contact.id,
            'name': contact.name,
            'phone': contact.phone,
            'email': contact.email,
            'user_id': contact.user_id
        })
    return jsonify(result), 200

@api.route('/contacts/<int:id>', methods=['PUT'])
def update_contact(id):
    contact = Contact.query.get(id)
    if not contact:
        return jsonify({'error': 'Contact not found'}), 404

    data = request.get_json()
    contact.name = data.get('name', contact.name)
    contact.phone = data.get('phone', contact.phone)
    contact.email = data.get('email', contact.email)

    db.session.commit()
    return jsonify({'message': 'Contact updated'}), 200

@api.route('/contacts/<int:id>', methods=['DELETE'])
def delete_contact(id):
    contact = Contact.query.get(id)
    if not contact:
        return jsonify({'error': 'Contact not found'}), 404

    db.session.delete(contact)
    db.session.commit()
    return jsonify({'message': 'Contact deleted'}), 200

@api.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email
    }), 200