import React, { useState, useEffect } from 'react';
import './CourseProfile.css';
// Assuming Reviews component is responsible for rendering individual review
import moment from 'moment';
import {getAuth, signOut} from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const ProfessorProfile = () => {

  const [professorData, setProfessorData] = useState({
    profname: '',
    description: '',
    rating: 0
  });
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Assuming the endpoint supports offset for pagination

  const saveUsername = (username, event) => {
    event.preventDefault();
    localStorage.setItem('view-user', username);
    window.location.href = '/Users';
  }
  const saveCourse = (coursename, event) => {
    event.preventDefault();
    localStorage.setItem('view-course', coursename);
    window.location.href = '/Courses';
  }

  const saveProfessor = (profname, event) => {
    event.preventDefault();
    localStorage.setItem('view-professor', profname);
    window.location.href = '/Professors';
  }

const fetchProfessorData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/Professors/' + localStorage.getItem("view-professor"));
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProfessorData({
        profname: data.name,
        description: data.description,
        rating: data.rating
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function formatDate(timestamp) {
    const [month, day, year] = timestamp.split('/');
    const date = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
  
    return date.format('MMMM Do, YYYY');
  }

  const fetchLikeDislikeStatus = async (reviewIds) => {
    const endpoint = 'http://localhost:8080/user-review';

    var reviewLookup = new Map();
    for (let i = 0; i < reviewIds.length; i++){
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ liker_id: localStorage.getItem("user_id"), review_id: '' + reviewIds[i]}),
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        const reaction = await response.json();

        reviewLookup[reviewIds[i]] = {isLiked: reaction == 1, isDisliked : reaction == -1};

      }
      catch (error) {
        console.error('Error fetching like/dislike status:', error);
        return {};
      }        
    }
    return reviewLookup;
  };

  // New method to fetch reviews
  const fetchReviews = async () => {
    try {
      // Call the endpoint three times to fetch 6 reviews
      for (let i = 0; i < 3; i++) {
        const response = await fetch('http://localhost:8080/prof_name/' +localStorage.getItem("view-professor") + '/Reviews/net_likes/DESC/' + i); // Adjust the endpoint accordingly
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        const reviewIds = data.map(review => review.id);
          const likeDislikeStatus = await fetchLikeDislikeStatus(reviewIds);
          const updatedReviews = data.map(review => ({
            ...review,
            isLiked: likeDislikeStatus[review.id]?.isLiked || false,
            isDisliked: likeDislikeStatus[review.id]?.isDisliked || false,
          }));
        setReviews(prev => [...prev, ...updatedReviews]); // Append new reviews to existing ones
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleLikeDislikeRequest = async (reviewId, action) => {


    if (action.slice(0, 2) == "un") {
      var endpoint = 'http://localhost:8080/removeLike';
      var body = JSON.stringify({ liker_id: localStorage.getItem("user_id"), review_id: '' + reviewId});
    }
    else {
      var endpoint = 'http://localhost:8080/likeReview';
  
      
      if (action == 'like'){ var react = '1';}
  
      else{var react = '-1';}
      var body = JSON.stringify({ liker_id: localStorage.getItem("user_id"), review_id: '' + reviewId, reaction: react })
    }
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body
      });
  
      if (!response.ok) throw new Error('Network response was not ok.');
  
    } catch (error) {
      console.error('Error performing like/dislike action:', error);
    }
  };

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
    };

  
  
  const handleLike = async (reviewId) => {
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) return;
  
    const review = reviews[reviewIndex];
    const isLiked = !review.isLiked;
    const isDisliked = review.isDisliked;
    const action = isLiked ? 'like' : 'unlike';
  
    if (isDisliked) {
      await handleLikeDislikeRequest(reviewId, "undislike");
    }
    await handleLikeDislikeRequest(reviewId, action);
  
    // Update netLikes based on the new like status and previous dislike status
    let netLikes = review.netLikes;
    if (isLiked) {
      netLikes += 1; // Increase for the like
      if (isDisliked) {
        netLikes += 1; // Correct for previously disliked now being liked
      }
    } else {
      netLikes -= 1; // Decrease for the unlike
    }
  
    // Ensure isDisliked is turned off if the review is now liked
    const updatedReview = {
      ...review,
      netLikes,
      isLiked,
      isDisliked: isLiked ? false : review.isDisliked,
    };
  
    // Update reviews array with the updated review
    const updatedReviews = [...reviews.slice(0, reviewIndex), updatedReview, ...reviews.slice(reviewIndex + 1)];
    setReviews(updatedReviews);
  };
  const handleDislike = async (reviewId) => {
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) return;
  
    const review = reviews[reviewIndex];
    const isDisliked = !review.isDisliked;
    const isLiked = review.isLiked;
    const action = isDisliked ? 'dislike' : 'undislike';
  
    if (isLiked)
    {
      await handleLikeDislikeRequest(reviewId, "unlike");
    }
  
    await handleLikeDislikeRequest(reviewId, action);
  
    // Update netLikes based on the new dislike status and previous like status
    let netLikes = review.netLikes;
    if (isDisliked) {
      netLikes -= 1; // Decrease for the dislike
      if (isLiked) {
        netLikes -= 1; // Correct for previously liked now being disliked
      }
    } else {
      netLikes += 1; // Increase for the undislike
    }
  
    // Ensure isLiked is turned off if the review is now disliked
    const updatedReview = {
      ...review,
      netLikes,
      isLiked: isDisliked ? false : review.isLiked,
      isDisliked,
    };
  
    // Update reviews array with the updated review
    const updatedReviews = [...reviews.slice(0, reviewIndex), updatedReview, ...reviews.slice(reviewIndex + 1)];
    setReviews(updatedReviews);
  };

  const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled">&#9733;</span>);
      } else {
        stars.push(<span key={i} className="star">&#9734;</span>);
      }
    }
    return <div>{stars}</div>;
  };


  useEffect(() => {
    fetchProfessorData();
    fetchReviews(); // Fetch reviews when the component mounts
  }, []);

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
        <div className="professor-profile">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>{professorData.profname}</h2>
          <p>Description: {professorData.description}</p>
          <p>Rating: {professorData.rating}</p>
        </div>
      )}
      </div>
      <div className="reviews-section">
        <h2 class="banner-title">Reviews</h2>
        {reviews.map((review, index) => (
          <div key={index} className="review-container">
            <div className="user-course-prof-container">

              <p>Posted By <a href={'/Users'} onClick= {(e) => saveUsername(review.username, e)}> {review.username}</a></p>
              <p> Course: <a href={'/Courses'} onClick = {(e) => saveCourse(review.course_name, e)}> {review.course_name}</a> &emsp; Professor: <a href={`/Professors`} onClick = {(e) => saveProfessor(review.prof_name, e)}>{review.prof_name}</a></p>
            </div>
            <div className="review-content">
              <div className = "review-text">
                <p>{review.review}</p>
              </div>
              <div className="ratings-container">
                <div className={`prof-rating ${review.profRating < 3 ? 'low-rating' : review.profRating >= 3 ? 'high-rating' : ''}`}>
                  <p>Professor</p>
                  <StarRating rating={review.profRating} />
                </div>
                <div className={`course-rating ${review.courseRating < 3 ? 'low-rating' : review.courseRating >= 3 ? 'high-rating' : ''}`}>
                  <p>Course</p>
                  <StarRating rating={review.courseRating} />
                </div>
              </div>
              <div className="timestamp">
                <p>{formatDate(review.timestamp.toString().substring(0, 10))}</p>
              </div>
              <div className="like-dislike">
                <button className="like-button" onClick = {() => handleLike(review.id)}>
                  <span className={`like-icon ${review.isLiked ? 'highlighted' : ''}`}><i className="fas fa-thumbs-up"></i></span>
                </button>
                <p className="net-likes">{review.netLikes}</p>
                <button className="dislike-button" onClick = {() => handleDislike(review.id)}>
                  <span className={`dislike-icon ${review.isDisliked ? 'highlighted' : ''}`}><i className="fas fa-thumbs-down"></i></span>
                </button>
                </div>
            </div>
          </div>
        ))}
        </div>
      </div>
  );
}

export default ProfessorProfile;
