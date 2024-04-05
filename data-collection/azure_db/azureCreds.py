import pyodbc

# Your connection string
connection_string = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=tcp:halvitsa-db-server.database.windows.net,1433;"
    "DATABASE=havitsa-db;"
    "UID=dbadmin;"
    "PWD=Passw0rd!@#$%^;"
    "Encrypt=yes;"
    "TrustServerCertificate=no;"
    "Connection Timeout=30;"
)

# connection line for the Havitsa db.
# sqlcmd -S tcp:halvitsa-db-server.database.windows.net,1433 -U dbadmin -P 'Passw0rd!@#$%^' -d havitsa-db

# # Establishing the connection
# conn = pyodbc.connect(connection_string)

# # Creating a cursor object using the connection
# cursor = conn.cursor()

# # Now you can use cursor.execute() to execute SQL queries
# # Example: cursor.execute("SELECT * FROM YourTableName")

# # Don't forget to close the connection when done
# conn.close()
