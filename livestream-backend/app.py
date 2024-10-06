from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
import os
from dotenv import load_dotenv  # Import to load environment variables

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB Connection Setup
mongo_uri = os.getenv('MONGO_URI')  # Get MongoDB URI from environment variable
client = MongoClient(mongo_uri)
db = client.livestream_db
overlays_collection = db.overlays

# Route to play RTSP livestream (placeholder)
@app.route('/livestream')
def livestream():
    return '''
    <video width="600" controls>
        <source src="rtsp://your-rtsp-url-here" type="video/mp4">
        Your browser does not support the video tag.
    </video>
    '''

# GET: Fetch all overlays
@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    overlays = list(overlays_collection.find({}))
    for overlay in overlays:
        overlay['_id'] = str(overlay['_id'])  # Convert ObjectId to string for JSON serialization
    return jsonify(overlays)

# POST: Create a new overlay
@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    overlay_data = request.json
    new_overlay = {
        'content': overlay_data.get('content'),
        'position': overlay_data.get('position'),
        'size': overlay_data.get('size')
    }
    result = overlays_collection.insert_one(new_overlay)
    return jsonify({'message': 'Overlay created', 'id': str(result.inserted_id)}), 201

# PUT: Update an existing overlay
@app.route('/api/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    overlay_data = request.json
    updated_overlay = {
        'content': overlay_data.get('content'),
        'position': overlay_data.get('position'),
        'size': overlay_data.get('size')
    }
    result = overlays_collection.update_one({'_id': ObjectId(overlay_id)}, {'$set': updated_overlay})
    if result.modified_count > 0:
        return jsonify({'message': 'Overlay updated'})
    else:
        return jsonify({'message': 'Overlay not found'}), 404

# DELETE: Remove an overlay
@app.route('/api/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    result = overlays_collection.delete_one({'_id': ObjectId(overlay_id)})
    if result.deleted_count > 0:
        return jsonify({'message': 'Overlay deleted'})
    else:
        return jsonify({'message': 'Overlay not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
