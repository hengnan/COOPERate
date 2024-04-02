import React, { useState, useEffect, useRef } from 'react';
import './UserProfile.css'; 
import './Reviews.css';
import moment from 'moment';

const UserProfilePage = () => {
  const [userDetails, setUserDetails] = useState({ username: '', karma: '', dateJoined: '' });
  const [reviews, setReviews] = useState([]);
  const [sortOption, setSortOption] = useState('time-ascending');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [endFeed, setFeed] = useState(false);
  const endOfPageRef = useRef(null);
  const username = localStorage.getItem('view-user'); // or any other logic you use to determine the user

  function formatDate(timestamp) {
    const [month, day, year] = timestamp.split('/'); // Split the timestamp into parts
    const date = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD'); // Create a Moment.js object
  
    return date.format('MMMM Do, YYYY'); // Format the date
  }

  const saveUsername = (username, event) => {
    event.preventDefault();
    localStorage.setItem('view-user', username);
    window.location.href = '/Users';
  }

  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const userDetailsResponse = await fetch(`http://localhost:8080/Users/username/${username}`);
        if (!userDetailsResponse.ok) throw new Error('Failed to fetch user details');
        const userDetailsData = await userDetailsResponse.json();
        setUserDetails({
          username: userDetailsData.userName,
          karma: userDetailsData.karma,
          dateJoined: formatDate(userDetailsData.timestamp)
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
    fetchReviews(); // Initial fetch for reviews

    // Setup intersection observer for infinite scrolling
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading && !endFeed) {
        fetchReviews();
      }
    }, { threshold: 0.5 });

    if (endOfPageRef.current) observer.observe(endOfPageRef.current);

    return () => observer.disconnect();
  }, [username, sortOption, page]);

  const fetchReviews = async () => {
    if (endFeed) return;
    setLoading(true);

    var endpoint = 'http://localhost:8080/userName/' + username + '/Reviews'

    if (sortOption === 'time-ascending') {endpoint += '/created_at/ASC/';}

    else if (sortOption === 'time-descending') {endpoint += '/created_at/DESC/';}

    else if (sortOption === 'likes-ascending') {endpoint += '/net_likes/ASC/';}

    else {endpoint += '/net_likes/DESC/';}

    endpoint += page.toString();

    console.log(endpoint);
    
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.length === 0) setFeed(true);
      else {
        setReviews(prev => [...prev, ...data]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortOptionChange = event => {
    setSortOption(event.target.value);
    setPage(0);
    setReviews([]);
    setFeed(false);
  };

  const handleLike = (reviewId) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        // Determine if the review is currently liked or not
        const isLiked = !review.isLiked;
        // Adjust the netLikes based on the new like status and previous dislike status
        let netLikes = review.netLikes;
        if (isLiked) {
          netLikes += 1; // Increase for the like
          if (review.isDisliked) {
            netLikes += 1; // Increase again if it was previously disliked
          }
        } else {
          netLikes -= 1; // Decrease if unliking
        }
  
        // Ensure isDisliked is turned off if the review is now liked
        const isDisliked = isLiked ? false : review.isDisliked;
  
        return { ...review, netLikes, isLiked, isDisliked };
      }
      return review;
    });
    setReviews(updatedReviews);
  };
  
  const handleDislike = (reviewId) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        // Determine if the review is currently disliked or not
        const isDisliked = !review.isDisliked;
        // Adjust the netLikes based on the new dislike status and previous like status
        let netLikes = review.netLikes;
        if (isDisliked) {
          netLikes -= 1; // Decrease for the dislike
          if (review.isLiked) {
            netLikes -= 1; // Decrease again if it was previously liked
          }
        } else {
          netLikes += 1; // Increase if undislking
        }
  
        // Ensure isLiked is turned off if the review is now disliked
        const isLiked = isDisliked ? false : review.isLiked;
  
        return { ...review, netLikes, isLiked, isDisliked };
      }
      return review;
    });
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

  return (
    
    <div className="user-profile-page">
      <div class="banner">
        <h1 class="banner-title">COOPERATE</h1>
        <a href = "/" class="button-link">
          <button class="button"><i className="fas fa-info-circle"></i> About Us</button>
        </a>
        <a href = "https://drive.google.com/drive/u/2/folders/1qej-Xkxx8fBXSTjRDwYHEwKpz5JJsphx" class="button-link">
          <button class="button"><i class="fas fa-archive"></i> Checkout Our Archive</button>
        </a>
        <a href = "/makeReview" class="button-link">
          <button class="button"><i class="fas fa-edit"></i> Make A Review</button>
        </a>
        <a href = "/Users" onClick= {(e) => saveUsername(localStorage.getItem("username"), e)} class="button-link">
          <button class="profile-button"><i class="fas fa-user-circle"></i> Profile</button>
        </a>
      </div>
      <div className="user-profile">
        <h2>{username}</h2>
        <p>Karma Score: {userDetails.karma}</p>
        <p>Date Joined: {userDetails.dateJoined}</p>
      </div>
      <div className="sort-options">
        <select value={sortOption} onChange={handleSortOptionChange} className="select">
          <option value="time-ascending">Oldest</option>
          <option value="time-descending">Newest</option>
          <option value="likes-ascending">Most Liked</option>
          <option value="likes-descending">Least Liked</option>
        </select>
      </div>
      <div className="reviews-section">
        {reviews.map((review, index) => (
          <div key={index} className="review-container">
          <div className="user-course-prof-container">

            <p>Posted By <a href={'/Users'} onClick= {(e) => saveUsername(review.username, e)}> {review.username}</a></p>
            <p> Course: <a href={`/course/${review.course_name}`}> {review.course_name}</a> &emsp; Professor: <a href={`/prof/${review.prof_name}}`}>{review.prof_name}</a></p>
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
        <div ref={endOfPageRef}></div>
      </div>
    </div>
  );
};

export default UserProfilePage;
