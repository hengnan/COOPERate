DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

DROP DATABASE cooperate;
CREATE DATABASE cooperate;

\c cooperate;
--This table contains login info for user as well as their karma

CREATE SEQUENCE user_counter start with 10000;

CREATE TABLE Users (
  id int NOT NULL DEFAULT nextval('user_counter'),
  username varchar  NOT NULL, --username
  email_address varchar NOT NULL, --must be a cooper email address
  hashed_password varchar NOT NULL, --salted hashed password used
  karma float NOT NULL DEFAULT 20, --net number of likes that a user gets
  created_at timestamp NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id)
);

CREATE SEQUENCE course_counter start with 10000;
--This table stores course information and the aggregate rating
CREATE TABLE Course (
  id int NOT NULL DEFAULT nextval('course_counter'),
  course_name varchar NOT NULL,
  descrip text NOT NULL, --description of course
  rating float DEFAULT 0, --weighted average rating of course
  total_rating float DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE SEQUENCE prof_counter start with 10000;
--This table stores prof information and aggregate rating
CREATE TABLE Professor (
  id int NOT NULL DEFAULT nextval('prof_counter'),
  prof_name varchar,
  descrip text, --about me for professor
  rating float DEFAULT 0, --weighted average rating for professor
  total_rating float DEFAULT 0,
  PRIMARY KEY (id)
);

--This table contains the reviews posted by our users
CREATE SEQUENCE review_counter start with 10000;
CREATE TABLE Reviews (
  review_id int NOT NULL DEFAULT nextval('review_counter'),
  course_id int NOT NULL, --primary key for course being reviewed
  prof_id int NOT NULL, --primary key for professor being reviewed
  user_id int NOT NULL, -- primary key of user posting review
  orig_karma float NOT NULL, --karma of user when review was created
  review text NOT NULL, --the review of the course
  course_rating float NOT NULL, --course rating 0 to 1 in increments of .2
  prof_rating float NOT NULL, --prof rating 0 to 1 in increments of .2
  net_likes integer NOT NULL DEFAULT 0, --net number of likes given by users
  hyperlink varchar, --hyperlink to the google drive folder in which any attached documents for review are stored
  created_at timestamp NOT NULL DEFAULT NOW(),

  PRIMARY KEY(review_id),
  FOREIGN KEY (course_id) REFERENCES Course,
  FOREIGN KEY (prof_id) REFERENCES Professor,
  FOREIGN KEY (user_id) REFERENCES Users
);

CREATE SEQUENCE likes_counter start with 10000;
--This table stores the likes and dislikes made by a user for a review
CREATE TABLE Likes (
  id int NOT NULL DEFAULT nextval('likes_counter'),
  user_id int NOT NULL,
  review_id int NOT NULL,
  react int NOT NULL, --either -1 or 1 for dislike or like
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES Users,
  FOREIGN KEY (review_id) REFERENCES Reviews ON DELETE CASCADE
);
