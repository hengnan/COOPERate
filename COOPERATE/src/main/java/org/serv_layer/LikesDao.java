package org.serv_layer;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class LikesDao extends DataAccessObject<Likes>{

    private static final String GET_ONE = "SELECT * " +
            "FROM Likes WHERE id=?";

    private static final String INSERT = "INSERT INTO Likes (user_id, review_id, react)" +
            " VALUES (?, ?, ?)";

    private static final String EXISTS = "SELECT *" +
            "FROM Likes WHERE user_id =? AND review_id=?";

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
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return like;
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
        //check if exists(dto.user_id, dto.review_id)
        //return Null
        try(PreparedStatement statement = this.connection.prepareStatement(INSERT);) {
            // counts from 1!!
            statement.setInt(1, dto.get_userId());
            statement.setInt(2, dto.get_reviewId());
            statement.setInt(3, dto.getReact());
            statement.execute();

            //UserDao dao = new UserDao(connection);
            //User liker = dao.findById(dto.get_userId());
            //Review review = dao.findById(dto.get_reviewId());
            //User reviewer = dao.findById(review.get_userId);
            //reviewer.updateKarma(liker.getKarma(), dto.getReact());
            //dao.update(reviewer);
            return this.findById(dto.getId());
        } catch(SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }


}