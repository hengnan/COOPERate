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
		System.out.println(userId);
		DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "cooperate", "postgres", "password");
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
		System.out.println(id);
		DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "cooperate", "postgres", "password");
		ArrayList<Review> reviews = new ArrayList<Review>();

		try {
			Connection connection = dcm.getConnection();
			ReviewPage page = new ReviewPage(id, source, orderBy, order,
					2, pageNum*2);
			ReviewDao reviewDao = new ReviewDao(connection);
			reviews = reviewDao.getReviews(page);
			System.out.println(reviews);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		return reviews;
	}

	@GetMapping("/Courses/{courseId}")
	public Course getByCourseId(@PathVariable("courseId") int courseId) {
		System.out.println(courseId);
		DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "cooperate", "postgres", "password");
		Course course = new Course();
		try {
			Connection connection = dcm.getConnection();
			CourseDao courseDao = new CourseDao(connection);
			course = courseDao.findById(courseId);
			System.out.println(course);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		return course;
	}

	@GetMapping("/Professors/{profId}")
	public Professor getByProfessorId(@PathVariable("profId") int profId)
	{
		System.out.println(profId);
		DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "cooperate", "postgres", "password");
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
	public User createNewUser(@RequestBody String json) throws JsonProcessingException {
		System.out.println(json);
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);
		DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "cooperate", "postgres", "password");
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
		}
		return user;
	}

	@PostMapping("/likeReview")
	public Review likeReview(@RequestBody String json) throws JsonProcessingException {
		System.out.println(json);
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);
		DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "cooperate", "postgres", "password");
		Review review = new Review();
		try {
			User user = new User();

			Connection connection = dcm.getConnection();
			ReviewDao reviewDao = new ReviewDao(connection);
			user.setId(Integer.parseInt(inputMap.get("liker_id")));
			user.setKarma(Float.parseFloat(inputMap.get("liker_karma")));

			int react = Integer.parseInt(inputMap.get("reaction"));

			int review_id = Integer.parseInt(inputMap.get("review_id"));

			int success = user.like(review_id, react, connection);

			if (success == 0) {System.out.println("User # " + user.getId() + " successfully liked "+
					"Review # " + review_id + "!");}
			else {System.out.println("User # " + user.getId() + " already liked "+
					"Review # " + review_id + "!");}

			review = reviewDao.findById(review_id);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}
		return review;
	}

	@PostMapping("/makeReview")
	public Review makeReview(@RequestBody String json) throws JsonProcessingException {
		System.out.println(json);
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> inputMap = objectMapper.readValue(json, Map.class);
		DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "cooperate", "postgres", "password");
		Review review = new Review();

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

			if(review_id == -1) {{System.out.println("User # " + inputMap.get("reviewer_id") + " already made review "+
					"for course " + inputMap.get("course_id") + " and professor "
					+ inputMap.get("prof_id") + "!");}}

			else { {System.out.println("User # " + user.getId() + " successfully made review "+
					"for course " + inputMap.get("course_id") + " and professor "
					+ inputMap.get("prof_id") + "!");}}

			review  = reviewDao.findById(review_id);
		}
		catch (SQLException var8) {
			var8.printStackTrace();
		}

		return review;
	}

	@DeleteMapping("/Review/{reviewId}")
    public String deleteReview(@PathVariable("reviewId") int reviewId) {
        System.out.println("Deleting user with ID: " + reviewId);
        DatabaseConnectionManager dcm = new DatabaseConnectionManager(hostname, "cooperate", "postgres", "password");
        try {
            Connection connection = dcm.getConnection();
            ReviewDao reviewDao = new ReviewDao(connection);
            boolean isDeleted = reviewDao.deleteById(reviewId);
            if (isDeleted) {
                return "User with ID " + reviewId + " was successfully deleted.";
            } else {
                return "User with ID " + reviewId + " could not be found or deleted.";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "An error occurred while trying to delete user with ID " + reviewId + ".";
        }
    }

	public static void main(String[] args) {
		SpringApplication.run(CooperateApplication.class, args);
	}

}
