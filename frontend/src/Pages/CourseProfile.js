import React, { useState, useEffect } from 'react';
import './CourseProfile.css';

const CourseProfile = () => {

    const [courseData, setCourseData] = useState({
    coursename: '',
    description: '',
    rating: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch course data
  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/Courses/' + localStorage.getItem("view-course"));
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setCourseData({
        coursename: data.name,
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
    fetchCourseData();
  }, []);

  // Render the course profile
  return (
    <div className="course-profile">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>{courseData.coursename}</h2>
          <p>Description: {courseData.description}</p>
          <p>Rating: {courseData.rating}</p>
        </div>
      )}
    </div>
  );
};

export default CourseProfile;
