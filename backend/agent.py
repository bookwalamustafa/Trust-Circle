from ai_core_sdk.ai_core_v2_client import AICoreV2Client
from gen_ai_hub.proxy.langchain.openai import ChatOpenAI
from hdbcli import dbapi
import numpy as np
import json
import os

with open('ai_auth_url.txt', 'r') as file:
    ai_auth_url_txt = file.read()
with open('ai_base_url.txt', 'r') as file:
    ai_base_url_txt = file.read()
with open('ai_client_id.txt', 'r') as file:
    ai_client_id_txt = file.read()
with open('ai_client_secret.txt', 'r') as file:
    ai_client_secret_txt = file.read()
with open('ai_resource_group.txt', 'r') as file:
    ai_resource_group_txt = file.read()

#Set up AI CORE
os.environ['AICORE_AUTH_URL'] = ai_auth_url_txt
os.environ['AICORE_CLIENT_ID'] = ai_client_id_txt
os.environ['AICORE_RESOURCE_GROUP'] = ai_resource_group_txt
os.environ['AICORE_CLIENT_SECRET'] = ai_client_secret
os.environ['AICORE_BASE_URL'] = ai_base_url_txt

from gen_ai_hub.proxy.native.openai import embeddings

base_url = os.environ.get('AICORE_BASE_URL')
auth_url = os.environ.get('AICORE_AUTH_URL')
client_id = os.environ.get('AICORE_CLIENT_ID')
client_secret = os.environ.get('AICORE_CLIENT_SECRET')
if base_url is None:
    raise ValueError("Environment variable AICORE_BASE_URL is not set.")
auth_url = os.environ.get('AICORE_AUTH_URL')
if auth_url is None:
    raise ValueError("Environment variable AICORE_AUTH_URL is not set.")
client_id = os.environ.get('AICORE_CLIENT_ID')
if client_id is None:
    raise ValueError("Environment variable AICORE_CLIENT_ID is not set.")
client_secret = os.environ.get('AICORE_CLIENT_SECRET')
if client_secret is None:
    raise ValueError("Environment variable AICORE_CLIENT_SECRET is not set.")
    
ai_core_client = AICoreV2Client(
    base_url= base_url,
    auth_url=auth_url,
    client_id=client_id,
    client_secret=client_secret
)

# Set up HANA DB
cc = dbapi.connect(
    address="f2276c2f-a411-47a5-a9aa-1a60ff2469de.hana.trial-us10.hanacloud.ondemand.com",
    port=443,
    user="DBADMIN",
    password="Password12345"
)

# read text
with open("tc-summary.txt", 'r', encoding='utf-8') as file:
    text = file.read()

#convert text into vector embeddings
def create_embedding(input, model="text-embedding-ada-002") -> str:
    response = embeddings.create(
        model_name = model,
        input = input
    )
    serialized_vector = json.dumps(response.data[0].embedding)
    return serialized_vector

# Create a table for storing embeddings (only done once)
def create_embeddings_table():
    cursor = cc.cursor()
    cursor.execute("""
        CREATE TABLE tc_embeddings_table (
            doc_id NVARCHAR(255) PRIMARY KEY,
            vector NCLOB  -- Change it based on requirements: e.g. BLOB, STRING
        )
    """)
    cc.commit()
    cursor.close()
    print("✅ Embeddings table created.")

#store embeddings into database
def store_embeddings_in_db(doc_id, embedding_vector):
    cursor = cc.cursor()
    cursor.execute("INSERT INTO tc_embeddings_table (doc_id, vector) VALUES (?, ?)", (doc_id, embedding_vector))
    cc.commit()
    cursor.close()

# Function to retrieve embedding from database based on a doc_id
def get_embedding_from_db(doc_id):
    cursor = cc.cursor()
    try:
        cursor.execute("SELECT vector FROM tc_embeddings_table WHERE doc_id = ?", (doc_id,))
        result = cursor.fetchone()
        if result:
            serialized_vector = result[0]
            embedding_vector = json.loads(serialized_vector)
            return embedding_vector
        else:
            print("No embedding found for given doc_id.")
            return None
    except Exception as e:
        print(f"Failed to retrieve embedding from database: {e}")
    finally:
        cursor.close()


#clears table if u wanna reset
def truncate_table():
    cursor = cc.cursor()
    try:
        cursor.execute("TRUNCATE TABLE tc_embeddings_table")
        cc.commit()
        print("✅ Embeddings table truncated.")
    except Exception as e:
        print(f"Failed to truncate table: {e}")
    finally:
        cursor.close()

#segments the text
def segment_text(text):
    return text.split('.')

#calculates the similarity number we need
def cosine_similarity(vec1, vec2):
    if isinstance(vec1, str):
        vec1 = json.loads(vec1)
    if isinstance(vec2, str):
        vec2 = json.loads(vec2)
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    dot_product = np.dot(vec1, vec2)
    norm_vec1 = np.linalg.norm(vec1)
    norm_vec2 = np.linalg.norm(vec2)
    return dot_product / (norm_vec1 * norm_vec2)

#finds the segment thats the most similar to the query
def find_most_relevant_segment(query_embedding, text_segments):
    highest_similarity = -1
    most_relevant_segment = None
    for i, segment in enumerate(text_segments):
        segment_vector = get_embedding_from_db(f'segment-{i}')
        if segment_vector:
            similarity = cosine_similarity(query_embedding, segment_vector)
            if similarity > highest_similarity:
                highest_similarity = similarity
                most_relevant_segment = segment
    return most_relevant_segment

#perform everything (only done once)
# truncate_table()
# embedding_vector = create_embedding(text)
# print(embedding_vector)
# store_embeddings_in_db('document-id', embedding_vector)
# text_segments = segment_text(text)
# for i, segment in enumerate(text_segments):
#     if segment.strip():  # to avoid empty strings after splitting
#         embedding_vector = create_embedding(segment)
#         store_embeddings_in_db(f'segment-{i}', embedding_vector)

llm = ChatOpenAI(proxy_model_name='gpt-4o', max_tokens=4000)

def call_llm(query):
    query_embedding = create_embedding(query)
    text_segments = segment_text(text)
    most_relevant_segment = find_most_relevant_segment(query_embedding, text_segments)
    response = llm.invoke(
    "You are a finance expert for a company called Truth Circle and your name is Trusty, the virtual AI assistant. Pretend you work for us. Do not use any markdown formatting, just type it out regularly. You will be given a query from the user and the most relevant part from the business document we outlined about the company. Here is the query: " + query + ". And here is the most relevant information about this query: " + most_relevant_segment
    ).content
    return response