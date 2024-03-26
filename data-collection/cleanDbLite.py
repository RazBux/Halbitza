import sqlite3
import psycopg2
import pandas as pd
from config import DATABASE_CONFIG

# SQLite database file path
sqlite_db_path = '/Users/razbuxboim/Desktop/Halbitza/server-hal/db/workers_database_2023_cleaned.sqlite'

# Connect to the SQLite database
conn_sqlite = sqlite3.connect(sqlite_db_path)

# Read data from the SQLite database table
df = pd.read_sql_query('''SELECT
    id, id_color, boss, home_town, phone, family_en, family_ar, name_he, name_en, name_ar,
    birth_year,
    age,
    age_group,
    car_id,
    coming_reason, data_sorce, have_photo,
    photographer, date,
    family_he, adding_info
    FROM all_data_cleaned'''
    ,conn_sqlite)
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
cur.execute("""
CREATE TABLE new_table (
    id VARCHAR(20),
    id_color VARCHAR(255),
    boss VARCHAR(255),
    home_town VARCHAR(255),
    phone VARCHAR(20),
    family_en VARCHAR(255),
    family_ar VARCHAR(255),
    name_he VARCHAR(255),
    name_en VARCHAR(255),
    name_ar VARCHAR(255),
    birth_year INTEGER,
    age INTEGER,
    age_group VARCHAR(50),
    car_id INTEGER,
    coming_reason TEXT,
    data_sorce VARCHAR(255),
    have_photo VARCHAR(20),
    photographer VARCHAR(255),
    date DATE,
    family_he VARCHAR(255),
    adding_info TEXT
);

""")
conn_pg.commit()

# Insert data from the DataFrame into the PostgreSQL table
for _, row in df.iterrows():
    placeholders = ', '.join(['%s'] * len(row))
    columns = ', '.join(row.index)
    sql = "INSERT INTO new_table (" + columns + ") VALUES (" + placeholders + ")"
    cur.execute(sql, tuple(row))

# sql = '''
# INSERT INTO new_table (
#     id, id_color, boss, home_town, family_en, family_ar, name_he, name_en, name_ar,
#     birth_year, age, age_group, phone, car_id, coming_reason, data_sorce, have_photo,
#     photographer, date, family_he, adding_info
# )
# SELECT
#     id, id_color, boss, home_town, family_en, family_ar, name_he, name_en, name_ar,
#     birth_year::integer,
#     age::integer,
#     age_group,
#     phone,
#     car_id::integer,
#     coming_reason, data_sorce, have_photo,
#     photographer, date::date,
#     family_he, adding_info
# FROM all_data;
# '''
# cur.execute(sql)


# Commit the transaction
conn_pg.commit()

# Close the PostgreSQL connection
cur.close()
conn_pg.close()

print("Data transfer complete.")
