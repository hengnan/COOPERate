package com.example.cooperate;

import java.sql.Connection;
import java.sql.SQLException;

public class TestCase {
    public User user1;
    public User user2;
    public Review review;
    public Course course;
    public Professor professor;

    public TestCase(float karma1, float karma2, int net_likes, float course_rating, float course_total_rating, float prof_rating, float prof_total_rating,
                    int user_course_rating, int user_prof_rating)
    {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");
        try {


            Connection connection = dcm.getConnection();
            UserDao userDao = new UserDao(connection);
            CourseDao courseDao = new CourseDao(connection);
            ProfessorDao profDao = new ProfessorDao(connection);
            ReviewDao reviewDao = new ReviewDao(connection);

            user1 = new User();
            user1.setUserName("test-user-1");
            user1.setPassword("password");
            user1.setEmail("test1@cooper.edu");

            user1 = userDao.create(user1);
            user1.setKarma(karma1);

            userDao.update(user1);

            user2 = new User();
            user2.setUserName("test-user-1");
            user2.setPassword("password");
            user2.setEmail("test1@cooper.edu");

            user2 = userDao.create(user2);

            user2.setKarma(karma2);
            userDao.update(user2);

            course = new Course();
            course.setName("Course_Test_0");
            course.setDescription("Testing Purposes");
            course.setRating(course_rating);

            course = courseDao.create(course);
            course.setTotalRating(course_total_rating);

            courseDao.update(course);

            professor = new Professor();
            professor.setName("Course_Test_0");
            professor.setDescription("Testing Purposes");
            professor.setRating(prof_rating);

            professor = profDao.create(professor);
            professor.setTotalRating(prof_total_rating);

            profDao.update(professor);

            String review_des = "testing";
            int review_id = user1.makeReview(course.getId(), professor.getId(), course.getName(), professor.getName(),
                    review_des, user_course_rating, user_prof_rating, "", connection);
            review = reviewDao.findById(review_id);
            review.setNetLikes(net_likes);

            reviewDao.update(review);
        }

        catch(SQLException e)
        {
            e.printStackTrace();
        }

    }
}
