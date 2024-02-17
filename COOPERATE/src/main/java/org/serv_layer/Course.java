package org.serv_layer;
import java.sql.Connection;

public class Course implements DataTransferObject{

    private int id;
    private String name;
    private String description;

    private float rating;

    private float totalRating;

    public int getId() {
        return id;
    }

    public void setId(int id)
    {
        this.id = id;
    }

    public String getName(){
        return name;
    }

    public void setName(String name) {this.name = name;}

    public String getDescription(){
        return description;
    }
    public void setDescription(String description){
        this.description = description;
    }

    public float getRating()
    {
        return rating;
    }
    public void setRating(float rating){
        this.rating = rating;
    }

    public float getTotalRating() {return totalRating;}

    public void setTotalRating(float totalRating) {this.totalRating =  totalRating;}

    public void updateRating(int course_rating, float karma)
    {
        this.rating = (rating*totalRating + course_rating*karma)/(rating*totalRating + karma);
        totalRating += karma;
    }
    @Override
    public String toString() {
        return "Course{" +
                "name='" + name + '\'' +
                ", courseID='" + id + '\'' +
                ",rating='" + rating + '\'' +
                "\n,description= '" + description +
                '}';
    }
}