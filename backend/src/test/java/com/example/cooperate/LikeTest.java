package com.example.cooperate;
import org.checkerframework.checker.units.qual.C;
import org.junit.jupiter.api.Test;
import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;
public class LikeTest {


     Object[] testLike(float old_karma_1, float old_karma_2, int old_net_likes, int reaction) {
         DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");

         Object[] obj = new Object[]{null, null};
         try {

             TestCase testCase = new TestCase(old_karma_1, old_karma_2, old_net_likes, 5, 5, 5, 5,5, 5);

             Connection connection = dcm.getConnection();


             int review_id = testCase.review.getId();

             int liked_id = testCase.user1.getId();

             testCase.user2.like(review_id, reaction, connection);

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
         Object[] obj = testLike((float)34.3, (float)23.2, 11, 1);

         //this.karma += likerKarma*react*5.0/100.0;

         //34.3 + 23.2*1*5/100 => 35.46

         //net_likes + react => 1

         assertEquals(12, (int) obj[0]);
         assertEquals((float) 35.46, (float) obj[1]);

     }

    @Test
    void test_2()
    {
        Object[] obj = testLike((float)18.19, (float)95.2, 0, -1);

        //this.karma += likerKarma*react*5.0/100.0;

        //18.19 + 95*5/100

        //net_likes + react => 1

        assertEquals(-1, (int) obj[0]);

        assertEquals((float) 13.43, (float) obj[1]);

    }

    @Test
    void test_3()
    {
        Object[] obj = testLike((float)1, (float)100, 5, -1);

        //this.karma += likerKarma*react*5.0/100.0;

        //1 + 100*(-1)*5/100 => -19 but we clip at 0 so this will make the user 1's karma just 0

        //net_likes + react => 1

        assertEquals(4, (int) obj[0]);

        assertEquals((float) 0, (float) obj[1]);

    }

    @Test
    void test_4()
    {
        Object[] obj = testLike((float)99.99, (float)100, 6, 1);

        //this.karma += likerKarma*react*5.0/100.0;

        //99.99 + 100*1*5/100 = 104.99 but we clip at 100 so user 1's karma will just be 100

        //net_likes + react => 1

        assertEquals(7, (int) obj[0]);

        assertEquals((float) 100, (float) obj[1]);

    }



}
