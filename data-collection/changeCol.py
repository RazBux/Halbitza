import sqlite3

# Path to your SQLite database
db_path = '/Users/razbuxboim/Desktop/habitza/hab-server/db/workers_database_2023.sqlite'
table_name = 'all_data'  # Update with your actual table name

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Fetch the current schema
cursor.execute(f'PRAGMA table_info({table_name});')
columns = cursor.fetchall()

for col in columns:
    new_col = f"{col[1].replace(' ', '_')} {col[2]}"
    print(col[1],":",new_col[:-5])
    cursor.execute(f"ALTER TABLE all_data RENAME COLUMN {col[1]} TO {new_col[:-5]};")



# Commit changes and close the connection
conn.commit()
conn.close()

print("All column names with spaces have been successfully replaced with underscores.")
