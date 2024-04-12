import React from 'react';
import './AboutUs.css';

const AboutUsPage = () => {


    return (
    <div>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <div class = "compinfo">
            <div class = "comppic-txt">
                <div class="compinfotxt">
                    <h1 id = "droptitle"><strong>COOPERATE</strong></h1>
                    <p class ="no">NO! This is not a website about the best places to eat around Cooper Union. </p>
                    <p class="info">Don't get us wrong, that is a great idea and sounds like what our title represents, but somehow it isn't. COOPERate is actually a <mark>double entendre that means cooperate and COOPER-rate</mark> (just combine those r's). Both meanings capture what this website is really about. We designed all of this with the hope that Cooper Union students of the present and the future can upload and view reviews about the professors they love or hate (hopefully all love)! With a simple cooper.edu email, any student can be a part of the experience and find helpful information that is usually difficult to find anywhere else. As a small school and community, we hope that this website serves as an aid to all students who use it. Thank you and enjoy.</p>
                </div>
            </div>
        </div>
    
        <div id = "meetT">
            <h2 class="meetTeam">Meet The Team!</h2>
        </div>

        <div class="container">
            <div class="our-team" id = "nick">
                <div class="pic" id = "nickpic">
                    <img src="https://i.ibb.co/n0GZSNq/nick.jpg"></img>
                </div>
                <div class = "nicktxt">
                    <h3 class="title">Nicholas Singh</h3>
                    <span class="post">EE' 2024</span>
                    <ul class="social">
                        <li><a href="https://www.instagram.com/nicholasingh72/" class="fa fa-instagram" target="_blank"></a></li>
                        <li><a href="https://www.linkedin.com/in/nicholas-singh-99a1a618b/" class="fa fa-linkedin" target="_blank"></a></li>
                        <li><a href="https://github.com/nicholasingh" class="fa fa-github" target="_blank"></a></li>
                    </ul>
                </div>
            </div>
            <div class="our-team" id ="al">
                <div class="pic" id = "alpic">
                    <img src="https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png"></img>
                </div>
                <div id = "altxt">
                    <h3 class="title">Fakharyar Khan</h3>
                    <span class="post">EE' 2024</span>
                    <ul class="social">
                        <li><a href="" class="fa fa-instagram" target="_blank"></a></li>
                        <li><a href="https://www.linkedin.com/in/fakharyar-khan-124582229/" class="fa fa-linkedin" target="_blank"></a></li>
                        <li><a href="https://github.com/fkhan000" class="fa fa-github" target="_blank"></a></li>
                    </ul>
                </div>
            </div>
            <div class="our-team" id = "sev">
                <div class="pic" id="sevpic">
                    <img src="https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png"></img>
                </div>
                <div class = "sevtxt">
                    <h3 class="title">Hengnan Ma</h3>
                    <span class="post">BSE' 2024</span>
                    <ul class="social">
                        <li><a href="" class="fa fa-instagram" target="_blank"></a></li>
                        <li><a href="" class="fa fa-linkedin" target="_blank"></a></li>
                        <li><a href="" class="fa fa-github" target="_blank"></a></li>
                    </ul>
                </div>
            </div>
            <div class="our-team" id = "brian">
                <div class="pic" id = "brianpic">
                    <img src="https://media.licdn.com/dms/image/D4E03AQHD9xGqCwmH4w/profile-displayphoto-shrink_800_800/0/1706070375143?e=1718236800&v=beta&t=F8VSQaEWk-T10L2rVrenxWRl5kL_vY5jLEfmZm_DhcU"></img>
                </div>
                <div class = "briantxt">
                    <h3 class="title">Irene Choi</h3>
                    <span class="post">ME' 2024</span>
                    <ul class="social">
                        <li><a href="" class="fa fa-instagram" target="_blank"></a></li>
                        <li><a href="https://www.linkedin.com/in/irenewonchoi010528" class="fa fa-linkedin" target="_blank"></a></li>
                        <li><a href="https://github.com/irene1choi" class="fa fa-github" target="_blank"></a></li>
                    </ul>
                </div>
            </div>
            <div>
                <p class="filler">COOPERate</p>
            </div>
        </div>
    </div>
  );
}

export default AboutUsPage;