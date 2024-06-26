package com.example.cooperate;


import java.sql.Timestamp;

public class Review implements DataTransferObject{

    private int id;
    private int user_id;
    private int course_id;
    private int prof_id;

    private String username;
    private String course_name;
    private String prof_name;
    private String review;
    private float course_rating;
    private float prof_rating;
    private int net_likes;
    private float old_karma;
    private String syllabusLink;
    private String examLink;
    private Timestamp timestamp;


    public Review() { super();}
    public Review(int user_id, int course_id, int prof_id, String username, String course_name, String prof_name,
                  float course_rating, float prof_rating, float old_karma, String review, String syllabusLink, String examLink)
    {
        this.user_id = user_id;
        this.course_id = course_id;
        this.prof_id = prof_id;
        this.username = username;
        this.course_name = course_name;
        this.prof_name = prof_name;
        this.course_rating = course_rating;
        this.prof_rating = prof_rating;
        this.old_karma = old_karma;
        this.review = review;
        this.syllabusLink = syllabusLink;
        this.examLink = examLink;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return user_id;
    }

    public void setUserId(int user_id)
    {
        this.user_id = user_id;
    }
    public int getCourseId() {
        return course_id;
    }

    public void setCourseId(int course_id) {
        this.course_id = course_id;
    }
    public int getProfId() {
        return prof_id;
    }

    public void setProfId(int prof_id) {
        this.prof_id = prof_id;
    }

    public String getUsername(){return username;}
    public void setUsername(String username){this.username = username;}

    public String getCourse_name(){return course_name;}
    public void setCourse_name(String course_name){this.course_name = course_name;}

    public String getProf_name() {return prof_name;}
    public void setProf_name(String prof_name){this.prof_name = prof_name;}

    public String getReview(){
        return review;
    }

    public void setReview(String review)
    {
        this.review = review;
    }

    public float getCourseRating(){
        return course_rating;
    }

    public void setCourseRating(float course_rating){
        this.course_rating = course_rating;
    }

    public float getProfRating(){
        return prof_rating;
    }
    public void setProfRating(float profRating){
        this.prof_rating = profRating;
    }

    public int getNetLikes(){
        return net_likes;
    }
    public void setNetLikes(int net_likes){
        this.net_likes = net_likes;
    }

    public String getSyllabusLink(){
        return syllabusLink;
    }
    public void setSyllabusLink(String hyperlink){this.syllabusLink = hyperlink;}

    public String getExamLink(){
        return examLink;
    }
    public void setExamLink(String hyperlink){this.examLink = hyperlink;}

    public Timestamp getTimestamp(){
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp){
        this.timestamp = timestamp;
    }

    public void updateNetLikes(int react)
    {
        this.net_likes += react;
    }

    public void setOldKarma(float oldKarma){
        this.old_karma = oldKarma;
    }

    public float getOldKarma()
    {
        return old_karma;
    }
    @Override
    public String toString() {
        return "Review{" +
                "ReviewID='" + id + '\'' +
                ",userID='" + user_id + '\'' +
                ",courseID= '" + course_id + '\'' +
                ",profID= '" + prof_id + '\'' +
                ",username= '" + username + '\'' +
                ",course_name= '" + course_name + '\'' +
                ",prof_name ='" + prof_name + '\'' +
                ",profRating= '" + prof_rating + '\'' +
                ",courseRating= '" + course_rating + '\'' +
                "net_likes= '" + net_likes + '\'' +
                "orig_karma= '" + old_karma + '\'' + 
                "\n\ndescription '" + review + '\'' +
                '}';
    }
}