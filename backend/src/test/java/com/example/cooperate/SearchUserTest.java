package com.example.cooperate;

import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;
import static org.junit.jupiter.api.Assertions.assertEquals;


public class SearchUserTest {

    @Test
    void test_1()
    {
        User found_user = new User();
        try
        {
            DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");
            Connection connection = dcm.getConnection();

            UserDao userDao = new UserDao(connection);
            User user = new User();
            user.setUserName("testing-user");
            user.setEmail("testtest@cooper.edu");
            user.setPassword("password");
            userDao.create(user);

            found_user = userDao.findById(user.getId());
        }

        catch (SQLException e)
        {
            e.printStackTrace();
        }

        assertEquals( "testing-user", found_user.getUserName());
        assertEquals("testtest@cooper.edu", found_user.getEmail());
        assertEquals("password", found_user.getPassword());
    }

    @Test
    void test_2()
    {
        User found_user = new User();
        try
        {
            DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");
            Connection connection = dcm.getConnection();

            UserDao userDao = new UserDao(connection);
            User user = new User();
            user.setUserName("testing-user");
            user.setEmail("testtest2@cooper.edu");
            user.setPassword("password");
            userDao.create(user);

            found_user = userDao.findByEmail("testtest2@cooper.edu");
        }

        catch (SQLException e)
        {
            e.printStackTrace();
        }

        assertEquals( "testing-user", found_user.getUserName());
        assertEquals("testtest2@cooper.edu", found_user.getEmail());
        assertEquals("password", found_user.getPassword());
    }
}
