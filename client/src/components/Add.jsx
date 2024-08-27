import React, { useState } from 'react';
import './add.css'; // Assuming you have a CSS file for styling

const Add = () => {
  const [formData, setFormData] = useState({
    instrumentId: '',
    xCoordinate: '',
    yCoordinate: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Form submission logic here
      console.log('Form submitted successfully:', formData);
    }
  };

  return (
    <>
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="instrumentId">Instrument ID</label>
          <input
            type="text"
            id="instrumentId"
            name="instrumentId"
            placeholder="Enter Instrument ID"
            value={formData.instrumentId}
            onChange={handleChange}
          />
          {errors.instrumentId && <span className="error">{errors.instrumentId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="xCoordinate">X Coordinate</label>
          <input
            type="number"
            id="xCoordinate"
            name="xCoordinate"
            placeholder="Enter X Coordinate"
            value={formData.xCoordinate}
            onChange={handleChange}
          />
          {errors.xCoordinate && <span className="error">{errors.xCoordinate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="yCoordinate">Y Coordinate</label>
          <input
            type="number"
            id="yCoordinate"
            name="yCoordinate"
            placeholder="Enter Y Coordinate"
            value={formData.yCoordinate}
            onChange={handleChange}
          />
          {errors.yCoordinate && <span className="error">{errors.yCoordinate}</span>}
        </div>

        <button type="submit">Add Instrument</button>
      </form>
    </>
  );
};

export default Add;

