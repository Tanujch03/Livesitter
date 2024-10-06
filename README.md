# Livesitter
Visitors to the app are able to view a livestream video played from an 
RTSP URL (use RTSP me or RTSP stream to create a temporary stream from a 
video over internet).

## The app will be able to play a livestream video from a given RTSP URL
<ul>
  <li> Users should have the option to add custom overlays 
      (such as logos and text) on top of the livestream. These overlays can be 
      positioned and resized as needed.
  </li>
  <li>Create: Users should be able to create and save custom overlay settings, including position, size, and content.</li>
<li>Read: Users should be able to retrieve their saved overlay settings.</li>
<li>Update: Users should be able to modify existing overlay settings.</li>
<li>Delete: Users should be able to delete saved overlay settings.</li>
</li>
</ul>


# frontend
```
npx create-react-app frontend
cd frontend
npm install video-react
npm install axios
npm install react-rnd
npm start
```
<p>Access the server</p> 

```
http://localhost:3000
```

# Backend

```
mkdir backend
cd backend
```

## Set up a virtual environment 

```
python3 -m venv venv
source venv/bin/activate   # On Windows, use venv\Scripts\activate
```

## Create the required files:

```
touch app.py
touch requirements.txt

```

## Add the required Python libraries to requirements.txt:

```
Flask==2.0.3
pymongo==4.0.2
opencv-python-headless==4.5.5.64

```

## Install the dependencies:

```
pip install -r requirements.txt
pip install Flask pymongo flask-cors python-dotenv

```

## API Documentation detailing the CRUD endpoints

```
GET - http://localhost:5000/api/overlays - Gets all the overlays
POST - http://localhost:5000/api/overlays - Post the new overlays
PUT - http://localhost:5000/api/overlays - Edit the text or change the logo(overlays)
DELETE - http://localhost:5000/api/overlays - Delete the overlays
```

## User Documentation 

### Go to RTSP ME:

```
https://rtsp.me/en/
```
<p>SignUP, Will get a mail</p>
<p>SignIn</p>
<p>Click on create Broadcasting</p>

### TO setup a dummy RTSP link:

<ul>
  <li>Go to [RTSP Link:](https://rtsp.stream)</li>
  <li>Sign up</li>
  <li>Copy the dummp rtsp link and paste it in RTSP ME broadcasting website</li>
  <li>Set the working hours</li>
  <li>Click Ok</li>
  <li>U can Access the url iframe url and paste it on to your website</li>
</ul>
