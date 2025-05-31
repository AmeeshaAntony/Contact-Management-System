from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_mail import Mail

db = SQLAlchemy()
bcrypt = Bcrypt()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    # Email configuration
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'ameesha468@gmail.com'
    app.config['MAIL_PASSWORD'] = 'lies hmkh wocc wjdr'  # Replace with App Password from Google Account settings

    db.init_app(app)
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
    bcrypt.init_app(app)
    mail.init_app(app)
    from app.views import api 
    app.register_blueprint(api)

    return app
