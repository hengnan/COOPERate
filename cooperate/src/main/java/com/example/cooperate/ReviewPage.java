package com.example.cooperate;

public class ReviewPage {
    private int id;
    private String source;
    private String order_by;
    private int numPerPage;
    private int offset;

    public ReviewPage(int id, String source, String order_by, int numPerPage, int offset)
    {
        this.id = id;
        this.source = source;
        this.order_by = order_by;
        this.numPerPage = numPerPage;
        this.offset = offset;
    }

    public void setId(int id) {this.id = id;}

    public int getId() {return this.id;}

    public void setSource(String source){this.source = source;}

    public String getSource(){return this.source;}
    public void setOrder(String order_by){this.order_by = order_by;}
    public String getOrder(){return this.order_by;}
    public void setnumPage(int numPerPage){this.numPerPage = numPerPage;}
    public int getNumPerPage(){return this.numPerPage;}
    public void setOffset(int offset){this.offset = offset;}
    public int getOffset(){return this.offset;}
}
