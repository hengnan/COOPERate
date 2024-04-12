package com.example.cooperate;

import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class SearchProfessorTest {

    @Test
    void test_1()
    {
        Professor found_professor = new Professor();
        try {
            DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");
            Connection connection = dcm.getConnection();

            Professor prof = new Professor();
            prof.setName("test-professor");
            prof.setDescription("a test professor");
            prof.setRating(5);


            ProfessorDao profDao = new ProfessorDao(connection);

            prof = profDao.create(prof);

            found_professor = profDao.findById(prof.getId());
        }
        catch(SQLException e)
        {
            e.printStackTrace();
        }

        assertEquals("test-professor", found_professor.getName());
        assertEquals("a test professor", found_professor.getDescription());
        assertEquals(5, found_professor.getRating());
    }

    @Test
    void test_2()
    {
        Professor found_professor = new Professor();
        try {
            DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");
            Connection connection = dcm.getConnection();

            Professor prof = new Professor();
            prof.setName("test-professor");
            prof.setDescription("a test professor");
            prof.setRating(5);


            ProfessorDao profDao = new ProfessorDao(connection);

            profDao.create(prof);

            found_professor = profDao.findByName("test-professor");
        }
        catch(SQLException e)
        {
            e.printStackTrace();
        }

        assertEquals("test-professor", found_professor.getName());
        assertEquals("a test professor", found_professor.getDescription());
        assertEquals(5, found_professor.getRating());
    }
}
