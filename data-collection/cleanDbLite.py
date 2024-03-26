import sqlite3
import psycopg2
import pandas as pd
from config import DATABASE_CONFIG

# SQLite database file path
sqlite_db_path = '/Users/razbuxboim/Desktop/Halbitza/workers_database_2023_cleaned.sqlite'

# Connect to the SQLite database
conn_sqlite = sqlite3.connect(sqlite_db_path)

# Read data from the SQLite database table
df = pd.read_sql_query("SELECT * FROM all_data_cleaned", conn_sqlite)
print(df)

# Close the SQLite database connection
conn_sqlite.close()

# add here the creds from 

# PostgreSQL connection string
conn_string = f"dbname='{DATABASE_CONFIG['database']}' user='{DATABASE_CONFIG['username']}' host='{DATABASE_CONFIG['hostname']}' password='{DATABASE_CONFIG['password']}' port='{DATABASE_CONFIG['port']}'"

# Connect to the PostgreSQL database
conn_pg = psycopg2.connect(conn_string)
cur = conn_pg.cursor()

# Ensure the table exists in your PostgreSQL database, with a matching schema.
# If not, you'll need to create it. Here's a simplified command for creating a similar table:
# cur.execute("""
# CREATE TABLE all_data_cleaned (
#     family_he TEXT,
#     family_en TEXT,
#     -- Add other columns here with appropriate types
#     -- ...
#     date TIMESTAMP,
#     adding_info TEXT
# );
# """)
# conn_pg.commit()

# Insert data from the DataFrame into the PostgreSQL table
for _, row in df.iterrows():
    placeholders = ', '.join(['%s'] * len(row))
    columns = ', '.join(row.index)
    sql = f"INSERT INTO all_data ({columns}) VALUES ({placeholders})"
    cur.execute(sql, tuple(row))

# Commit the transaction
conn_pg.commit()

# Close the PostgreSQL connection
cur.close()
conn_pg.close()

print("Data transfer complete.")
