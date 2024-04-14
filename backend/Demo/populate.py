import requests
import random
import os


initializer_script = os.path.abspath(os.path.join("..", "..", "Database", "cooperate.sql"))
populate_script = os.path.abspath(os.path.join("..", "..", "Database", "populate.sql"))
os.system("psql -h localhost -U postgres -a -f " + initializer_script)
os.system("psql -h localhost -U postgres -a -f " + populate_script)

url = "http://localhost:8080/makeReview"

reviewBank = [("loved it!",4, 4), ("hated it!", 1, 2), ("awesome class", 4, 5), ("decent class", 3, 4),
              ("best class ever", 5,5), ("worst class", 1, 1)]

courProf = [(10000, 10000), (10001, 10001), (10001, 10002), (10002, 10003), (10003, 10004)]

courses = ["Software Engineering", "Communication Networks", "Probability Models & Stochastic Processes", "Integrated Circuit Engineering", "Digital Signals Processing"]

profs = ["Christopher Hong", "Sam Keene", "Jabeom Koo", "Fred Fontaine"]

users = ["sam123", "rowdley212", "jack13", "bob14", "cooper11", "dooper11"]

userBank = list(range(10000, 10006))

for user in userBank:
    for pair in courProf:
        review = random.choice(reviewBank)
        course_rating = review[1]
        prof_rating = review[2]
        review = review[0]
        
        prof_id = pair[0]
        course_id = pair[1]

        coursename = courses[pair[1]-10000]
        profname = profs[pair[0]-10000]

        json = {"reviewer_id": str(user),
            "course_id": str(course_id),
            "prof_id": str(prof_id),
            "prof_rating": str(prof_rating),
            "course_name": coursename,
            "prof_name": profname,
            "course_rating": str(course_rating),
            "review": review,
            "hyperlink": ""
            }
        print(requests.post(url, json = json))
        
