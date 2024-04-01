import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './UserProfile.css';

const UserProfile = () => {
  // State to hold user data
  const [userData, setUserData] = useState({
    username: '',
    dateJoined: '',
    karmaScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  function formatDate(timestamp) {
    console.log(timestamp);
    const [month, day, year] = timestamp.split('/'); // Split the timestamp into parts
    const date = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD'); // Create a Moment.js object
  
    return date.format('MMMM Do, YYYY'); // Format the date
  }

  // Function to fetch user data
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/Users/username/' + localStorage.getItem("view-user"));
      console.log(response);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      console.log(data);
      setUserData({
        username: data.userName,
        dateJoined: formatDate(data.timestamp),
        karmaScore: data.karma
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // Render the user profile
  return (
    <div className="user-profile">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>{userData.username}</h2>
          <p>Date Joined: {userData.dateJoined}</p>
          <p>Karma Score: {userData.karmaScore}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
