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
	@GetMapping("/Users/{username}")
	public User getUser(@PathVariable("username") String username)
	{
		User user = new User();
		try {
			Connection connection = dcm.getConnection();
			UserDao userDao = new UserDao(connection);
			user = userDao.findByName(username);
			System.out.println(user);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
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
											
		try {
			Connection connection = dcm.getConnection();
			ReviewPage page = new ReviewPage(name, source, orderBy, order,
					2, pageNum*2);
			ReviewDao reviewDao = new ReviewDao(connection);
			reviews = reviewDao.getReviews(page);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		return reviews;
	}
	@CrossOrigin
	@GetMapping("/Courses/{courseName}")
	public Course getByCourseName(@PathVariable("courseName") String courseName) {

		Course course = new Course();
		try {
			Connection connection = dcm.getConnection();
			CourseDao courseDao = new CourseDao(connection);
			course = courseDao.findByName(courseName);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		return course;
	}
	@CrossOrigin
	@GetMapping("/Professors/{profName}")
	public Professor getByProfessorId(@PathVariable("profName") String profName)
	{
		System.out.println(profName);
		Professor prof = new Professor();
		try {
			Connection connection = dcm.getConnection();
			ProfessorDao professorDao = new ProfessorDao(connection);
			prof = professorDao.findByName(profName);
			System.out.println(prof);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		return prof;
	}

	@CrossOrigin
	@PostMapping("/createUser")
	public boolean createNewUser(@RequestBody String json) throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);
		User user = new User();
		try {
			Connection connection = dcm.getConnection();
			UserDao userDao = new UserDao(connection);


			user.setUserName(inputMap.get("username"));
			user.setPassword(inputMap.get("hashed_password"));
			user.setEmail(inputMap.get("email_address"));
			System.out.println(user);

			user = userDao.create(user);

		}
		catch (SQLException var8) {
			var8.printStackTrace();
			return false;
		}
		return true;
	}
	@CrossOrigin
	@PostMapping("/likeReview")
	public int likeReview(@RequestBody String json) throws JsonProcessingException {

		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);

		try {
			Connection connection = dcm.getConnection();
			ReviewDao reviewDao = new ReviewDao(connection);
			UserDao userDao = new UserDao(connection);

			User user = userDao.findById(Integer.parseInt(inputMap.get("liker_id")));

			if (user.getId() == 0) {return -2;}
			int react = Integer.parseInt(inputMap.get("reaction"));

			int review_id = Integer.parseInt(inputMap.get("review_id"));

			int success = user.like(review_id, react, connection);

			return success;

		}
		catch (SQLException var8) {
			var8.printStackTrace();
			return -3;
		}
	}
	@CrossOrigin
	@PostMapping("/makeReview")
	public int makeReview(@RequestBody String json) throws JsonProcessingException {

		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);


		int maxDescriptionLength =  1000;
		if (inputMap.get("review").length() > maxDescriptionLength){return -6;}

		try {
			Connection connection = dcm.getConnection();
			UserDao userDao = new UserDao(connection);
			ReviewDao reviewDao = new ReviewDao(connection);
			User user = userDao.findById(Integer.parseInt(inputMap.get("reviewer_id")));

      
			return user.makeReview(Integer.parseInt(inputMap.get("course_id")),
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
			return -4;
		}
	}
	@CrossOrigin
	@DeleteMapping("/DeleteReview/{reviewId}/{userId}")
    public int deleteReview(@PathVariable("reviewId") int reviewId, @PathVariable("userId") int userId) {

        try {
            Connection connection = dcm.getConnection();
            ReviewDao reviewDao = new ReviewDao(connection);
			Review review = reviewDao.findById(reviewId);
			
			if (userId != review.getUserId()) {return -3;}
			boolean isDeleted = reviewDao.deleteById(reviewId);

			User user = new User();

			user.setId(review.getUserId());
			user.delete(review, connection);
			if (isDeleted){return 0;}
			else {return -1;}
            
        } catch (SQLException e) {
            e.printStackTrace();
            return -2;
        }
    }

	public static void main(String[] args) {
		SpringApplication.run(CooperateApplication.class, args);
	}

}
