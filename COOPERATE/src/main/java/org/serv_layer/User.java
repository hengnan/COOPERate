package org.serv_layer;

import java.sql.Connection;
import java.sql.Timestamp;

public class User implements DataTransferObject{

        private int id;
        private String userName;
        private String password;

        private String email;
        private float karma;

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
            this.karma += Math.min(10, (float) (Math.exp(likerKarma)))*react;
        }
        public int like(int review_id, int react, Connection connection)
        {
            ReviewDao reviewDao = new ReviewDao(connection);
            Review review = reviewDao.findById(review_id);

            LikesDao likedao = new LikesDao(connection);
            boolean liked = likedao.exists(this.id, review.getId());

            if (liked){ return -1;}

            Likes likes = new Likes();
            likes.set_userId(this.id);
            likes.set_reviewId(review.getId());
            likedao.create(likes);

            int updated_net_likes = review.getNetLikes() + react;
            review.setNetLikes(updated_net_likes);

            reviewDao.update(review);
            UserDao userDao = new UserDao(connection);
            User liked_user = userDao.findById(review.getUserId());

            liked_user.updateKarma(react, this.karma);
            userDao.update(liked_user);
            return 0;
        }

        public int makeReview(int course_id, int prof_id, String review_des,
                               int course_rating, int prof_rating, String hyperlink, Connection connection)
        {
            ReviewDao reviewDao = new ReviewDao(connection);
            boolean reviewed = reviewDao.exists(this.id, course_id, prof_id);

            if (reviewed) {return -1;}

            Review review = new Review(this.id, course_id, prof_id,
                    course_rating, prof_rating, review_des, hyperlink);

            reviewDao.create(review);

            System.out.println(review);



            CourseDao courseDao = new CourseDao(connection);

            Course course = courseDao.findById(course_id);

            course.updateRating(course_rating, this.karma);

            System.out.println(course);

            courseDao.update(course);

            ProfessorDao profDao = new ProfessorDao(connection);

            Professor prof = profDao.findById(prof_id);

            prof.updateRating(prof_rating, this.karma);

            profDao.update(prof);

            System.out.println(prof);
            return 0;
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