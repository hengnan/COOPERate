import React, { useEffect, useState } from 'react';
import './makeReview.css';
import { gapi } from 'gapi-script';
import {getAuth, signOut} from "firebase/auth";
import { useNavigate } from 'react-router-dom';


const authToken = "ya29.a0Ad52N39VERWZ-f2gZgTqrrE78li68O7NEgcv0bzzJvwk-NYq_U1jmfXOfaWR-G5Fd7VSNSr8CxCfdD7C2NT3N_dtOkZKGdacGU1M_TRJAHee_CkiWKiInjjr3df_vO9Ohq4E-VvjboDOQckaGvXlbcLXTe-6RH45TtkNaCgYKASISARISFQHGX2MikCWbj5Gv3KRT5mGvTz9E3w0171";

function uploadFile(file) {

    if (!file){
        console.error('No file to upload.');
        return;
    }
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    console.log(file);
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function (e) {
        var contentType = file.type || 'application/octet-stream';
        var metadata = {
            'name': file.name,
            'mimeType': contentType
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v3/files',
            'method': 'POST',
            'params': { 'uploadType': 'multipart' },
            'headers': {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'multipart/related; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        });

        request.execute(function (file) {
            console.log(file);
        });
    };
}

    


const ReviewForm = () => {
    const [formData, setFormData] = useState({
        courseName: '',
        professorName: '',
        courseRating: '',
        professorRating: '',
        reviewDescription: '',
        documentUpload: null
    });

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

    
    useEffect(() => {
        function start() {
            gapi.client.init({
                apiKey: 'AIzaSyB741SY92gk5TMU9M5nKzIk7vPoDq-P0NQ',
                clientId: '475017443270-lvbqsd7r9imro4orfjs1uef68blknej4.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/drive.file',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            }).then(() => {
                console.log('GAPI client initialized.');
            });
        }

        gapi.load('client:auth2', start);
    }, []);
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if(formData.courseName === "")
            {
                setError("Course name field cannot be empty!");
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
            //console.log(formData.documentUpload);
            uploadFile(formData.documentUpload);

        }
        
        catch (e) {
            setError(e.message);
        }

        console.log("Successfully made review!");
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
