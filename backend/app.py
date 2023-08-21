from flask import Flask, jsonify, request
from flaskext.mysql import MySQL
from flask_cors import CORS

app = Flask(__name__)
mysql_read = MySQL()
mysql_write = MySQL()
CORS(app)

app.config['MYSQL_DATABASE_USER'] = 'admin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'project-aurora'
app.config['MYSQL_DATABASE_DB'] = 'aws-project'
app.config['MYSQL_DATABASE_HOST'] = 'project-aurora-us-west-1b.ca9eyo6nclrw.us-west-1.rds.amazonaws.com'

mysql_read.init_app(app)

app.config['MYSQL_DATABASE_USER'] = 'admin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'project-aurora'
app.config['MYSQL_DATABASE_DB'] = 'aws-project'
app.config['MYSQL_DATABASE_HOST'] = 'project-aurora.ca9eyo6nclrw.us-west-1.rds.amazonaws.com'

mysql_write.init_app(app)

@app.route("/")
def home():
    return "Hello, Flask!"


@app.route("/members")
def members():
    try:
        conn = mysql_read.connect()
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
                'working_department': row[3],
                'member_avatar': row[4],
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

@app.route("/kudos", methods=["GET", "POST"])
def kudos():
    # Initialize conn outside the try block
    conn = None

    if request.method == "POST":
        try:
            data = request.json  # sending the kudos data as JSON in the request body
            from_id = 1
            to_id = data.get("to_id")
            message = data.get("message")

            # Add other fields as needed from the data

            # Establish database connection here
            conn = mysql_write.connect()
            cursor = conn.cursor()

            # Here, you can save the kudos data to the database using the provided fields
            insert_query = "INSERT INTO kudos (from_id, to_id, message) VALUES (%s, %s, %s)"
            cursor.execute(insert_query, (from_id, to_id, message))
            conn.commit()

            return jsonify({"message": "Kudos submitted successfully!"})

        except Exception as e:
            return jsonify({'error': str(e)}), 500

        finally:
            # Close the database connection in the finally block to ensure it's closed even if an exception occurs
            if conn is not None:
                conn.close()

    elif request.method == "GET":
        try:
            # Establish database connection here
            conn = mysql_read.connect()
            cursor = conn.cursor()

            sql_cmd = '''
                SELECT k.kudos_id, k.from_id, k.to_id, k.message, 
                       m.member_id, m.member_name, m.job_title, m.member_avatar
                FROM `aws-project`.kudos AS k
                INNER JOIN `aws-project`.members AS m ON m.member_id = k.to_id;
            '''
            cursor.execute(sql_cmd)
            data = cursor.fetchall()

            allKudos = []
            for row in data:
                kudos = {
                    'kudos_id': row[0],
                    'from_id': row[1],
                    'to_id': row[2],
                    'message': row[3],
                    'member_id': row[4],
                    'member_name': row[5],
                    'job_title': row[6],
                    'member_avatar': row[7],
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
            # Close the database connection in the finally block to ensure it's closed even if an exception occurs
            if conn is not None:
                conn.close()

# Update kudos
@app.route("/kudos/<int:kudos_id>", methods=["PUT"])
def update_kudos(kudos_id):
    # Initialize conn outside the try block
    conn = None
    try:
        
        data = request.json  # sending the kudos data as JSON in the request body
        print(data)
        to_id = data.get("to_id")
        message = data.get("message")

        # Add other fields as needed from the data
        conn = mysql_write.connect()
        # Here, you can update the kudos data in the database using the provided fields
        cursor = conn.cursor()
        update_query = "UPDATE kudos SET to_id = %s, message = %s WHERE kudos_id = %s"
        cursor.execute(update_query, (to_id, message, kudos_id))
        conn.commit()
        
        return jsonify({"message": "Kudos updated successfully!"})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete kudos
@app.route("/kudos/<int:kudos_id>", methods=["DELETE"])
def delete_kudos(kudos_id):
    # Initialize conn outside the try block
    conn = None
    try:
        conn = mysql_write.connect()
        cursor = conn.cursor()
        delete_query = "DELETE FROM kudos WHERE kudos_id = %s"
        cursor.execute(delete_query, (kudos_id,))
        conn.commit()

        return jsonify({"message": "Kudos deleted successfully!"})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run()