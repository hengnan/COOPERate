import React, { useState, useEffect, useRef } from 'react';
import './Reviews.css'; // Import CSS file for styling
import moment from 'moment';
import $ from 'jquery'; // Import jQuery
import 'jquery-ui/ui/widgets/autocomplete';

const ReviewsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Professors');
  const [sortOption, setSortOption] = useState('time-ascending'); // Default sorting by time in ascending order
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [endFeed, setFeed] = useState(false);
  const [overallRating, setRating] = useState(0);
  const endOfPageRef = useRef(null);
  const [searching, setSearching] = useState(false);
  const [validSearch, setValidSearch] = useState(true);
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
  useEffect(() => {
    // Define array of course and professor names
    const courseNames = ['Software Engineering', 'Integrated Circuits Engineering', 'Digital Signal Processing'];
    const professorNames = ['Christopher Hong', 'Jabeom Koo', 'Fred Fontaine'];
    var names = []
    if(searchType == "Professors"){names = professorNames;}
    else {names = courseNames;}
    // Initialize autocomplete for search input
    $('#searchInput').autocomplete({
      
      source: [...names],
      select: function(event, ui) {
        setSearchQuery(ui.item.value); // Update searchQuery state with selected suggestion
        return false; // Prevent default action of selecting the item
      },
    });
  }, []);



  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchReviews = async () => {
    
    if (endFeed){return;}
    var endpoint = 'http://localhost:8080';


    if(searchType === 'Professors') {endpoint += '/prof_name/' + searchQuery;}

    else {endpoint += '/course_name/' + searchQuery;}

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

  const fetchOverallRating = async () => {
    var endpoint = 'http://localhost:8080/' + searchType + "/" + searchQuery.toString();
  
    try {
      const response = await fetch(endpoint);
  
      if (response.ok) {
        const data = await response.json();
        if (data.id === 0) {
          setRating("N/A");
          return;
        }
        setRating(data.rating);
      } else {
        console.error('Failed to fetch overall rating:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching overall rating:', error);
    }
  };

  const handleSearch = async () => {
    
    setSearching(true);
    setFeed(false);
    setPage(0); // Reset page number on new search
    setReviews([]); // Clear existing reviews on new search

    await Promise.all([
      fetchReviews(),
      fetchOverallRating()
    ]);

  };

  useEffect(() => {
    if(!searching){return;}
    const ratingBox = document.getElementById('ratingBox');
    if (overallRating > 3) {
      ratingBox.classList.remove('low-rating');
      ratingBox.classList.add('high-rating');
    } else {
      ratingBox.classList.remove('high-rating');
      ratingBox.classList.add('low-rating');
    }
  }, [overallRating]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && searching) {
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
    <div className="container">
      <div class="banner">
        <h1 class="banner-title">COOPERATE</h1>
        <button className="button"><i className="fas fa-info-circle"></i> About Us</button>
        <button class="button"><i class="fas fa-archive"></i> Checkout Our Archive</button>
        <button class="button"><i class="fas fa-edit"></i> Make A Review</button>
        <button class="button"><i class="fas fa-sign-in-alt"></i> Login</button>
        <button class="profile-button"><i class="fas fa-user-circle"></i> Profile</button>
      </div>
      <div class="rating-box" id="ratingBox">
        <h2>Overall Rating</h2>
        <hr class="divider"></hr>
          <div class="rating-item">
            <p> {overallRating}</p>
          </div>
      </div>
      <div className="search-section">
        <input
          type="text"
          id = "searchInput"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleChange}
          /*onChange={(e) => setSearchQuery(e.target.value)}*/
          className={`search-input ${!validSearch ? 'invalid-search' : ''}`} 
        />

        
        <select value={searchType} onChange={handleSearchTypeChange} className="select">
          <option value="Professors">Professor</option>
          <option value="Courses">Course</option>
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
        <h2 class="banner-title">Reviews</h2>
        {reviews.map((review, index) => (
          <div key={index} className="review-container">
            <div className="user-course-prof-container">

              <p>Posted By <a href={`/user/${review.username}`}>{review.username}</a></p>
              <p> Course: <a href={`/course/${review.course_name}`}>{review.course_name}</a> &emsp; Professor: <a href={`/prof/${review.prof_name}}`}>{review.prof_name}</a></p>
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
        <div ref={endOfPageRef} />
      </div>
    </div>
  );
};

export default ReviewsPage;