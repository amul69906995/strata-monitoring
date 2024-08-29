import React, { useState } from 'react';
import './add.css'; // Assuming you have a CSS file for styling
import axios from 'axios'
const Add = () => {
  const [formData, setFormData] = useState({
    instrumentId: '',
    value:''
  });
const [loading,setLoading]=useState(false)
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

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true)
        const {data}=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/${formData.instrumentId}`,{value:formData.value})
        console.log(data)
      } catch (error) {
        console.log(error)
      }
      finally{
        setLoading(false)
      }
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
          <label htmlFor="value">Value</label>
          <input
            type="number"
            id="value"
            name="value"
            placeholder="Enter Value"
            value={formData.value}
            onChange={handleChange}
          />
          {errors.value && <span className="error">{errors.value}</span>}
        </div>
        <button type="submit" disabled={loading}>Add Data</button>
      </form>
    </>
  );
};

export default Add;

