import React, { useState } from 'react';
import './makeReview.css';

const ReviewForm = () => {
    const [formData, setFormData] = useState({
        courseName: '',
        professorName: '',
        courseRating: '',
        professorRating: '',
        reviewDescription: '',
        documentUpload: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the submission here (e.g., send to backend)
        console.log(formData);
        // Reset the form if needed
        setFormData({
            courseName: '',
            professorName: '',
            courseRating: '',
            professorRating: '',
            reviewDescription: '',
            documentUpload: null
        });
    };

    return (
        <div className="review-form-container">
            <h2>Make A Review</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="courseName">Course Name</label>
                    <input type="text" id="courseName" name="courseName" value={formData.courseName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="professorName">Professor Name</label>
                    <input type="text" id="professorName" name="professorName" value={formData.professorName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="courseRating">Course Rating</label>
                    <input type="number" id="courseRating" name="courseRating" min="1" max="5" value={formData.courseRating} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="professorRating">Professor Rating</label>
                    <input type="number" id="professorRating" name="professorRating" min="1" max="5" value={formData.professorRating} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="reviewDescription">Review Description</label>
                    <textarea id="reviewDescription" name="reviewDescription" rows="4" value={formData.reviewDescription} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="documentUpload">Upload Document</label>
                    <input type="file" id="documentUpload" name="documentUpload" onChange={handleChange} />
                </div>
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
};

export default ReviewForm;
