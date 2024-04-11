package com.example.cooperate;
import org.checkerframework.checker.units.qual.C;
import org.junit.jupiter.api.Test;
import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UnlikeTest {

    Object[] testUnlike(float old_karma_1, float old_karma_2, int old_net_likes, int reaction) {
        DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");

        Object[] obj = new Object[]{null, null};
        try {

            TestCase testCase = new TestCase(old_karma_1, old_karma_2, old_net_likes, 5, 5, 5, 5, 5, 5);

            Connection connection = dcm.getConnection();


            int review_id = testCase.review.getId();

            int liked_id = testCase.user1.getId();

            testCase.user2.like(review_id, reaction, connection);

            testCase.user2.deleteLike(review_id, connection);

            ReviewDao reviewDao = new ReviewDao(connection);
            UserDao userDao = new UserDao(connection);


            Review review = reviewDao.findById(review_id);
            User liked_user = userDao.findById(liked_id);

            obj = new Object[]{review.getNetLikes(), liked_user.getKarma()};
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return obj;
    }

    @Test
    void test_1()
    {
        Object[] obj = testUnlike((float)34.3, (float)23.2, 11, 1);

        assertEquals(11, (int) obj[0]);
        assertEquals((float) 34.3, (float) obj[1]);
    }

    @Test
    void test_2()
    {
        Object[] obj = testUnlike((float)88.2, (float)66.2, -1, -1);

        assertEquals(-1, (int) obj[0]);
        assertEquals((float) 88.2, (float) obj[1]);
    }
}
