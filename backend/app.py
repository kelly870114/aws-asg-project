from flask import Flask, jsonify
# from flask_sqlalchemy import SQLAlchemy
from flaskext.mysql import MySQL
from flask_cors import CORS
# db = SQLAlchemy()

app = Flask(__name__)
mysql = MySQL()
CORS(app)

# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://admin:x.fV5+nGQ(Z&nzO+tx9Dhy.04VGR@project-db-server.ca9eyo6nclrw.us-west-1.rds.amazonaws.com:3306/aws-project"
 
app.config['MYSQL_DATABASE_USER'] = 'admin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'pvC+Jno3):nHY13Iv_lWg+X}!(WA'
app.config['MYSQL_DATABASE_DB'] = 'aws-project'
app.config['MYSQL_DATABASE_HOST'] = 'project-db-server.ca9eyo6nclrw.us-west-1.rds.amazonaws.com'
mysql.init_app(app)

@app.route("/")
def home():
    return "Hello, Flask!"


@app.route("/members")
def members():
    try:
        conn = mysql.connect()
        cursor = conn.cursor()

        sql_cmd = 'SELECT * FROM members;'  # Select all columns from the 'members' table
        cursor.execute(sql_cmd)
        data = cursor.fetchall()

        employees = []
        for row in data:
            employee = {
                'member_id': row[0],
                'member_name': row[1],
                'job_title': row[2],
                # Add other columns here if available in the 'members' table
            }
            employees.append(employee)

        return jsonify(employees)

    except Exception as e:
        return jsonify({'error': str(e)})
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    app.run()

@app.route("/kudos")
def kudos():
    try:
        conn = mysql.connect()
        cursor = conn.cursor()

        sql_cmd = '''
            SELECT k.kudos_id, k.kudos_title, k.from_id, k.to_id, k.message, 
                   m.member_id, m.member_name, m.job_title
            FROM `aws-project`.kudos AS k
            INNER JOIN `aws-project`.members AS m ON m.member_id = k.to_id;
        '''
        cursor.execute(sql_cmd)
        data = cursor.fetchall()

        allKudos = []
        for row in data:
            kudos = {
                'kudos_id': row[0],
                'kudos_title': row[1],
                'from_id': row[2],
                'to_id': row[3],
                'message': row[4],
                'member_id': row[5],
                'member_name': row[6],
                'job_title': row[7],
                'sender_name': None,  # Initialize the sender_name to None
                # Add other columns here if available in the 'members' table
            }
            allKudos.append(kudos)

        # Fetch the name of the sender for each kudos
        for kudo in allKudos:
            sql_cmd = '''
                SELECT member_name FROM `aws-project`.members
                WHERE member_id = %s;
            '''
            cursor.execute(sql_cmd, (kudo['from_id'],))
            sender_name = cursor.fetchone()
            kudo['sender_name'] = sender_name[0] if sender_name else None

        return jsonify(allKudos)

    except Exception as e:
        return jsonify({'error': str(e)})
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    app.run()