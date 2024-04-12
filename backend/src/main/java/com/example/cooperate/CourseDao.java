package com.example.cooperate;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class CourseDao extends DataAccessObject<Course>{

    private static final String GET_ONE = "SELECT * " +
            "FROM Course WHERE id=?";

    private static final String GET_BY_NAME = "SELECT * " +
            "FROM Course WHERE course_name=?";

    private static final String INSERT = "INSERT INTO Course (course_name, rating, descrip)" +
            " VALUES (?, ?, ?)";

    private static final String UPDATE = "UPDATE Course SET rating = ?, total_rating = ? WHERE id=?";

    private static final String LASTVAL = "SELECT last_value FROM course_counter";

    public CourseDao(Connection connection) {
        super(connection);
    }

    @Override
    public Course findById(int id){
        Course course = new Course();

        try(PreparedStatement statement = this.connection.prepareStatement(GET_ONE);) {
            statement.setInt(1, id);
            ResultSet rs = statement.executeQuery();

            while(rs.next()) {
                course.setId(rs.getInt("id"));
                course.setRating(rs.getFloat("rating"));
                course.setTotalRating(rs.getFloat("total_rating"));
                course.setName(rs.getString("course_name"));
                course.setDescription(rs.getString("descrip"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return course;
    }

    public Course findByName(String name)
    {
        Course course = new Course();

        try(PreparedStatement statement = this.connection.prepareStatement(GET_BY_NAME);) {
            statement.setString(1, name);
            ResultSet rs = statement.executeQuery();

            while(rs.next()) {
                course.setId(rs.getInt("id"));
                course.setRating(rs.getFloat("rating"));
                course.setTotalRating(rs.getFloat("total_rating"));
                course.setName(rs.getString("course_name"));
                course.setDescription(rs.getString("descrip"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return course;
    }
    @Override
    public Course create(Course dto) {
        try(PreparedStatement statement = this.connection.prepareStatement(INSERT);) {

            statement.setString(1, dto.getName());
            statement.setFloat(2, dto.getRating());
            statement.setString(3, dto.getDescription());
            statement.execute();

            int nextID = -1;
            ResultSet rs = this.connection.prepareStatement(LASTVAL).executeQuery();
            if (rs.next()){nextID = rs.getInt(1);}

            dto.setId(nextID);
            return dto;
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
    public void update(Course dto)
    {
        try (PreparedStatement statement = this.connection.prepareStatement(UPDATE);) {
            statement.setFloat(1, dto.getRating());
            statement.setFloat(2, dto.getTotalRating());
            statement.setInt(3, dto.getId());
            statement.execute();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

}