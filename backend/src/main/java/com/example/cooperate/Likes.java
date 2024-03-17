package com.example.cooperate;


public class Likes implements DataTransferObject{

    private int id;
    private int user_id;
    private int review_id;
    private int react;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void set_userId(int id){
        this.user_id = id;
    }
    public int get_userId(){
        return user_id;
    }

    public int get_reviewId(){
        return review_id;
    }
    public void set_reviewId(int review_id){
        this.review_id = review_id;
    }

    public int getReact(){
        return react;
    }
    public void setReact(int react){this.react= react;}
    @Override
    public String toString() {
        return "User{" +
                ", likeID='" + id + '\'' +
                ",userID='" + user_id + '\'' +
                "\n,reviewID= '" + review_id +
                '}';
    }
}