package com.example.cooperate;

public class ReviewPage {
    private String name;
    private String source;
    private String order_by;
    private String order;
    private int numPerPage;
    private int offset;

    public ReviewPage(String name, String source, String order_by,
                      String order, int numPerPage, int offset)
    {
        this.name = name;
        this.source = source;
        this.order = order;
        this.order_by = order_by;
        this.numPerPage = numPerPage;
        this.offset = offset;
    }

    public void setId(String name) {this.name = name;}

    public String getId() {return this.name;}
    public void setSource(String source){this.source = source;}
    public String getSource(){return this.source;}

    public void setOrder(String order){this.order = order;}
    public String getOrder(){return this.order;}
    public void setOrderBy(String order_by){this.order_by = order_by;}
    public String getOrderBy(){return this.order_by;}
    public void setnumPage(int numPerPage){this.numPerPage = numPerPage;}
    public int getNumPerPage(){return this.numPerPage;}
    public void setOffset(int offset){this.offset = offset;}
    public int getOffset(){return this.offset;}
}
