import sqlite3
import pyodbc
from azureCreds import connection_string

db_name = "addresses"
constrains = f"FK_{db_name}_persons"

# SQL commands to alter the table structure
sql_commands = [
    f"""
    -- First, drop the existing foreign key constraint
    ALTER TABLE [dbo].[{db_name}]
    DROP CONSTRAINT {constrains};

    -- Alter the data type of the pers_id column in vehicles table to match nvarchar
    ALTER TABLE [dbo].[{db_name}]
    ALTER COLUMN pers_id NVARCHAR(9); -- Use the appropriate length for the nvarchar type

    -- Now, add the foreign key constraint again
    ALTER TABLE [dbo].[{db_name}]
    ADD CONSTRAINT {constrains} FOREIGN KEY (pers_id) REFERENCES [dbo].[persons] (id);

    """,
]

try:
    # Connect to your database
    with pyodbc.connect(connection_string) as conn:
        cursor = conn.cursor()

        # Execute each SQL command
        for command in sql_commands:
            print(f"Executing SQL command:\n{command}")
            cursor.execute(command)
            conn.commit()  # Commit each alteration to the database

        print("All modifications have been successfully applied to the table.")

except Exception as e:
    print(f"An error occurred: {e}")
