package com.example.cooperate;
import org.checkerframework.checker.units.qual.C;
import org.junit.jupiter.api.Test;
import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;
public class ReviewTest {

    Object[] testReview(float old_karma_1, float course_rating, float courseTotalRating, float prof_rating, float profTotalRating, int user_course_rating, int user_prof_rating) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");

        Object[] obj = new Object[]{null, null};
        try {
            TestCase testCase = new TestCase(old_karma_1, 20, 0, course_rating, courseTotalRating, prof_rating, profTotalRating, user_course_rating, user_prof_rating);
            Connection connection = dcm.getConnection();

            int review_id = testCase.review.getId();
            ReviewDao reviewDao = new ReviewDao(connection);
            Review review = reviewDao.findById(review_id);

            CourseDao courseDao = new CourseDao(connection);
            Course course = courseDao.findById(review.getCourseId());

            ProfessorDao profDao = new ProfessorDao(connection);
            Professor professor = profDao.findById(review.getProfId());


            obj = new Object[]{course.getRating(), professor.getRating()};
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return obj;
    }

    @Test
    void test_1()
    {
        Object[] obj = testReview((float) 35.9, (float)4.6, 520, (float)3.9, 580, 1, 5);

        //course:
        //(4.6*520 + 1*35.9)/(35.9 + 520) => 4.36751214

        //(3.9*580 + 5*35.9)/(35.9 + 580) => 3.96411755



        assertEquals((float)obj[0], (float) 4.36751214, 1e-4);
        assertEquals((float)obj[1], (float) 3.96411755, 1e-4);

    }
    @Test
    void test_2()
    {
        Object[] obj = testReview((float) 100, (float)4.6, 520, (float)3.9, 580, 1, 5);

        //course:
        //(4.6*520 + 1*100)/(100 + 520) => 4.01935484

        //(3.9*580 + 5*100)/(100 + 580) => 4.06176471



        assertEquals((float)obj[0], (float) 4.01935484, 1e-4);
        assertEquals((float)obj[1], (float) 4.06176471, 1e-4);
    }
    @Test
    void test_3()
    {
        Object[] obj = testReview((float) 10, (float)4.6, 520, (float)3.9, 580, 1, 5);

        //course:
        //(4.6*520 + 1*10)/(10 + 520) => 4.53207547

        //(3.9*580 + 5*10)/(10 + 580) =>3.91864407



        assertEquals((float)obj[0], (float) 4.53207547, 1e-4);
        assertEquals((float)obj[1], (float) 3.91864407, 1e-4);

    }
}
