package com.example.cooperate;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ReviewDao extends DataAccessObject<Review> {

    private static final String GET_ONE = "SELECT * " +
            "FROM Reviews WHERE review_id=?";

    private static final String INSERT = "INSERT INTO Reviews (user_id, course_id, prof_id, username, course_name, prof_name, review, course_rating, prof_rating, orig_karma, hyperlink)" +
            " VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String UPDATE = "UPDATE Reviews SET net_likes = ? WHERE review_id=?";

    private static final String EXISTS = "SELECT *" +
            "FROM Reviews WHERE user_id =? AND course_id = ? AND prof_id = ?";

    private static final String REVIEWS = "SELECT * FROM Reviews " +
            "WHERE source LIKE '%' || ? || '%' ORDER BY order_by direction " +
            "LIMIT ? OFFSET ?";

    private static final String LASTVAL = "SELECT last_value FROM review_counter";

    public static final String DELETE = "DELETE FROM Reviews WHERE review_id = ?";

    public ReviewDao(Connection connection) {
        super(connection);
    }

    public boolean deleteById(int id){
        try (PreparedStatement statement = this.connection.prepareStatement(DELETE);) {
            statement.setInt(1, id);
            int deletedRows = statement.executeUpdate();
        return deletedRows == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public Review findById(int id) {
        Review review = new Review();

        try (PreparedStatement statement = this.connection.prepareStatement(GET_ONE);) {
            statement.setInt(1, id);
            ResultSet rs = statement.executeQuery();

            while (rs.next()) {
                review.setId(rs.getInt("review_id"));
                review.setUserId(rs.getInt("user_id"));
                review.setCourseId(rs.getInt("course_id"));
                review.setProfId(rs.getInt("prof_id"));
                review.setReview(rs.getString("review"));
                review.setCourse_name(rs.getString("course_name"));
                review.setUsername(rs.getString("username"));
                review.setProf_name(rs.getString("prof_name"));
                review.setOldKarma(rs.getFloat("orig_karma"));
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
    public Review create(Review dto) {
        try (PreparedStatement statement = this.connection.prepareStatement(INSERT);) {
            statement.setInt(1, dto.getUserId());
            statement.setInt(2, dto.getCourseId());
            statement.setInt(3, dto.getProfId());
            statement.setString(4, dto.getUsername());
            statement.setString(5, dto.getCourse_name());
            statement.setString(6, dto.getProf_name());
            statement.setString(7, dto.getReview());
            statement.setFloat(8, dto.getCourseRating());
            statement.setFloat(9, dto.getProfRating());
            statement.setFloat(10, dto.getOldKarma());
            statement.setString(11, dto.getHyperLink());
            statement.execute();

            int nextID = -1;
            ResultSet rs = this.connection.prepareStatement(LASTVAL).executeQuery();
            if (rs.next()){nextID = rs.getInt(1);}

            dto.setId(nextID);
            return dto;

        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void update(Review dto) {
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

    public ArrayList<Review> getReviews(ReviewPage page) {
        ArrayList<Review> reviews = new ArrayList<Review>();

        String command = REVIEWS.replace("source", page.getSource());
        command = command.replace("order_by", page.getOrderBy());
        command = command.replace("direction", page.getOrder());
        try (PreparedStatement statement = this.connection.prepareStatement(command);) {


            statement.setString(1, page.getId());
            statement.setInt(2, page.getNumPerPage());
            statement.setInt(3, page.getOffset());
            System.out.println(statement);
            ResultSet rs = statement.executeQuery();

            Review review;
            while (rs.next()) {
                review = new Review();
                review.setId(rs.getInt("review_id"));
                review.setUserId(rs.getInt("user_id"));
                review.setCourseId(rs.getInt("course_id"));
                review.setProfId(rs.getInt("prof_id"));
                review.setUsername(rs.getString("username"));
                review.setCourse_name(rs.getString("course_name"));
                review.setProf_name(rs.getString("prof_name"));
                review.setReview(rs.getString("review"));
                review.setCourseRating(rs.getFloat("course_rating"));
                review.setProfRating(rs.getFloat("prof_rating"));
                review.setNetLikes(rs.getInt("net_likes"));
                review.setOldKarma(rs.getFloat("orig_karma"));
                review.setTimestamp(rs.getTimestamp("created_at"));
                review.setHyperLink(rs.getString("hyperlink"));
                reviews.addLast(review);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        return reviews;
    }
}
