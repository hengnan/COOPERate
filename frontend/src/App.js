import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Import CSS file for styling
import moment from 'moment';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('user');
  const [sortOption, setSortOption] = useState('time-ascending'); // Default sorting by time in ascending order
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [endFeed, setFeed] = useState(false);
  const endOfPageRef = useRef(null);
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  function formatDate(timestamp) {
    const [month, day, year] = timestamp.split('/'); // Split the timestamp into parts
    const date = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD'); // Create a Moment.js object
  
    return date.format('MMMM Do, YYYY'); // Format the date
  }

  const fetchReviews = async () => {
    
    if (endFeed){return;}
    var endpoint = 'http://localhost:8080';

    if(searchType === 'user') {endpoint += '/user_id/' + searchQuery;}

    else if(searchType === 'professor') {endpoint += '/prof_id/' + searchQuery;}

    else {endpoint += '/course_id/' + searchQuery;}

    endpoint += '/Reviews';
    if (sortOption === 'time-ascending')
    {
      endpoint += '/created_at/ASC/';
    }
    else if (sortOption === 'time-descending') {endpoint += '/created_at/DESC/';}

    else if (sortOption === 'likes-ascending') {endpoint += '/net_likes/ASC/';}

    else {endpoint += '/net_likes/DESC/';}

    endpoint += page.toString();

    console.log(endpoint);

    
    
    // Simulating fetching data from an endpoint
    try {
      setLoading(true);
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {setFeed(true);}
        setReviews((prevReviews) => [...prevReviews, ...data]); // Append new reviews to existing reviews
        setPage((page) => page + 1);
      } else {
        console.error('Failed to fetch reviews:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
    finally {
      setLoading(false);
    }

  };

  const handleSearch = () => {
    setFeed(false);
    setPage(0); // Reset page number on new search
    setReviews([]); // Clear existing reviews on new search
    fetchReviews();
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        fetchReviews();
      }
    }, { threshold: 0.5 });

    if (endOfPageRef.current) {
      observer.observe(endOfPageRef.current);
    }

    return () => {
      if (endOfPageRef.current) {
        observer.unobserve(endOfPageRef.current);
      }
    };
  }, [endOfPageRef, loading]);

  const handleLike = (reviewId) => {
    // Update the UI with the new net likes count
    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        const isLiked = !review.isLiked;
        const netLikes = isLiked ? review.netLikes + 1 : review.netLikes - 1;
        return { ...review, netLikes, isLiked };
      }
      return review;
    });
    setReviews(updatedReviews);
  };

  const handleDislike = (reviewId) => {
    // Update the UI with the new net likes count
    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        const isDisliked = !review.isDisliked;
        const netLikes = isDisliked ? review.netLikes - 1 : review.netLikes + 1;
        return { ...review, netLikes, isDisliked };
      }
      return review;
    });
    setReviews(updatedReviews);
  };




  return (
    <div className="container">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select value={searchType} onChange={handleSearchTypeChange} className="select">
          <option value="user">User</option>
          <option value="professor">Professor</option>
          <option value="course">Course</option>
        </select>
        <select value={sortOption} onChange={handleSortOptionChange} className="select">
          <option value="time-ascending">Oldest</option>
          <option value="time-descending">Newest</option>
          <option value="likes-ascending">Most Liked</option>
          <option value="likes-descending">Least Liked</option>
        </select>
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.map((review, index) => (
          <div key={index} className="review-container">
            <div className="user-course-prof-container">
              <p>User ID: {review.userId}</p>
              <p> Course ID: {review.courseId}, Prof ID: {review.profId}</p>
            </div>
            <div className="review-content">
              <div className = "review-text">
                <p>{review.review}</p>
              </div>
              <div className="ratings-container">
                <div className="prof-rating">
                  <p>Prof Rating: {review.profRating}</p>
                </div>
                <div className="course-rating">
                  <p>Course Rating: {review.courseRating}</p>
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
        <div ref={endOfPageRef} />
      </div>
    </div>
  );
};

export default App;