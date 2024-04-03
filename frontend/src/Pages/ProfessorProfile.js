import React, { useState, useEffect } from 'react';
import './ProfessorProfile.css';

const ProfessorProfile = () => {

    const [professorData, setProfessorData] = useState({
    profname: '',
    description: '',
    rating: 0
  });
  const [isLoading, setIsLoading] = useState(true);

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
  );
};

export default ProfessorProfile;
