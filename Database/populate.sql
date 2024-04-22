\c cooperate;
INSERT INTO USERS (username, email_address, hashed_password)
VALUES ('sam123', 'sam12@cooper.edu', 'password456');
INSERT INTO USERS (username, email_address, hashed_password)
VALUES ('rowdley212', 'rowdley@cooper.edu', 'password123');
INSERT INTO USERS (username, email_address, hashed_password)
VALUES ('jack13', 'jack@cooper.edu', 'password12');
INSERT INTO USERS (username, email_address, hashed_password)
VALUES ('bob14', 'bob@cooper.edu', 'password12');
INSERT INTO USERS (username, email_address, hashed_password)
VALUES ('cooper11', 'cooper@cooper.edu', 'password12');
INSERT INTO USERS (username, email_address, hashed_password)
VALUES ('dooper11', 'dooper@cooper.edu', 'password12');
INSERT INTO PROFESSOR (prof_name, descrip)
VALUES ('Christopher Hong', 'EE Professor teaches Sofware Engineering');
INSERT INTO PROFESSOR (prof_name, descrip)
VALUES ('Sam Keene', 'EE Professor teaches Communication Networks and Probability & Stochastic Models');
INSERT INTO PROFESSOR (prof_name, descrip)
VALUES ('Fred Fontaine', 'EE Professor teaches Digital Signals Processing');
INSERT INTO PROFESSOR (prof_name, descrip)
VALUES ('Jabeom Koo', 'EE Professor teaches Integrated Circuit Engineering');
INSERT INTO COURSE (course_name, descrip)
VALUES ('Software Engineering', 'A course where students engineer software');
INSERT INTO COURSE (course_name, descrip)
VALUES ('Communication Networks', 'A course where students learn about how networks communicate with one another');
INSERT INTO COURSE (course_name, descrip)
VALUES ('Probability Models & Stochastic Processes', 'A course where students learn how to model stochastics');
INSERT INTO COURSE (course_name, descrip)
VALUES ('Integrated Circuit Engineering', 'A course where students engineer circuits of the integrated nature');
INSERT INTO COURSE (course_name, descrip)
VALUES ('Digital Signals Processing', 'A course where students learn to process signals digitally');


/*

INSERT INTO Reviews (course_id, prof_id, user_id, course_name, prof_name, username, orig_karma, review, course_rating, prof_rating)
SELECT
    cp.course_id,
    cp.prof_id,
    u.id AS user_id,
    CASE cp.course_id
        WHEN 10000 THEN 'Software Engineering'
        WHEN 10001 THEN 'Communication Networks'
        WHEN 10002 THEN 'Probability Models & Stochastic Processes'
        WHEN 10003 THEN 'Integrated Circuit Engineering'
        WHEN 10004 THEN 'Digital Signals Processing'
    END AS course_name,
    CASE cp.prof_id
        WHEN 10000 THEN 'Christopher Hong'
        WHEN 10001 THEN 'Sam Keene'
        WHEN 10002 THEN 'Jabeom Koo'
        WHEN 10003 THEN 'Fred Fontaine'
        ELSE 'Unknown' -- Provide a default value in case prof_id does not match any known professor
    END AS prof_name,
    plp.username AS username, -- Replace with actual usernames if available
    20.0 AS orig_karma, -- Assuming all users have a default karma of 20
    rt.review AS review_text,
    RANDOM() * 5 AS course_rating, -- Random rating between 0 and 5
    RANDOM() * 5 AS prof_rating -- Random rating between 0 and 5
FROM
    (VALUES
        ('sam123'),
        ('rowdley212'),
        ('jack13'),
        ('bob14'),
        ('cooper11'),
        ('dooper11')
    ) AS plp(username),
    (VALUES
        ('loved it!'),
        ('hated it!'),
        ('awesome class'),
        ('fuck motherfucker'),
        ('best class ever'),
        ('sex alot of random censored words')
    ) AS rt(review),
    (VALUES
        (10000, 10000),
        (10001, 10001),
        (10001, 10002),
        (10002, 10003),
        (10003, 10004)
    ) AS cp(prof_id, course_id),
    (SELECT generate_series(10000, 10005) AS id) AS u
WHERE NOT EXISTS (
    SELECT 1
    FROM Reviews r
    WHERE r.course_id = cp.course_id
      AND r.user_id = u.id
);

*/