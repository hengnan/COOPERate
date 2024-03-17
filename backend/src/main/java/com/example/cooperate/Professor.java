package com.example.cooperate;


public class Professor implements DataTransferObject{

    private int id;
    private String name;
    private String description;

    private float rating;

    private float totalRating;

    public int getId(){
        return id;
    }

    public void setID(int id)
    {
        this.id = id;
    }
    public String getName() {
        return name;
    }

    public void setName(String name){
        this.name = name;
    }


    public String getDescription(){
        return description;
    }
    public void setDescription(String description){
        this.description = description;
    }

    public float getRating() {return rating;}
    public void setRating(float rating){
        this.rating = rating;
    }

    public void setTotalRating(float totalRating){this.totalRating = totalRating;}

    public float getTotalRating(){return totalRating;}
    public void updateRating(float prof_rating, float karma)
    {
        this.rating = (rating*totalRating + prof_rating*karma)/(totalRating + karma);
        totalRating += karma;
    }
    @Override
    public String toString() {
        return "Professor{" +
                ", profID='" + id + '\'' +
                ",name='" + name + '\'' +
                ",rating='" + rating + '\'' +
                "\n,description= '" + description +
                '}';
    }
}