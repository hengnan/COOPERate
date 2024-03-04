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

	String hostname = "db";

	@GetMapping("/Users/{userId}")
	public User getUser(@PathVariable("userId") int userId)
	{
		DatabaseConnectionManager dcm = new DatabaseConnectionManager("db", "cooperate", "postgres", "password");
		User user = new User();
		try {
			Connection connection = dcm.getConnection();
			UserDao userDao = new UserDao(connection);
			user = userDao.findById(userId);
			System.out.println(user);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		return user;
	}
	@GetMapping("/{source}/{id}/Reviews/{orderedBy}/{order}/{pageNum}")
	public ArrayList<Review> getReviews(@PathVariable("source") String source,
										@PathVariable("id") int id,
										@PathVariable("orderedBy") String orderBy,
										@PathVariable("order") String order,
										@PathVariable("pageNum") int pageNum ) {

		DatabaseConnectionManager dcm = new DatabaseConnectionManager("db", "cooperate", "postgres", "password");
		ArrayList<Review> reviews = new ArrayList<Review>();
											
		try {
			Connection connection = dcm.getConnection();
			ReviewPage page = new ReviewPage(id, source, orderBy, order,
					2, pageNum*2);
			ReviewDao reviewDao = new ReviewDao(connection);
			reviews = reviewDao.getReviews(page);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		return reviews;
	}

	@GetMapping("/Courses/{courseId}")
	public Course getByCourseId(@PathVariable("courseId") int courseId) {

		DatabaseConnectionManager dcm = new DatabaseConnectionManager("db", "cooperate", "postgres", "password");
		Course course = new Course();
		try {
			Connection connection = dcm.getConnection();
			CourseDao courseDao = new CourseDao(connection);
			course = courseDao.findById(courseId);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		return course;
	}

	@GetMapping("/Professors/{profId}")
	public Professor getByProfessorId(@PathVariable("profId") int profId)
	{
		DatabaseConnectionManager dcm = new DatabaseConnectionManager("db", "cooperate", "postgres", "password");
		Professor prof = new Professor();
		try {
			Connection connection = dcm.getConnection();
			ProfessorDao professorDao = new ProfessorDao(connection);
			prof = professorDao.findById(profId);
			System.out.println(prof);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		return prof;
	}


	@PostMapping("/createUser")
	public boolean createNewUser(@RequestBody String json) throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);
		DatabaseConnectionManager dcm = new DatabaseConnectionManager("db", "cooperate", "postgres", "password");
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

	@PostMapping("/likeReview")
	public int likeReview(@RequestBody String json) throws JsonProcessingException {

		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);

		DatabaseConnectionManager dcm = new DatabaseConnectionManager("db", "cooperate", "postgres", "password");
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

	@PostMapping("/makeReview")
	public int makeReview(@RequestBody String json) throws JsonProcessingException {

		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);

		DatabaseConnectionManager dcm = new DatabaseConnectionManager("db", "cooperate", "postgres", "password");

		int maxDescriptionLength =  1000;
		if (inputMap.get("review").length() > maxDescriptionLength){return -6;}

		try {
			Connection connection = dcm.getConnection();
			UserDao userDao = new UserDao(connection);
			ReviewDao reviewDao = new ReviewDao(connection);
			User user = userDao.findById(Integer.parseInt(inputMap.get("reviewer_id")));

      
			int review_id = user.makeReview(Integer.parseInt(inputMap.get("course_id")),
					Integer.parseInt(inputMap.get("prof_id")),
					inputMap.get("review"),
					Integer.parseInt(inputMap.get("course_rating")),
					Integer.parseInt(inputMap.get("prof_rating")),
					inputMap.get("hyperlink"), connection);
			
			return review_id;

		}
		catch (SQLException var8) {
			var8.printStackTrace();
			return -4;
		}
	}

	@DeleteMapping("/DeleteReview/{reviewId}/{userId}")
    public int deleteReview(@PathVariable("reviewId") int reviewId, @PathVariable("userId") int userId) {

		DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "cooperate", "postgres", "password");
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
