package com.example.cooperate;

import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class SearchCourseTest {

    @Test
    void test_1()
    {
        Course found_course = new Course();
        try {
            DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");
            Connection connection = dcm.getConnection();

            Course course = new Course();
            course.setName("test-course");
            course.setDescription("a test course");
            course.setRating(5);


            CourseDao courseDao = new CourseDao(connection);

            course = courseDao.create(course);

            found_course = courseDao.findById(course.getId());
        }
        catch(SQLException e)
        {
            e.printStackTrace();
        }

        assertEquals("test-course", found_course.getName());
        assertEquals("a test course", found_course.getDescription());
        assertEquals(5, found_course.getRating());
    }

    @Test
    void test_2()
    {
        Course found_course = new Course();
        try {
            DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");
            Connection connection = dcm.getConnection();

            Course course = new Course();
            course.setName("test-course");
            course.setDescription("a test course");
            course.setRating(5);


            CourseDao courseDao = new CourseDao(connection);

            courseDao.create(course);

            found_course = courseDao.findByName("test-course");
        }
        catch(SQLException e)
        {
            e.printStackTrace();
        }

        assertEquals("test-course", found_course.getName());
        assertEquals("a test course", found_course.getDescription());
        assertEquals(5, found_course.getRating());
    }
}
