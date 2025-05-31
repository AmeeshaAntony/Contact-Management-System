import os
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from app.models import Contact, User
from app.app_setup import db, bcrypt, mail
from datetime import datetime, timedelta # Import datetime and timedelta
import secrets # Import secrets for token generation
from flask_mail import Message  # Add this import

api = Blueprint('api', __name__)

@api.route('/register', methods=['POST'])
def register():
    try:
        data = request.form
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone', None)  # Make phone optional
        date_of_birth_str = data.get('date_of_birth', None)  # Get date_of_birth from form data

        print(f"Received registration data: first_name={first_name}, last_name={last_name}, email={email}, phone={phone}, date_of_birth={date_of_birth_str}")  # Debug log

        if not first_name or not last_name or not email or not password:
            return jsonify({"error": "Missing required fields"}), 400

        # check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 409

        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Create new user
        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=hashed_pw
        )

        # Add phone if provided
        if phone:
            new_user.phone = phone

        # Add date_of_birth if provided
        if date_of_birth_str:
            try:
                from datetime import datetime
                new_user.date_of_birth = datetime.strptime(date_of_birth_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Invalid date format for date of birth"}), 400

        # Handle profile picture upload if provided
        if 'profile_pic' in request.files:
            file = request.files['profile_pic']
            if file.filename != '':
                try:
                    # Create uploads directory if it doesn't exist
                    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
                    os.makedirs(upload_folder, exist_ok=True)
                    print(f"Upload folder path: {upload_folder}")  # Debug log

                    # Secure the filename and save the file
                    filename = secure_filename(f"profile_{email}_{file.filename}")
                    file_path = os.path.join(upload_folder, filename)
                    file.save(file_path)
                    print(f"File saved at: {file_path}")  # Debug log

                    # Set the profile picture path
                    new_user.profile_pic = f"/static/uploads/{filename}"
                except Exception as e:
                    print(f"Error saving profile picture: {str(e)}")  # Debug log
                    return jsonify({"error": f"Failed to save profile picture: {str(e)}"}), 500

        try:
            db.session.add(new_user)
            db.session.commit()
            print(f"User registered successfully: {email}")  # Debug log
            return jsonify({"message": "User registered successfully"}), 201
        except Exception as e:
            db.session.rollback()
            print(f"Database error: {str(e)}")  # Debug log
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        print(f"Registration error: {str(e)}")  # Debug log
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


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

@api.route('/contacts/<int:id>', methods=['GET'])
def get_contact(id):
    contact = Contact.query.get(id)
    if not contact:
        return jsonify({'error': 'Contact not found'}), 404
    
    return jsonify({
        'id': contact.id,
        'name': contact.name,
        'phone': contact.phone,
        'email': contact.email,
        'user_id': contact.user_id
    }), 200

@api.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone": user.phone,
        "date_of_birth": user.date_of_birth.strftime('%Y-%m-%d') if user.date_of_birth else None,
        "profile_pic": user.profile_pic
    }), 200

@api.route('/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.form # Get form data for text fields
    
    # Check if email is being changed and if it's already taken
    if data.get('email') and data.get('email') != user.email:
        existing_user = User.query.filter_by(email=data.get('email')).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({"error": "Email already in use"}), 409

    # Update user details
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)
    user.phone = data.get('phone', user.phone)

    date_of_birth_str = data.get('date_of_birth')
    if date_of_birth_str:
        try:
            from datetime import datetime
            user.date_of_birth = datetime.strptime(date_of_birth_str, '%Y-%m-%d').date()
        except ValueError:
            # Handle cases where the date string is not in the expected format
            return jsonify({"error": "Invalid date format for date of birth"}), 400
    else:
        user.date_of_birth = None # Set to None if no date is provided or it's an empty string

    # Handle profile picture upload if provided in the PUT request
    if 'profile_pic' in request.files:
        file = request.files['profile_pic']
        if file.filename != '':
            try:
                # Create uploads directory if it doesn't exist (should already exist from registration)
                upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
                os.makedirs(upload_folder, exist_ok=True) # Ensure directory exists

                # Secure the filename and save the file
                # Using user_id and a part of the original filename to make it unique
                filename = secure_filename(f"profile_update_{user_id}_{file.filename}")
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)

                # Update user's profile_pic field with the new file path
                user.profile_pic = f"/static/uploads/{filename}"
            except Exception as e:
                print(f"Error saving profile picture during update: {str(e)}")
                return jsonify({"error": f"Failed to save profile picture: {str(e)}"}), 500

    try:
        db.session.commit()
        return jsonify({
            "message": "User updated successfully",
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": user.phone,
                "date_of_birth": user.date_of_birth.strftime('%Y-%m-%d') if user.date_of_birth else None,
                "profile_pic": user.profile_pic
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update user"}), 500

@api.route('/user/<int:user_id>/profile-pic', methods=['POST'])
def upload_profile_pic(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if 'profile_pic' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['profile_pic']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if file:
        # Create uploads directory if it doesn't exist
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)

        # Secure the filename and save the file
        filename = secure_filename(f"profile_{user_id}_{file.filename}")
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        # Update user's profile_pic field with the file path
        user.profile_pic = f"/static/uploads/{filename}"
        db.session.commit()

        return jsonify({
            "message": "Profile picture uploaded successfully",
            "profile_pic": user.profile_pic
        }), 200

    return jsonify({"error": "File upload failed"}), 400

@api.route('/user/<int:user_id>/change-password', methods=['PUT'])
def change_password(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return jsonify({"error": "Both current and new password are required"}), 400

    # Verify current password
    if not bcrypt.check_password_hash(user.password, current_password):
        return jsonify({"error": "Current password is incorrect"}), 401

    # Hash and update new password
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    user.password = hashed_password

    try:
        db.session.commit()
        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to change password"}), 500

@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()

    if user:
        # Generate a secure random token
        token = secrets.token_urlsafe(32)
        # Set token expiration time (e.g., 1 hour)
        expiration_time = datetime.utcnow() + timedelta(hours=1)

        user.reset_token = token
        user.reset_token_expiration = expiration_time
        db.session.commit()

        # Create the reset link
        reset_link = f"http://localhost:3000/reset-password/{token}"
        
        # Create and send the email
        try:
            msg = Message('Password Reset Request',
                        sender=current_app.config['MAIL_USERNAME'],
                        recipients=[user.email])
            msg.body = f'''To reset your password, visit the following link:
{reset_link}

If you did not make this request then simply ignore this email and no changes will be made.
'''
            mail.send(msg)
            print(f"Password reset email sent to {user.email}")
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return jsonify({"error": "Failed to send reset email"}), 500

        return jsonify({"message": "If a user with that email exists, a password reset link has been sent."}), 200
    else:
        # Return a generic message even if the user doesn't exist
        # to prevent leaking information about registered emails
        return jsonify({"message": "If a user with that email exists, a password reset link has been sent."}), 200

@api.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400

    # Find user with the given token
    user = User.query.filter_by(reset_token=token).first()

    if not user:
        return jsonify({"error": "Invalid or expired reset token"}), 400

    # Check if token has expired
    if user.reset_token_expiration < datetime.utcnow():
        return jsonify({"error": "Reset token has expired"}), 400

    # Hash the new password
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    
    # Update user's password and clear reset token
    user.password = hashed_password
    user.reset_token = None
    user.reset_token_expiration = None

    try:
        db.session.commit()
        return jsonify({"message": "Password has been reset successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to reset password"}), 500