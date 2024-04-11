package com.example.cooperate;

import java.sql.Connection;
import java.sql.Timestamp;

public class User implements DataTransferObject{

    private int id;
    private String userName;
    private String password;

    private String email;
    private float karma = 20;
    private Timestamp timestamp;

    public int getId() {return id;}

    public void setId(int id) {this.id = id;}

    public String getUserName() {return userName;}
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public float getKarma(){
        return karma;
    }

    public void setKarma(float karma){
        this.karma = karma;
    }

    public Timestamp getTimestamp(){
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp){
        this.timestamp = timestamp;
    }


    public void updateKarma(int react, float likerKarma)
    {
        //if user's karma score drops to a certain point we ban them
        //would need to make a ban table and store current timestamp of ban
        //then remove them from it after an hour
        //once you have been banned once, if your behavior doesn't improve,
        //you would likely get banned again and again
        //banned users are prohibited from making reviews or liking reviews
        this.karma += likerKarma*react*5.0/100.0;
        if (this.karma > 100) {this.karma = 100;}
        else if (this.karma < 0) {this.karma = 0;}
    }


    public void delete(Review review, Connection connection)
    {
        CourseDao courseDao = new CourseDao(connection);

        Course course = courseDao.findById(review.getCourseId());
        course.updateRating(review.getCourseRating(), -1*review.getOldKarma());

        courseDao.update(course);
        ProfessorDao profDao = new ProfessorDao(connection);

        Professor professor = profDao.findById(review.getProfId());
        professor.updateRating(review.getProfRating(), -1*review.getOldKarma());

        profDao.update(professor);

        ReviewDao reviewDao = new ReviewDao(connection);
        reviewDao.deleteById(review.getId());
    }
    public int like(int review_id, int react, Connection connection)
    {
        LikesDao likedao = new LikesDao(connection);
        boolean liked = likedao.exists(this.id, review_id);

        if (liked){ return -1;}

        Likes likes = new Likes();
        likes.set_userId(this.id);
        likes.set_reviewId(review_id);
        likes.setReact(react);
        likes.setKarma(karma);
        likedao.create(likes);

        ReviewDao reviewDao = new ReviewDao(connection);
        Review review = reviewDao.findById(review_id);

        review.updateNetLikes(react);

        reviewDao.update(review);

        System.out.println("\nliking\n");
        System.out.println(review);
        UserDao userDao = new UserDao(connection);
        User liked_user = userDao.findById(review.getUserId());

        liked_user.updateKarma(react, this.karma);
        userDao.update(liked_user);
        return 0;
    }

    public void deleteLike(int review_id, Connection connection)
    {
        LikesDao likedao = new LikesDao(connection);
        Likes like = likedao.findByUserReview(this.id, review_id);

        System.out.println(like);
        System.out.println(this.id);
        System.out.println(review_id);
        System.out.println(like.getId());
        likedao.remove(like.getId());

        ReviewDao reviewDao = new ReviewDao(connection);
        Review review = reviewDao.findById(review_id);
        UserDao userDao = new UserDao(connection);
        User liked_user = userDao.findById(review.getUserId());



        liked_user.updateKarma(like.getReact(), -1*like.getKarma());
        review.updateNetLikes(-1*like.getReact());

        System.out.println("\nunliking\n");
        System.out.println(review);
        reviewDao.update(review);

        userDao.update(liked_user);
    }


    public int makeReview(int course_id, int prof_id, String course_name, String prof_name, String review_des,
                          int course_rating, int prof_rating, String hyperlink, Connection connection)
    {
        ReviewDao reviewDao = new ReviewDao(connection);
        boolean reviewed = reviewDao.exists(this.id, course_id, prof_id);

        if (reviewed) {return -1;}

        Review review = new Review(this.id, course_id, prof_id, this.userName, course_name, prof_name,
                course_rating, prof_rating, this.karma, review_des, hyperlink);

        review = reviewDao.create(review);

        CourseDao courseDao = new CourseDao(connection);

        Course course = courseDao.findById(course_id);

        if (course.getId() == 0) {return -2;}

        course.updateRating(course_rating, this.karma);

        courseDao.update(course);

        ProfessorDao profDao = new ProfessorDao(connection);

        Professor prof = profDao.findById(prof_id);

        if (prof.getId() == 0) {return -3;}
        prof.updateRating(prof_rating, this.karma);

        profDao.update(prof);

        return review.getId();
    }

    @Override
    public String toString() {
        return "User{" +
                ", userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ",karma='" + karma + '\'' +
                ",created_at='" + timestamp +
                '}';
    }
}