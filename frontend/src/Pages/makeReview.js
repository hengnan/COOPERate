import React, { useEffect, useState } from 'react';
import './makeReview.css';
import {getAuth, signOut} from "firebase/auth";
import { useNavigate } from 'react-router-dom';




const ReviewForm = () => {
    const [formData, setFormData] = useState({
        courseName: '',
        professorName: '',
        courseRating: '',
        professorRating: '',
        reviewDescription: '',
        documentUpload: null
    });


    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
      }

    const saveUsername = (username, event) => {
        event.preventDefault();
        localStorage.setItem('view-user', username);
        window.location.href = '/Users';
      }

    
    const [error, setError] = useState("");
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check for necessary fields first
        if(formData.courseName === "" || formData.professorName === "") {
            setError("Required fields cannot be empty!");
            return;
        }
        
        const courseDetails = await fetch("http://localhost:8080/Courses/" + formData.courseName);
            
            
            const courseInfo = await courseDetails.json()
            
            const courseID = courseInfo.id;


            console.log(courseID);
            if (courseID <= 0) {
                setError("Course Not Found!");
                return;
            }

            if(formData.professorName === "")
            {
                setError("Professor name field cannot be empty!");
                return;
            }
            const profDetails = await fetch("http://localhost:8080/Professors/" + formData.professorName);

            const profInfo = await profDetails.json();

            const profID = profInfo.id;

            console.log(profID);

            if (profID <= 0){
                setError("Professor Not Found!");
                return;
            }

            const uid = localStorage.getItem("user_id");

            const pckg = await fetch("http://localhost:8080/makeReview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({
                    reviewer_id: uid,
                    course_id: courseID.toString(),
                    prof_id: profID.toString(),
                    course_name: formData.courseName,
                    prof_name: formData.professorName,
                    course_rating: formData.courseRating.toString(),
                    prof_rating: formData.professorRating.toString(),
                    review: formData.reviewDescription,
                    hyperlink: null
                })
            });

            const err_code = await pckg.json();
            console.log(err_code);

            if (err_code === -1)
            {
                setError("You already made a review for this course and professor!");
                return;
            }
    
        // Assuming all validations pass, prepare data for submission
        const formDataToSend = new FormData();
        formDataToSend.append('file', formData.documentUpload);
        formDataToSend.append('reviewData', JSON.stringify({
            reviewer_id: localStorage.getItem("user_id"),
            course_id: formData.courseName,
            prof_id: formData.professorName,
            course_rating: formData.courseRating,
            prof_rating: formData.professorRating,
            review: formData.reviewDescription
        }));

        
        try {

            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formDataToSend
            });
    
            if (response.ok) {
                setSuccessMessage("Review and file submitted successfully!");
                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000);
            } 
            
            /*else {
                setError(uploadResponse.message || "An error occurred during file upload.");
            }*/

            const uploadResponse = await response.json();

            const updtReview = await fetch ("http://localhost:8080/updateReview", {
                method : "POST",
                body: JSON.stringify({
                    hyperlink: uploadResponse.link,
                    review_id: '' + err_code
                })
            });

        } catch (error) {
            setError("Failed to submit: " + error.message);
        }

       //localStorage.setItem('view-user', localStorage.getItem('username'));
        //window.location.href = '/Users';
    };
    





    return (
        <div>
            <div class="banner">
                <h1 class="banner-title">COOPERATE</h1>
                <a href = "/AboutUs" class="button-link">
                <button class="button"><i className="fas fa-info-circle"></i> About Us</button>
                 </a>
            <a href = "https://drive.google.com/drive/u/2/folders/1qej-Xkxx8fBXSTjRDwYHEwKpz5JJsphx" class="button-link">
            <button class="button"><i class="fas fa-archive"></i> Checkout Our Archive</button>
            </a>
            <a href = "/" class = "button-link">
                <button class="button"><i class="fas fa-search"></i> Search Reviews</button>
            </a>
            <a href = "/makeReview" class="button-link">
                <button class="button"><i class="fas fa-edit"></i> Make A Review</button>
            </a>
            <a href = "/Users" onClick= {(e) => saveUsername(localStorage.getItem("username"), e)} class="button-link">
            <button class="profile-button"><i class="fas fa-user-circle"></i> Profile</button>
            </a>
            <a class="button-link">
            <button onClick={handleLogout} class="button"><i class="fa fa-sign-out"></i>Logout</button>
            </a>
        </div>
        <div className="review-form-container">
            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}
            <h2>Make A Review</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="courseName">Course Name</label>
                    <input type="text" id="courseName" name="courseName" value={formData.courseName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="professorName">Professor Name</label>
                    <input  type="text" id="professorName" name="professorName" value={formData.professorName} onChange={handleChange} />
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
        </div>
    );
};

export default ReviewForm;