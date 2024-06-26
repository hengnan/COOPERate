package com.example.cooperate;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ProfessorDao extends DataAccessObject<Professor>{
    private static final String GET_ONE = "SELECT * " +
            "FROM Professor WHERE id=?";

    private static final String GET_BY_NAME = "SELECT * " +
            "FROM Professor WHERE prof_name=?";

    private static final String  INSERT = "INSERT INTO Professor (prof_name, rating, descrip)" +
            " VALUES (?, ?, ?)";

    private static final String UPDATE = "UPDATE Professor SET rating = ?, total_rating = ? WHERE id=?";

    private static final String LASTVAL = "SELECT last_value FROM prof_counter";

    private static final String GET_RATINGS = "SELECT  prof_rating FROM Reviews JOIN Professor " +
            "ON Reviews.prof_id = Professor.id WHERE Professor.id = ?;";

    public ProfessorDao(Connection connection) {
        super(connection);
    }

    @Override
    public Professor findById(int id){
        Professor professor = new Professor();

        try(PreparedStatement statement = this.connection.prepareStatement(GET_ONE);) {
            statement.setInt(1, id);
            ResultSet rs = statement.executeQuery();

            while(rs.next()) {
                professor.setID(rs.getInt("id"));
                professor.setName(rs.getString("prof_name"));
                professor.setRating(rs.getFloat("rating"));
                professor.setTotalRating(rs.getFloat("total_rating"));
                professor.setDescription(rs.getString("descrip"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return professor;
    }

    public Professor findByName(String name){
        Professor professor = new Professor();

        try(PreparedStatement statement = this.connection.prepareStatement(GET_BY_NAME);) {
            statement.setString(1, name);
            System.out.println(statement);
            ResultSet rs = statement.executeQuery();

            while(rs.next()) {
                professor.setID(rs.getInt("id"));
                professor.setName(rs.getString("prof_name"));
                professor.setRating(rs.getFloat("rating"));
                professor.setTotalRating(rs.getFloat("total_rating"));
                professor.setDescription(rs.getString("descrip"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return professor;
    }


    @Override
    public Professor create(Professor dto) {
        try(PreparedStatement statement = this.connection.prepareStatement(INSERT);) {
            // counts from 1!!

            statement.setString(1, dto.getName());
            statement.setFloat(2, dto.getRating());
            statement.setString(3, dto.getDescription());
            statement.execute();

            int nextID = -1;
            ResultSet rs = this.connection.prepareStatement(LASTVAL).executeQuery();
            if (rs.next()){nextID = rs.getInt(1);}

            dto.setID(nextID);
            return dto;
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }



    public void update(Professor dto)
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

    public int[] getDistribution(int id)
    {
        int[] ratings = {0, 0, 0, 0, 0};
        try (PreparedStatement statement = this.connection.prepareStatement(GET_RATINGS);) {
            statement.setInt(1, id);
            ResultSet rs = statement.executeQuery();

            while(rs.next())
            {
                ratings[rs.getInt("prof_rating") - 1] ++;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return ratings;
    }


}