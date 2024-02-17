package org.serv_layer;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ProfessorDao extends DataAccessObject<Professor>{

    private static final String GET_ONE = "SELECT * " +
            "FROM Professor WHERE id=?";

    private static final String INSERT = "INSERT INTO Professor (id, prof_name, rating, descrip)" +
            " VALUES (?, ?, ?, ?)";

    private static final String UPDATE = "UPDATE Professor SET rating = ?, total_rating = ? WHERE id=?";


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
        Professor professor = new Professor();
        try(PreparedStatement statement = this.connection.prepareStatement(INSERT);) {
            // counts from 1!!
            statement.setInt(1, dto.getId());
            statement.setString(2, dto.getName());
            statement.setFloat(3, dto.getRating());
            statement.setString(4, dto.getDescription());
            statement.execute();
            return this.findById(dto.getId());
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