import json
import os
import sys
import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env and .env.local
load_dotenv()
load_dotenv('.env.local')

MONGO_URI = os.getenv('MONGODB_URI')

def import_blacklist(file_path):
    if not MONGO_URI:
        print("Error: MONGODB_URI not found in environment variables.")
        print("Please ensure .env or .env.local exists and contains MONGODB_URI.")
        sys.exit(1)

    try:
        if file_path.endswith('.json'):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        elif file_path.endswith('.txt'):
            with open(file_path, 'r', encoding='utf-8') as f:
                # Read lines and treat each as a word
                data = [line.strip() for line in f if line.strip()]
        else:
            print("Error: Unsupported file format. Please use .json or .txt")
            return
    except FileNotFoundError:
        print(f"Error: File {file_path} not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: Failed to decode JSON from {file_path}.")
        return

    try:
        client = MongoClient(MONGO_URI)
        # Get database from URI
        db = client.get_database()
        # Mongoose typically pluralizes model names for collections (Blacklist -> blacklists)
        collection = db['blacklists']
        
        print(f"Connected to database: {db.name}")

        # Check for and drop conflicting index 'word_1' if it exists
        try:
            indexes = collection.index_information()
            if 'word_1' in indexes:
                print("Found conflicting index 'word_1'. Dropping it...")
                collection.drop_index('word_1')
                print("Index 'word_1' dropped.")
        except Exception as e:
            print(f"Warning: Could not check/drop indexes: {e}")

    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return

    count = 0
    skipped = 0
    errors = 0

    # Normalize data to list of strings
    words_to_add = []
    
    if isinstance(data, list):
        for item in data:
            if isinstance(item, str):
                words_to_add.append(item)
            elif isinstance(item, dict) and 'keyword' in item:
                words_to_add.append(item['keyword'])
            elif isinstance(item, dict) and 'word' in item: # Handle potential {word: "..."} format
                words_to_add.append(item['word'])
    elif isinstance(data, dict):
        # Handle {"words": [...]} or similar
        found_list = False
        for key, value in data.items():
            if isinstance(value, list):
                words_to_add.extend([w for w in value if isinstance(w, str)])
                found_list = True
                break # Assume the first list found is the one
        
        # Handle {"bad_word": 1, "another": 1} format
        if not found_list:
             words_to_add.extend(data.keys())

    if not words_to_add:
        print("No words found to import. Please check the JSON format.")
        print(f"Data type: {type(data)}")
        print(f"Data preview: {str(data)[:500]}")
        return

    print(f"Found {len(words_to_add)} words to process.")

    for word in words_to_add:
        if not isinstance(word, str):
            continue
            
        word = word.strip()
        if not word:
            continue
            
        # Check existence (case-insensitive check might be better, but schema is strict)
        # For now, exact match as per schema
        if collection.find_one({"keyword": word}):
            skipped += 1
            # print(f"Skipping existing: {word}")
            continue

        try:
            collection.insert_one({
                "keyword": word,
                "type": "word",
                "createdAt": datetime.datetime.now()
            })
            count += 1
            # print(f"Added: {word}")
        except Exception as e:
            errors += 1
            print(f"Error adding {word}: {e}")

    print(f"\nImport complete.")
    print(f"Added: {count}")
    print(f"Skipped: {skipped}")
    print(f"Errors: {errors}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/import_blacklist.py <path_to_json_file>")
        print("Example: python scripts/import_blacklist.py bad_words.json")
    else:
        import_blacklist(sys.argv[1])
