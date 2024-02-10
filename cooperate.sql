

--This table contains login info for user as well as their karma

CREATE TABLE Users (
  id varchar PRIMARY KEY NOT NULL, --username
  email_address varchar NOT NULL, --must be a cooper email address
  hashed_password integer NOT NULL, --salted hashed password used
  karma int NOT NULL DEFAULT 0, --net number of likes that a user gets
  created_at timestamp NOT NULL
);


--This table contains the reviews posted by our users
CREATE SEQUENCE review_id start with 10000;
CREATE TABLE Reviews (
  review_id int NOT NULL DEFAULT nextval("review_id"),
  course_id varchar NOT NULL, --primary key for course being reviewed
  prof_id varchar NOT NULL, --primary key for professor being reviewed
  user_id varchar NOT NULL, -- primary key of user posting review
  review text NOT NULL, --the review of the course
  course_rating float NOT NULL, --course rating 0 to 1 in increments of .2
  prof_rating float NOT NULL, --prof rating 0 to 1 in increments of .2
  net_likes integer NOT NULL DEFAULT 0, --net number of likes given by users
  hyperlink varchar, --hyperlink to the google drive folder in which any attached documents for review are stored
  created_at timestamp NOT NULL,

  PRIMARY KEY(review_id),
  FOREIGN KEY (course_id) REFERENCES Course,
  FOREIGN KEY (prof_id) REFERENCES Professor,
  FOREIGN KEY (user_id) REFERENCES Users
);

--This table stores the likes and dislikes made by a user for a review
CREATE TABLE Likes (
  user_id varchar NOT NULL,
  review_id integer NOT NULL,
  react integer NOT NULL, --either -1 or 1 for dislike or like
  PRIMARY KEY (user_id, review_id),
  FOREIGN KEY (user_id) REFERENCES Users,
  FOREIGN KEY (review_id) REFERENCES Reviews
);

--This table stores course information and the aggregate rating
CREATE TABLE Course (
  id varchar PRIMARY KEY NOT NULL,
  descrip text NOT NULL, --description of course
  rating float, --weighted average rating of course
);

--This table stores prof information and aggregate rating
CREATE TABLE Professor (
  id varchar PRIMARY KEY,
  descrip text, --about me for professor
  rating float, --weighted average rating for professor
  created_at timestamp NOT NULL
);