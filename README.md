# COOPERate

Welcome to our repository for our project for ECE-366 Software Engineering! For our project, we are creating COOPERate: a website that allows Cooper Union students to anonymously post reviews on courses and professors that they had as well as upload helpful documents such as syllabi and past exams. While other websites such as ratemyprofessor.com perform a similar function, because of how small Cooper is, many of our professors have little to no reviews on them. As a result, many Cooper students end up taking classes with not much of an idea of what they will be like. By creating a website specifically catered to Cooper Union students, we hope to create a platform that allows Cooper Union students to help their peers be more informed about the courses that they plan on taking.


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


## Local Working Project Demo 4/15/24

To run this demo, please follow the instructions given below:

- Install the latest version of docker desktop: https://docs.docker.com/desktop/install/windows-install/
- From your terminal, cd into the cooperate directory where the dockerfile is located.
- Open up docker desktop and enter in the following command into the terminal: docker compose build
- Once the docker images have been built, enter in the following command: docker compose up
- In a separate terminal, cd into the cooperate/backend/Demo directory
- Run the populate.py file. This will create the tables for our database and populate our database (when it prompts you for the password, please enter in password)
- Finally, once everything is running, you can open up a browser and go to localhost:3000 to start looking through our website

<img width="1195" alt="image" src="https://github.com/fkhan000/COOPERate/assets/78983433/1a6cbfb9-d934-48af-87bc-23b8db510edd">

