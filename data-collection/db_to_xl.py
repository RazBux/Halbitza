import sqlite3
import pandas as pd

# Path to your SQLite database
db_path = '/Users/razbuxboim/Desktop/habitza/hab-server/db/workers_database_2023.sqlite'
# Path where you want to save the Excel file
excel_path = 'habitza_data.xlsx'

# Connect to the SQLite database
conn = sqlite3.connect(db_path)

# Get the list of all tables in the database
tables_query = "SELECT name FROM sqlite_master WHERE type='table';"
tables = pd.read_sql_query(tables_query, conn)

# For each table in the database, read it into a DataFrame and write it to the Excel file
with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
    for table_name in tables['name'].tolist():
        df = pd.read_sql_query(f"SELECT * FROM {table_name}", conn)
        df.to_excel(writer, sheet_name=table_name, index=False)

# Close the connection to the database
conn.close()

print(f"Database has been successfully exported to {excel_path}")
