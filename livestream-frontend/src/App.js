import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rnd } from 'react-rnd';
import './App.css';

const App = () => {
  const [overlays, setOverlays] = useState([]);
  const [overlayData, setOverlayData] = useState({
    content: '',
    image: null, // To store uploaded image
    position: { x: 50, y: 50 },
    size: { width: 100, height: 100 },
  });
  const [editingOverlayId, setEditingOverlayId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/overlays')
      .then((response) => {
        const formattedOverlays = response.data.map(overlay => ({
          ...overlay,
          position: { x: overlay.position.left || 0, y: overlay.position.top || 0 },
        }));
        setOverlays(formattedOverlays);
      })
      .catch((error) => {
        console.error('Error fetching overlays', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOverlayData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOverlayData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const createOrUpdateOverlay = () => {
    const dataToSend = {
      ...overlayData,
      position: { top: overlayData.position.y, left: overlayData.position.x },
    };

    if (editingOverlayId) {
      axios.put(`http://localhost:5000/api/overlays/${editingOverlayId}`, dataToSend)
        .then(() => {
          setOverlays(prevOverlays => prevOverlays.map(overlay =>
            overlay._id === editingOverlayId ? { ...overlay, ...dataToSend } : overlay
          ));
          resetForm();
        })
        .catch((error) => {
          console.error('Error updating overlay', error);
        });
    } else {
      axios.post('http://localhost:5000/api/overlays', dataToSend)
        .then((response) => {
          const newOverlay = {
            ...dataToSend,
            _id: response.data.id,
            position: { x: dataToSend.position.left, y: dataToSend.position.top },
          };
          setOverlays(prevOverlays => [...prevOverlays, newOverlay]);
          resetForm();
        })
        .catch((error) => {
          console.error('Error creating overlay', error);
        });
    }
  };

  const resetForm = () => {
    setOverlayData({
      content: '',
      image: null, // Reset the image
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
    });
    setEditingOverlayId(null);
  };

  const deleteOverlay = (id) => {
    axios.delete(`http://localhost:5000/api/overlays/${id}`)
      .then(() => {
        setOverlays(prevOverlays => prevOverlays.filter(overlay => overlay._id !== id));
        if (editingOverlayId === id) {
          resetForm();
        }
      })
      .catch((error) => {
        console.error('Error deleting overlay', error);
      });
  };

  const updateOverlayState = (id, newPosition, newSize) => {
    setOverlays(prevOverlays => prevOverlays.map(overlay =>
      overlay._id === id
        ? { ...overlay, position: newPosition, size: newSize }
        : overlay
    ));
  };

  const updateOverlayServer = (overlay) => {
    const dataToSend = {
      ...overlay,
      position: { top: overlay.position.y, left: overlay.position.x },
    };
    axios.put(`http://localhost:5000/api/overlays/${overlay._id}`, dataToSend)
      .then(() => {
        console.log('Overlay updated successfully on server');
      })
      .catch((error) => {
        console.error('Error updating overlay on server', error);
      });
  };

  const startEditing = (overlay) => {
    setOverlayData({
      content: overlay.content,
      image: overlay.image || null, // Ensure image is included when editing
      position: { x: overlay.position.x, y: overlay.position.y },
      size: overlay.size,
    });
    setEditingOverlayId(overlay._id);
  };

  return (
    <div className="App">
      <h1>Livestream with Customizable Overlays</h1>

      <div className="overlay-form">
        <h2>{editingOverlayId ? 'Edit Overlay' : 'Create Overlay'}</h2>
        <input
          type="text"
          name="content"
          placeholder="Overlay Text"
          value={overlayData.content}
          onChange={handleInputChange}
        />
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button onClick={createOrUpdateOverlay}>
          {editingOverlayId ? 'Update Overlay' : 'Create Overlay'}
        </button>
        {editingOverlayId && <button onClick={resetForm}>Cancel Editing</button>}
      </div>

      <div className="content-wrapper">
        <div className="player-wrapper">
          <iframe
            width="500"
            height="375"
            src="https://rtsp.me/embed/5NAKyKtf/"
            frameBorder="0"
            allowFullScreen
            title="RTSP Livestream"
          />
        </div>

        {overlays.map((overlay) => (
          <Rnd
            key={overlay._id}
            size={{ width: overlay.size.width, height: overlay.size.height }}
            position={{ x: overlay.position.x, y: overlay.position.y }}
            onDrag={(e, d) => updateOverlayState(overlay._id, { x: d.x, y: d.y }, overlay.size)}
            onDragStop={(e, d) => {
              updateOverlayState(overlay._id, { x: d.x, y: d.y }, overlay.size);
              updateOverlayServer({ ...overlay, position: { x: d.x, y: d.y } });
            }}
            onResize={(e, direction, ref, delta, position) => {
              updateOverlayState(overlay._id, position, {
                width: ref.style.width,
                height: ref.style.height,
              });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              const newSize = { width: ref.style.width, height: ref.style.height };
              updateOverlayState(overlay._id, position, newSize);
              updateOverlayServer({ ...overlay, position, size: newSize });
            }}
            bounds="parent"
            className="overlay"
          >
            <div className="overlay-content">
              {overlay.image && <img src={overlay.image} alt="Logo" className="overlay-logo" />}
              {overlay.content}
              <div className="overlay-buttons">
                <button onClick={() => startEditing(overlay)}>Edit</button>
                <button onClick={() => deleteOverlay(overlay._id)}>Delete</button>
              </div>
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
};

export default App;
