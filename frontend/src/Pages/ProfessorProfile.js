import React, { useState, useEffect } from 'react';
import './ProfessorProfile.css';

const ProfessorProfile = () => {

    const [professorData, setProfessorData] = useState({
    profname: '',
    description: '',
    rating: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const saveUsername = (username, event) => {
    event.preventDefault();
    localStorage.setItem('view-user', username);
    window.location.href = '/Users';
  }

  // Function to fetch professor data
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

  // Fetch course data when the component mounts
  useEffect(() => {
    fetchProfessorData();
  }, []);

  // Render the course profile
  return (
    <div>
    <div class="banner">
        <h1 class="banner-title">COOPERATE</h1>
        <a href = "/" class="button-link">
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
    </div>
  );
};

export default ProfessorProfile;
