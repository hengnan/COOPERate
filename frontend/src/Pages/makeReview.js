import React, { useEffect, useState } from 'react';
import './makeReview.css';
import {getAuth, signOut} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';



const ReviewForm = () => {
    const [formData, setFormData] = useState({
        courseName: '',
        professorName: '',
        courseRating: '',
        professorRating: '',
        reviewDescription: '',
        documentUpload: null
    });

    useEffect(() => {
        const courseNames = ["Software Engineering", "Integrated Circuit Engineering", "Digital Signal Processing"];
        const professorNames = ["Christopher Hong", "Jabeom Koo", "Fred Fontaine"];
    
        $("#courseName").autocomplete({
            source: courseNames,
            select: function(event, ui) {
                // Prevent the default behavior
                event.preventDefault();
                // Set the item as the value for the courseName input and update formData state
                setFormData(prevFormData => ({
                    ...prevFormData,
                    courseName: ui.item.value
                }));
                // Update the input field with selected value
                $("#courseName").val(ui.item.value);
            }
        });
    
        $("#professorName").autocomplete({
            source: professorNames,
            select: function(event, ui) {
                // Prevent the default behavior
                event.preventDefault();
                // Set the item as the value for the professorName input and update formData state
                setFormData(prevFormData => ({
                    ...prevFormData,
                    professorName: ui.item.value
                }));
                // Update the input field with selected value
                $("#professorName").val(ui.item.value);
            }
        });
    }, []);
    
    const MAX_FILE_SIZE = 10;



    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year


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

        setError("");
        const { name, value, files } = e.target;

        if ((name === "courseRating" || name === "professorRating") && value.length > 1) {
            return; // Stop processing if input length exceeds the maximum
        }

        if (files && files[0]) {
            if (files[0].size > MAX_FILE_SIZE) {
                setError(`File size should not exceed ${MAX_FILE_SIZE / 1024 / 1024} MB`);
                return; // Stop processing if the file is too large
            }
        }

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

        const courseRating = parseInt(formData.courseRating, 10);
        const profRating = parseInt(formData.professorRating, 10);

        

        
        const courseDetails = await fetch("http://localhost:8080/Courses/" + formData.courseName);
            
            
            const courseInfo = await courseDetails.json()
            
            const courseID = courseInfo.id;


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
        const SyllabusData = new FormData();
        SyllabusData.append('file', formData.syllabusUpload);
        SyllabusData.append('reviewData', JSON.stringify({
            username: localStorage.getItem("username"),
            course_id: formData.courseName,
            year: selectedYear,
            type: "Syllabus",
        }));

        const ExamData = new FormData();
        ExamData.append('file', formData.examUpload); // Handle the exam file
        ExamData.append('reviewData', JSON.stringify({
            username: localStorage.getItem("username"),
            course_id: formData.courseName,
            year: selectedYear,
            type: "Exams" 
        }));
        
        try {

            var syllSuccess = true;
            var examSuccess = true;
            var syllabusLink = "";
            var examLink=  "";
            
            if(formData.syllabusUpload){
                const Syresponse = await fetch("http://localhost:8000/upload", {
                    method: "POST",
                    body: SyllabusData
                });

                const syllabusResponse = await Syresponse.json();

                syllSuccess = Syresponse.ok;
                syllabusLink = syllabusResponse.link;
            }

            if(formData.examUpload){
                const Exresponse = await fetch("http://localhost:8000/upload", {
                    method: "POST",
                    body: ExamData
                });

                const examResponse = await Exresponse.json();
                examSuccess = examResponse.ok;
                examLink = examResponse.link;
            }

            if (syllSuccess && examSuccess) {
                setSuccessMessage("Review and file submitted successfully!");
                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000);
            }

            const updtReview = await fetch ("http://localhost:8080/updateReview", {
                method : "POST",
                body: JSON.stringify({
                    syllabus_link: syllabusLink,
                    exam_link: examLink,
                    review_id: '' + err_code
                })
            });

        } catch (error) {
            setError("Failed to submit: " + error.message);
        }

        localStorage.setItem('view-user', localStorage.getItem('username'));
        window.location.href = '/Users';
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
                    <label htmlFor="courserName">Course Name</label>
                    <input  type="text" id="courseName" name="courseName" value={formData.courseName} onChange={e => 
                    {
                        setError("");
                        setFormData({...formData, courseName: e.target.value})
                    }}
                />
                </div>
                <div className="form-group">
                    <label htmlFor="professorName">Professor Name</label>
                    <input  type="text" id="professorName" name="professorName" value={formData.professorName} onChange={e => 
                    {
                        setError("");
                        setFormData({...formData, professorName: e.target.value})
                    }}
                    />
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
                    <textarea id="reviewDescription" name="reviewDescription" rows="4" maxLength="500" value={formData.reviewDescription} onChange={handleChange}></textarea>
                    <small style={{ fontSize: '0.75rem', textAlign: 'right', display: 'block', marginTop: '5px' }}>
                        {500 - formData.reviewDescription.length} characters left
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="syllabusUpload">Upload Syllabus</label>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                        <input type="file" id="syllabusUpload" name="syllabusUpload" onChange={handleChange} />
                        <label style={{ marginLeft: '10px', marginRight: '5px', textAlign: 'center'}}>Year Class Taken</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            style={{ marginLeft: '10px', width: 'auto' }}
                            >
                        {Array(new Date().getFullYear() - 1999).fill().map((_, index) => (
                        <option key={index} value={2000 + index}>
                            {2000 + index}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="examUpload">Upload Past Exam</label>
                    <input type="file" id="examUpload" name="examUpload" onChange={handleChange} />
                </div>



                <button type="submit">Submit Review</button>

                
                
            </form>
        </div>
        </div>
    );
};

export default ReviewForm;