window.addEventListener('load', function () {
    var vue = new Vue({
        el: '#app',
        data: {
            login: {
                email: null,
                password: null,
                rememberMe: null
            },
            register:{
                email: null,
                name: {
                    firstName: null,
                    lastName: null
                },
                password: null,
                rePassword: null,
                tab: 0,
                maxTab: 2,
                food: [
                        {name: 'Chinese', like: 50},
                        {name: 'Korean', like: 50},
                        {name: 'Japan', like: 50},
                        {name: 'Vietnamese', like: 50},
                        {name: 'Thai', like: 50},
                        {name: 'Indian', like: 50},
                        {name: 'French', like: 50},
                        {name: 'Italian', like: 50}
                ],
                activity: [
                    {name: 'Outdoor', like: 50},
                    {name: 'Indoor', like: 50},
                    {name: 'Sport', like: 50},
                    {name: 'Chess', like: 50},
                    {name: 'Beach', like: 50},

                ]
            },
            status: {
                login: false
            },
            friends: [
                {nickname: "Sosad", firstName: "Kwok Hang", lastName: "Lau", lastMeetingTime: null, picked: false},
                {nickname: "Ben Yuen", firstName: "Yat Hang", lastName: "Yuen", lastMeetingTime: null, picked: false},
                {nickname: "Us", firstName: "U", lastName: "s", lastMeetingTime: null, picked: true}
            ],
            groups: [
                {groupname: "6E", createDate: null, lastMeetingTime: null, picked: false, grouplist: [    
                        {nickname: "Sosad", firstName: "Kwok Hang", lastName: "Lau", lastMeetingTime: null},
                        {nickname: "Ben Yuen", firstName: "Yat Hang", lastName: "Yuen", lastMeetingTime: null} 
                    ]
                }
            ],
            priorities: [
                {nickname: "Us", firstName: "U", lastName: "s", lastMeetingTime: null, picked: true}
            ]
        },
        methods: {
            regNext() {
                if(this.register.tab < this.register.maxTab) this.register.tab++;
            },
            regPrev() {
                if(this.register.tab > 0) this.register.tab--;
            }
        }
    });
});

Vue.component('navbar', {
    props:{
        status:{
            login: false
        }
    },
    template: `
    <nav class="navbar navbar-expand-lg fixed-top navbar-light navbar-collapse" style="background-color: #e3f2fd;">
        <a class="navbar-brand" href="index.html">
            <img src="" width="30" height="30" class="d-inline-block align-top" alt="">
            Social Planner
        </a>
        <button type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler collapsed"><span class="navbar-toggler-icon"></span></button>
        <div class="navbar-collapse offcanvas-collapse collapse" id="navbarsExampleDefault">
            <ul class="navbar-nav mr-auto">
                <!-- <li class="nav-item active">
                    <a class="nav-link" href="">Your Calender</a>
                </li> -->
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="" id="dropdown01" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">Your Calender</a>
                    <div class="dropdown-menu" aria-labelledby="dropdown01">
                        <a class="dropdown-item" href="calendar.html">View Your Calendar</a>
                        <a class="dropdown-item" href="">Edit Your Calendar</a>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="" id="dropdown01" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">Your Event</a>
                    <div class="dropdown-menu" aria-labelledby="dropdown01">
                        <a class="dropdown-item" href="">Event Organised</a>
                        <a class="dropdown-item" href="">Event Invitation</a>
                        <a class="dropdown-item" href="">Event Suggested</a>
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link dropdown-toggle" href="profile.html">Your Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="friends.html">Your Friends</a>
                    </div>
                </li>
            </ul>
            <div class="form-inline my-2 my-lg-0">
                <button v-if="!status.login" class="btn btn-outline-success my-2 my-sm-0" type="submit" onclick="location.href='login.html'">Login</button>
                <button v-else class="btn btn-outline-danger my-2 my-sm-0" type="submit">Logout</button>
            </div>
        </div>
    </nav>`
});

