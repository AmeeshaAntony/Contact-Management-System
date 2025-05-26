import sqlite3
import os

def update_database():
    # Connect to the database
    conn = sqlite3.connect('instance/contacts.db')
    cursor = conn.cursor()

    try:
        # Create a new table with the desired schema
        cursor.execute('''
            CREATE TABLE users_new (
                id INTEGER PRIMARY KEY,
                first_name VARCHAR(55) NOT NULL,
                last_name VARCHAR(55) NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,
                password VARCHAR(200) NOT NULL,
                phone VARCHAR(15),
                profile_pic VARCHAR(500)
            )
        ''')

        # Copy data from the old table to the new one
        cursor.execute('''
            INSERT INTO users_new (id, first_name, last_name, email, password, phone, profile_pic)
            SELECT id, name, 'User', email, password, phone, profile_pic
            FROM users
        ''')

        # Drop the old table
        cursor.execute('DROP TABLE users')

        # Rename the new table to the original name
        cursor.execute('ALTER TABLE users_new RENAME TO users')

        # Commit the changes
        conn.commit()
        print("Database updated successfully!")
        
    except sqlite3.OperationalError as e:
        print(f"Error updating database: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    update_database() 