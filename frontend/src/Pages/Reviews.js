import React, { useState, useEffect, useRef } from 'react';
import './Reviews.css';
import moment from 'moment';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/autocomplete';
import {getAuth, signOut} from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const ReviewsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Professors');
  const [sortOption, setSortOption] = useState('time-ascending');
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [endFeed, setFeed] = useState(false);
  const [overallRating, setRating] = useState(0);
  const endOfPageRef = useRef(null);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

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

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  function formatDate(timestamp) {
    const [month, day, year] = timestamp.split('/');
    const date = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
  
    return date.format('MMMM Do, YYYY');
  }

  useEffect(() => {
    const updateAutocompleteSource = () => {
      const courseNames = ['Software Engineering', 'Integrated Circuit Engineering', 'Digital Signals Processing'];
      const professorNames = ['Christopher Hong', 'Jabeom Koo', 'Fred Fontaine'];
      
      // Determine the source based on the selected search type
      const names = searchType === "Professors" ? professorNames : courseNames;
      
      // Check if autocomplete is already initialized and destroy it
      if ($("#searchInput").autocomplete("instance")) {
        $("#searchInput").autocomplete("destroy");
      }
      
      // Re-initialize autocomplete with the new source
      $("#searchInput").autocomplete({
        source: names,
        select: function(event, ui) {
          setSearchQuery(ui.item.value); // Update searchQuery state with selected suggestion
          return false; // Prevent default action of selecting the item
        },
      });
    };

    updateAutocompleteSource();

  // Attach change event listener to the searchType dropdown
  const searchTypeSelect = document.getElementById('searchTypeSelect');
  searchTypeSelect.addEventListener('change', updateAutocompleteSource);

  // Cleanup function to remove event listener and destroy autocomplete widget
  return () => {
    if (searchTypeSelect) {
      searchTypeSelect.removeEventListener('change', updateAutocompleteSource);
    }
    if ($("#searchInput").autocomplete("instance")) {
      $("#searchInput").autocomplete("destroy");
    }
  };
}, [searchType]); 


  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchReviews = async () => {
    if (endFeed) return;
    let endpoint = `http://localhost:8080`;
  
    if (searchType === 'Professors') {
      endpoint += `/prof_name/${searchQuery}`;
    } else {
      endpoint += `/course_name/${searchQuery}`;
    }
  
    endpoint += `/Reviews`;
  
    switch (sortOption) {
      case 'time-ascending':
        endpoint += '/created_at/ASC/';
        break;
      case 'time-descending':
        endpoint += '/created_at/DESC/';
        break;
      case 'likes-ascending':
        endpoint += '/net_likes/ASC/';
        break;
      case 'likes-descending':
        endpoint += '/net_likes/DESC/';
        break;
      default:
        // Add default action or log an error
        break;
    }
  
    endpoint += page.toString();
  
    console.log(endpoint);
  
    try {
      setLoading(true);
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          setFeed(true);
        } else {
          // Check like/dislike status for each review
          const reviewIds = data.map(review => review.id);
          const likeDislikeStatus = await fetchLikeDislikeStatus(reviewIds);
          const updatedReviews = data.map(review => ({
            ...review,
            isLiked: likeDislikeStatus[review.id]?.isLiked || false,
            isDisliked: likeDislikeStatus[review.id]?.isDisliked || false,
          }));
          setReviews((prevReviews) => [...prevReviews, ...updatedReviews]);
          setPage((prevPage) => prevPage + 1);
        }
      } else {
        console.error('Failed to fetch reviews:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };
  
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
    
    setFeed(false);
    setPage(0); // Reset page number on new search
    setReviews([]); // Clear existing reviews on new search
    setSearching(true);

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
    }, { threshold: 0.8 });

    if (endOfPageRef.current) {
      observer.observe(endOfPageRef.current);
    }

    return () => {
      if (endOfPageRef.current) {
        observer.unobserve(endOfPageRef.current);
      }
    };
  }, [endOfPageRef, loading]);




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






  return (
    <div className="container">
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
          <button onClick={handleLogout} class="button"><i class="fa fa-sign-out"></i> Logout</button>
        </a>
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
          className={`search-input`}
        />

        
        <select id="searchTypeSelect" value={searchType} onChange={handleSearchTypeChange} className="select">
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
        <div ref={endOfPageRef} />
      </div>
    </div>
  );
};

export default ReviewsPage;