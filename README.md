# COOPERate

Welcome to our repository for our project for ECE-366 Software Engineering! For our project, we are creating COOPERate: a website that allows Cooper Union students to anonymously post reviews on courses and professors that they had as well as upload helpful documents such as syllabi and past exams. While other websites such as ratemyprofessor.com perform a similar function, because of how small Cooper is, many of our professors don't have little to no reviews on them. As a result, many Cooper students end up taking classes with very little idea of what they will be like. By creating a website specifically catered to Cooper Union students, we hope to create a platform that allows Cooper Union students to help their peers be more informed about the courses that they plan on taking.


## Backend Demo 3/4/24

To run our demo for the backend, please follow the instructions given below:

- Install the latest version of docker desktop: https://docs.docker.com/desktop/install/windows-install/
- From your terminal, cd into the cooperate directory where the dockerfile is located.
- Open up docker desktop and enter in the following command into the terminal: docker compose build
- Once the docker images have been built, enter in the following command: docker compose up
- In a separate terminal, cd into the cooperate/Demo directory
- Run the populate.py file. This will create the tables for our database and populate our database
- Finally, to run our text based demo, run the text_ui.py file and you're good to go!

<img width="773" alt="UI_frontpage" src="https://github.com/fkhan000/COOPERate/assets/78983433/3d259d6c-558d-498d-8e00-cd83f0866099">
