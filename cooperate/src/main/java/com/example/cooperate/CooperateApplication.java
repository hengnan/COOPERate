package com.example.cooperate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;

@SpringBootApplication
@RestController
public class CooperateApplication {

	@GetMapping("/Users/{userId}")
	public User getUser(@PathVariable("userId") int userId)
	{
		System.out.println(userId);
		DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");
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
		DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");
		ArrayList<Review> reviews = new ArrayList<Review>();

		try {
			Connection connection = dcm.getConnection();
			ReviewPage page = new ReviewPage(id, source, orderBy, order,
					15, pageNum*15);
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
		DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");
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
		DatabaseConnectionManager dcm = new DatabaseConnectionManager("localhost", "cooperate", "postgres", "password");
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

	public static void main(String[] args) {
		SpringApplication.run(CooperateApplication.class, args);
	}

}
