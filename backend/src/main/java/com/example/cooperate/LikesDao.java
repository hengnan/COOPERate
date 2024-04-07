package com.example.cooperate;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class LikesDao extends DataAccessObject<Likes>{

    private static final String GET_ONE = "SELECT * " +
            "FROM Likes WHERE id=?";

    private static final String GET_BY_USER_REVIEW = "SELECT * " + "FROM Likes WHERE user_id =? AND review_id = ?";


    private static final String INSERT = "INSERT INTO Likes (user_id, review_id, react, orig_karma)" +
            " VALUES (?, ?, ?, ?)";

    private static final String EXISTS = "SELECT * " +
            "FROM Likes WHERE user_id =? AND review_id=?";

    private static final String LASTVAL = "SELECT last_value FROM likes_counter";

    private static final String REMOVE = "DELETE FROM Likes WHERE id=?";
    public LikesDao(Connection connection) {
        super(connection);
    }



    @Override
    public Likes findById(int id){
        Likes like = new Likes();

        try(PreparedStatement statement = this.connection.prepareStatement(GET_ONE);) {
            statement.setInt(1, id);
            ResultSet rs = statement.executeQuery();

            while(rs.next()) {
                like.setId(rs.getInt("id"));
                like.set_reviewId(rs.getInt("review_id"));
                like.set_userId(rs.getInt("user_id"));
                like.setReact(rs.getInt("react"));
                like.setKarma(rs.getFloat("orig_karma"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return like;
    }
    public Likes findByUserReview(int user_id, int review_id)
    {
        Likes like = new Likes();

        try(PreparedStatement statement = this.connection.prepareStatement(GET_BY_USER_REVIEW);) {
            statement.setInt(1, user_id);
            statement.setInt(2, review_id);
            ResultSet rs = statement.executeQuery();

            while(rs.next()) {
                like.setId(rs.getInt("id"));
                like.set_reviewId(rs.getInt("review_id"));
                like.set_userId(rs.getInt("user_id"));
                like.setReact(rs.getInt("react"));
                like.setKarma(rs.getFloat("orig_karma"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return like;
    }
    public void remove(int like_id) {
        try (PreparedStatement statement = this.connection.prepareStatement(REMOVE);) {
            statement.setInt(1, like_id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
    public boolean exists(int user_id, int review_id){
        try(PreparedStatement statement = this.connection.prepareStatement(EXISTS);)
        {
            statement.setInt(1, user_id);
            statement.setInt(2, review_id);
            ResultSet rs = statement.executeQuery();
            return rs.next();
        }
        catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
    @Override
    public Likes create(Likes dto) {

        try(PreparedStatement statement = this.connection.prepareStatement(INSERT);) {

            statement.setInt(1, dto.get_userId());
            statement.setInt(2, dto.get_reviewId());
            statement.setInt(3, dto.getReact());
            statement.setFloat(4, dto.getKarma());
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


}