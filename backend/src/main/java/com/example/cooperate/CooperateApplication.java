package com.example.cooperate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Map;

@SpringBootApplication
@RestController
public class CooperateApplication {

	DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");

	@CrossOrigin
	@GetMapping("/Users/username/{username}")
	public User getUser(@PathVariable("username") String username)
	{
		Connection connection = null;
		User user = new User();
		try {
			connection = dcm.getConnection();
			UserDao userDao = new UserDao(connection);
			user = userDao.findByName(username);
			connection.close();
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		finally {
			if (connection != null)
			{
				try {connection.close();}

				catch (SQLException e) {}
			}
		}
		return user;
	}

	@CrossOrigin
	@GetMapping("/Users/email/{email}")
	public User getUserByEmail(@PathVariable("email") String email)
	{
		Connection connection = null;
		User user = new User();
		try {
			connection = dcm.getConnection();
			UserDao userDao = new UserDao(connection);
			user = userDao.findByEmail(email);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		finally {
			if (connection != null)
			{
				try {connection.close();}

				catch (SQLException e) {}
			}
		}
		return user;
	}
	@CrossOrigin
	@GetMapping("/{source}/{name}/Reviews/{orderedBy}/{order}/{pageNum}")
	public ArrayList<Review> getReviews(@PathVariable("source") String source,
										@PathVariable("name") String name,
										@PathVariable("orderedBy") String orderBy,
										@PathVariable("order") String order,
										@PathVariable("pageNum") int pageNum ) {

		ArrayList<Review> reviews = new ArrayList<Review>();

		Connection connection = null;
		try {
			connection = dcm.getConnection();
			ReviewPage page = new ReviewPage(name, source, orderBy, order,
					2, pageNum*2);
			ReviewDao reviewDao = new ReviewDao(connection);
			reviews = reviewDao.getReviews(page);

			System.out.println(reviews);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}

		finally {
			if (connection != null)
			{
				try {connection.close();}

				catch (SQLException e) {}
			}
		}
		return reviews;
	}
	@CrossOrigin
	@GetMapping("/Courses/{courseName}")
	public Course getByCourseName(@PathVariable("courseName") String courseName) {

		Course course = new Course();
		Connection connection = null;
		try {
			connection = dcm.getConnection();
			CourseDao courseDao = new CourseDao(connection);
			course = courseDao.findByName(courseName);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}

		finally {
			if (connection != null)
			{
				try {connection.close();}

				catch (SQLException e) {}
			}
		}
		return course;
	}
	@CrossOrigin
	@GetMapping("/Professors/{profName}")
	public Professor getByProfessorId(@PathVariable("profName") String profName)
	{
		System.out.println(profName);
		Connection connection = null;
		Professor prof = new Professor();
		try {
			connection = dcm.getConnection();
			ProfessorDao professorDao = new ProfessorDao(connection);
			prof = professorDao.findByName(profName);
			System.out.println(prof);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		finally {
			if (connection != null)
			{
				try {connection.close();}

				catch (SQLException e) {}
			}
		}
		return prof;
	}

	@CrossOrigin
	@PostMapping("/createUser")
	public boolean createNewUser(@RequestBody String json) throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);
		User user = new User();

		Connection connection = null;
		try {
			connection = dcm.getConnection();
			UserDao userDao = new UserDao(connection);


			user.setUserName(inputMap.get("username"));
			user.setPassword(inputMap.get("hashed_password"));
			user.setEmail(inputMap.get("email_address"));
			System.out.println(user);

			userDao.create(user);

		}
		catch (SQLException var8) {
			var8.printStackTrace();
			return false;
		}

		finally {
			if (connection != null)
			{
				try {connection.close();}

				catch (SQLException e) {}
			}
		}
		return true;
	}
	@CrossOrigin
	@PostMapping("/likeReview")
	public int likeReview(@RequestBody String json) throws JsonProcessingException {

		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);
		Connection connection = null;
		int err_code = 0;
		try {
			connection = dcm.getConnection();
			UserDao userDao = new UserDao(connection);

			User user = userDao.findById(Integer.parseInt(inputMap.get("liker_id")));

			if (user.getId() == 0) {return -2;}
			int react = Integer.parseInt(inputMap.get("reaction"));

			int review_id = Integer.parseInt(inputMap.get("review_id"));

			err_code = user.like(review_id, react, connection);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
			err_code = -3;
		}
		finally {
			if (connection != null)
			{
				try {connection.close();}

				catch (SQLException e) {}
			}
		}
		return err_code;
	}

	@CrossOrigin
	@PostMapping("/removeLike")
	public void removeLike(@RequestBody String json) throws JsonProcessingException {

		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);
		Connection connection = null;

		try{
			connection = dcm.getConnection();
			UserDao userDao = new UserDao(connection);
			User user = userDao.findById(Integer.parseInt(inputMap.get("liker_id")));
			user.deleteLike(Integer.parseInt(inputMap.get("review_id")), connection);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		finally {
			if (connection != null)
			{
				try {connection.close();}

				catch (SQLException e) {}
			}
		}
	}
	@CrossOrigin
	@PostMapping("/user-review")
	public int isLiked(@RequestBody String json) throws JsonProcessingException
	{
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);
		int exists = 0;
		Connection connection = null;

		try {
			connection = dcm.getConnection();
			LikesDao likedao = new LikesDao(connection);
			int liker_id = Integer.parseInt(inputMap.get("liker_id"));
			int review_id = Integer.parseInt(inputMap.get("review_id"));

			if (!likedao.exists(liker_id, review_id)){return exists;}

			Likes like = likedao.findByUserReview(Integer.parseInt(inputMap.get("liker_id")),
					Integer.parseInt(inputMap.get("review_id")));

			exists = like.getReact();

		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}

		finally {
			if (connection != null)
			{
				try {connection.close();}

				catch (SQLException e) {}
			}
		}
		return exists;
	}
	@CrossOrigin
	@PostMapping("/makeReview")
	public int makeReview(@RequestBody String json) throws JsonProcessingException {

		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);


		int maxDescriptionLength =  1000;
		if (inputMap.get("review").length() > maxDescriptionLength){return -6;}

		Connection connection = null;
		int err_code = 0;
		try {
			connection = dcm.getConnection();
			UserDao userDao = new UserDao(connection);
			ReviewDao reviewDao = new ReviewDao(connection);
			User user = userDao.findById(Integer.parseInt(inputMap.get("reviewer_id")));


			System.out.println(inputMap);
			err_code = user.makeReview(Integer.parseInt(inputMap.get("course_id")),
					Integer.parseInt(inputMap.get("prof_id")),
					inputMap.get("course_name"),
					inputMap.get("prof_name"),
					inputMap.get("review"),
					Integer.parseInt(inputMap.get("course_rating")),
					Integer.parseInt(inputMap.get("prof_rating")),
					inputMap.get("hyperlink"), connection);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
			err_code = -4;
		}
		finally {
			if (connection != null)
			{
				try {connection.close();}

				catch (SQLException e) {}
			}
		}
		return err_code;
	}
	@CrossOrigin
	@DeleteMapping("/DeleteReview/{reviewId}/{userId}")
	public int deleteReview(@PathVariable("reviewId") int reviewId, @PathVariable("userId") int userId) {

		Connection connection = null;
		int err_code = -3;
		try {
			connection = dcm.getConnection();
			ReviewDao reviewDao = new ReviewDao(connection);
			Review review = reviewDao.findById(reviewId);

			if (userId != review.getUserId()) {return -3;}
			boolean isDeleted = reviewDao.deleteById(reviewId);

			User user = new User();

			user.setId(review.getUserId());
			user.delete(review, connection);
			if (isDeleted){err_code = 0;}
			else {err_code = -1;}

		} catch (SQLException e) {
			e.printStackTrace();
			err_code = -2;
		}
		finally {
			if (connection != null)
			{
				try {connection.close();}

				catch (SQLException e) {}
			}
		}
		return err_code;
	}

	public static void main(String[] args) {
		SpringApplication.run(CooperateApplication.class, args);
	}

}