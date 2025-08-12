from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from agent import call_llm

 
from user_profiles import create_user, get_user_by_email
 
app = Flask(__name__, static_folder='../frontend/build')
CORS(app)
 
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
 
@app.route('/api/hello')
def hello():
    return {'message': 'Hello from Flask backend!'}
 
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
 
    required_fields = ["firstName", "lastName", "dob", "email", "phone", "ssn", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400
 
    existing_user = get_user_by_email(data["email"])
    if existing_user:
        return jsonify({"message": "Email already exists"}), 409
 
    try:
        # Convert date to yyyy-mm-dd
        dob = datetime.strptime(data["dob"], "%m/%d/%Y").strftime("%Y-%m-%d")
        create_user(
            data["firstName"],
            data["lastName"],
            data["email"],
            data["phone"],
            balance=0.0,
            start_date=dob,
            ssn=data["ssn"],
            password=data["password"]
        )
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        print("Signup error:", e)
        return jsonify({"message": "Internal server error"}), 500
 
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
 
    if "email" not in data or "password" not in data:
        return jsonify({"message": "Email and password required"}), 400
 
    user = get_user_by_email(data["email"])
    if not user or user[-1] != data["password"]:  # assuming password is last in tuple
        return jsonify({"message": "Invalid email or password"}), 401
 
    return jsonify({"message": "Login successful", "userID": user[0]}), 200  # userID = primary key
 
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"response": "Please say something!"}), 400
    try:
        response = call_llm(user_message)  # ✅ ACTUAL LLM CALL
        return jsonify({"response": response}), 200
    except Exception as e:
        print("LLM error:", e)
        return jsonify({"response": "Something went wrong calling the AI model."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))