package com.example.cooperate;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDao extends DataAccessObject<User> {

    private static final String GET_ONE = "SELECT * " +
            "FROM Users WHERE id=?";

    private static final String INSERT = "INSERT INTO users (id, username, hashed_password, email_address)" +
            " VALUES (?, ?, ?, ?)";

    private static final String UPDATE = "UPDATE users SET karma = ? WHERE id=?";

    public UserDao(Connection connection) {
        super(connection);
    }

    @Override
    public User findById(int id) {
        User user = new User();

        try (PreparedStatement statement = this.connection.prepareStatement(GET_ONE);) {
            statement.setInt(1, id);
            ResultSet rs = statement.executeQuery();

            while (rs.next()) {
                user.setId(rs.getInt("id"));
                user.setUserName(rs.getString("username"));
                user.setPassword(rs.getString("hashed_password"));
                user.setEmail(rs.getString("email_address"));
                user.setKarma(rs.getFloat("karma"));
                user.setTimestamp(rs.getTimestamp("created_at"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        return user;
    }

    @Override
    public User create(User dto) {
        try (PreparedStatement statement = this.connection.prepareStatement(INSERT);) {
            // counts from 1!!
            statement.setInt(1, dto.getId());
            statement.setString(2, dto.getUserName());
            statement.setString(3, dto.getPassword());
            statement.setString(4, dto.getEmail());
            statement.execute();
            return this.findById(dto.getId());
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void update(User dto) {
        try (PreparedStatement statement = this.connection.prepareStatement(UPDATE);) {
            statement.setFloat(1, dto.getKarma());
            statement.setInt(2, dto.getId());
            statement.execute();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}