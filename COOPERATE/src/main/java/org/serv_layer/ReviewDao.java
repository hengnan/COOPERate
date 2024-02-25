package org.serv_layer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ReviewDao extends DataAccessObject<Review>{

    private static final String GET_ONE = "SELECT * " +
            "FROM Reviews WHERE review_id=?";

    private static final String INSERT = "INSERT INTO Reviews (user_id, course_id, prof_id, review, course_rating, prof_rating)" +
            " VALUES (?, ?, ?, ?, ?, ?)";

    private static final String UPDATE = "UPDATE Reviews SET net_likes = ? WHERE review_id=?";

    private static final String EXISTS = "SELECT *" +
            "FROM Reviews WHERE user_id =? AND course_id = ? AND prof_id = ?";

    public ReviewDao(Connection connection) {
        super(connection);
    }

    @Override
    public Review findById(int id)
    {
        Review review = new Review();

        try(PreparedStatement statement = this.connection.prepareStatement(GET_ONE);) {
            statement.setInt(1, id);
            ResultSet rs = statement.executeQuery();

            while(rs.next()) {
                review.setId(rs.getInt("review_id"));
                review.setUserId(rs.getInt("user_id"));
                review.setCourseId(rs.getInt("course_id"));
                review.setProfId(rs.getInt("prof_id"));
                review.setReview(rs.getString("review"));
                review.setCourseRating(rs.getFloat("course_rating"));
                review.setProfRating(rs.getFloat("prof_rating"));
                review.setNetLikes(rs.getInt("net_likes"));
                review.setTimestamp(rs.getTimestamp("created_at"));
                review.setHyperLink(rs.getString("hyperlink"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return review;
    }
    @Override
    public Review create(Review dto)
    {
        Review review = new Review();
        try(PreparedStatement statement = this.connection.prepareStatement(INSERT);) {

            statement.setInt(1, dto.getUserId());
            statement.setInt(2, dto.getCourseId());
            statement.setInt(3, dto.getProfId());
            statement.setString(4, dto.getReview());
            statement.setFloat(5, dto.getCourseRating());
            statement.setFloat(6, dto.getProfRating());
            statement.execute();
            return this.findById(dto.getId());

        }
        catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void update(Review dto)
    {
        try (PreparedStatement statement = this.connection.prepareStatement(UPDATE);) {
            statement.setFloat(1, dto.getNetLikes());
            statement.setInt(2, dto.getId());
            statement.execute();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public boolean exists(int user_id, int course_id, int prof_id) {
        try (PreparedStatement statement = this.connection.prepareStatement(EXISTS);) {
            statement.setInt(1, user_id);
            statement.setInt(2, course_id);
            statement.setInt(3, prof_id);
            ResultSet rs = statement.executeQuery();

            return (rs.next());

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }



}
