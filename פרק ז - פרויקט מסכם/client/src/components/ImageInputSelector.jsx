import React, { useState } from 'react';
import './ImageInputSelector.css';

function ImageInputSelector({ imageBase64, setImageBase64, imageUrl, setImageUrl }) {
  const [imageMethod, setImageMethod] = useState("file");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleMethodChange = (method) => (e) => {
    e.preventDefault(); // ✅ Prevent form submission
    setImageMethod(method);
    // Reset both values to avoid conflicts
    setImageBase64("");
    setImageUrl("");
  };

  const finalImage = imageMethod === "file" ? imageBase64 : imageUrl;

  return (
    <div className="image-input-selector mb-3">
      <label className="form-label">תמונה</label>

      {/* Toggle Buttons */}
      <div className="btn-group mb-2 flex-direction-row-reverse" role="group">
        <button
          type="button"
          className={`btn btn-outline-primary ${imageMethod === "file" ? "active" : ""}`}
          onClick={handleMethodChange("file")}
        >
          העלאת קובץ
        </button>
        <button
          type="button"
          className={`btn btn-outline-primary ${imageMethod === "link" ? "active" : ""}`}
          onClick={handleMethodChange("link")}
        >
          קישור לתמונה
        </button>
      </div>

      {/* Conditional Input */}
      {imageMethod === "file" ? (
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleFileChange}
        />
      ) : (
        <input
          type="text"
          className="form-control"
          placeholder="הדבק קישור לתמונה"
          value={imageUrl || ""} // ✅ Controlled input
          onChange={(e) => setImageUrl(e.target.value)}
        />
      )}

      {/* Preview */}
      {finalImage && (
        <div className="mt-3">
          <label className="form-label">תצוגה מקדימה:</label>
          <img
            src={finalImage}
            alt="preview"
            className="img-thumbnail max-height-200"
          />
        </div>
      )}
    </div>
  );
}

export default ImageInputSelector;
