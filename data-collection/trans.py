import sqlite3
import pandas as pd
from googletrans import Translator

# Initialize the translator
translator = Translator()

# Function to translate text, english = 'en' , arabic = 'ar'
def translate_text(text, dest_language):
    try:
        translated = translator.translate(text, dest=dest_language)
        return translated.text
    except Exception as e:
        print(f"Error translating {text}: {e}")
        return None

# Connect to your SQLite database
db_path = '/Users/razbuxboim/Desktop/habitza/hab-server/db/workers_database_2023.sqlite' 
conn = sqlite3.connect(db_path)


# Read the data from the table
table_name = 'all_data'  # Update if using a different table name
query = f"SELECT \"שם פרטי\" FROM {table_name} WHERE \"פרטי אנגלית\" IS NULL OR \"פרטי אנגלית\" = ''"
df = pd.read_sql_query(query, conn)

# Translate the "שם משפחה" column to English and update "משפחה אנגלית"
for index, row in df.iterrows():
    hebrew_n = row['שם פרטי']
    translated_name = translate_text(hebrew_n, 'en')
    print(hebrew_n, ":", translated_name)
    # Update the DataFrame with the translated name
    df.at[index, "שם אנגלית"] = translated_name
    # Update the database
    update_query = f"""UPDATE {table_name} SET \"פרטי אנגלית\" = ? WHERE \"שם פרטי\" = ?"""
    conn.execute(update_query, (translated_name, hebrew_n))

# Commit the changes and close the connection
conn.commit()
conn.close()