from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
from flaskext.mysql import MySQL

# db = SQLAlchemy()

app = Flask(__name__)
mysql = MySQL()

# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://admin:x.fV5+nGQ(Z&nzO+tx9Dhy.04VGR@project-db-server.ca9eyo6nclrw.us-west-1.rds.amazonaws.com:3306/aws-project"
 
app.config['MYSQL_DATABASE_USER'] = 'admin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'x.fV5+nGQ(Z&nzO+tx9Dhy.04VGR'
app.config['MYSQL_DATABASE_DB'] = 'aws-project'
app.config['MYSQL_DATABASE_HOST'] = 'project-db-server.ca9eyo6nclrw.us-west-1.rds.amazonaws.com'
mysql.init_app(app)

@app.route("/")
def home():
    return "Hello, Flask!"


@app.route("/index")
def index():
    conn = mysql.connect()
    cursor = conn.cursor()

    sql_cmd = 'SELECT * FROM members;'
    cursor.execute(sql_cmd)
    rows = cursor.fetchall()

    return [row for row in rows]

    # with db.engine.connect() as connection:
    #     query_data = connection.execute(sql_cmd)
    #     print(query_data)
    #     return 'ok'
    # query_data = db.engine.execute(sql_cmd)
    # print(query_data)
    # return 'ok'

if __name__ == "__main__":
    app.run()


#https://stackoverflow.com/questions/62627058/how-to-connect-to-aws-rds-mysql-database-with-python 
#Try this tommorrow