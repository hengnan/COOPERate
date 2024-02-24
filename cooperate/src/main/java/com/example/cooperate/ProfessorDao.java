package com.example.cooperate;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ProfessorDao extends DataAccessObject<Professor>{
    private static final String GET_ONE = "SELECT * " +
            "FROM Professor WHERE id=?";

    private static final String INSERT = "INSERT INTO Professor (prof_name, rating, descrip)" +
            " VALUES (?, ?, ?)";

    private static final String UPDATE = "UPDATE Professor SET rating = ?, total_rating = ? WHERE id=?";

    private static final String LASTVAL = "SELECT last_value FROM prof_counter";

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
    @Override
    public Professor create(Professor dto) {
        try(PreparedStatement statement = this.connection.prepareStatement(INSERT);) {
            // counts from 1!!

            statement.setString(1, dto.getName());
            statement.setFloat(2, dto.getRating());
            statement.setString(3, dto.getDescription());
            statement.execute();
            Professor professor =  this.findById(dto.getId());

            int nextID = -1;
            ResultSet rs = this.connection.prepareStatement(LASTVAL).executeQuery();
            if (rs.next()){nextID = rs.getInt(1);}

            professor.setID(nextID);
            return professor;
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


}