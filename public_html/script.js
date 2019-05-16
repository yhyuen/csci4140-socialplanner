window.addEventListener('load', function () {
    temp_time1 = new Date(2019, 4, 22, 21, 30);
    temp_time2 = new Date();
    var vue = new Vue({
        el: '#app',
        data: {
            login: {
                email: null,
                password: null,
                rememberMe: false
            },
            register: {
                email: null,
                nickname: null,
                firstName: null,
                lastName: null,
                password: null,
                rePassword: null,
            },
            registration: {
                tab: 0,
                maxTab: 2,
                food: [
                    { name: 'Chinese', like: 50 },
                    { name: 'Korean', like: 50 },
                    { name: 'Japan', like: 50 },
                    { name: 'Vietnamese', like: 50 },
                    { name: 'Thai', like: 50 },
                    { name: 'Indian', like: 50 },
                    { name: 'French', like: 50 },
                    { name: 'Italian', like: 50 }
                ],
                activity: [
                    { name: 'Outdoor', like: 50 },
                    { name: 'Indoor', like: 50 },
                    { name: 'Sport', like: 50 },
                    { name: 'Chess', like: 50 },
                    { name: 'Beach', like: 50 },

                ]
            },
            status: {
                login: false
            },
            events: {
                suggested: [
                    {
                        id: 0,
                        type: "individual",
                        proposer: { id: 0, nickname: "Sosad", firstName: "Kwok Hang", lastName: "Lau" },
                        taker: { id: 0, nickname: "Sosad", firstName: "Kwok Hang", lastName: "Lau" },
                        people: [
                            { person: { id: 1, nickname: "Ben Yuen", firstName: "Yat Hang", lastName: "Yuen" }, status: "suggested" },
                            { person: { id: 0, nickname: "小明", firstName: "Kwok Hang", lastName: "Lau" }, status: "" }],
                        location: { name: "至尊重慶雞煲", district: "Mong Kok", territory: "Kowloon", address: "旺角彌敦道593-601號創興廣場16樓" },
                        time: { start: temp_time1, end: temp_time2 },
                        characteristics: "Meal, Dinner, Chinese, Hotpot"
                        // {
                        //     meal: {
                        //         time: {
                        //             dinner: { weight: 100 },
                        //         },
                        //         cusine: {
                        //             chinese: { weight: 100 },
                        //         },
                        //         weight: 100
                        //     }
                        // }
                    },
                    {
                        id: 1,
                        type: "group",
                        proposer: { id: 0, nickname: "Ben Yuen", firstName: "Yat Hang", lastName: "Yuen" },
                        taker: {
                            id: -1, groupname: "High School Friends", createDate: null, lastMeetingTime: null, groupList: [
                                { nickname: "Sosad", firstName: "Kwok Hang", lastName: "Lau" },
                                { nickname: "Ben Yuen", firstName: "Yat Hang", lastName: "Yuen" },
                            ]
                        },
                        people: [
                            { person: { id: 1, nickname: "Ben Yuen", firstName: "Yat Hang", lastName: "Yuen" }, status: "" },
                            { person: { id: 0, nickname: "Sosad", firstName: "Kwok Hang", lastName: "Lau" }, status: "suggested" }],
                        location: { name: "馬鞍山游泳池", district: "Sha Tin", territory: "New Territory", address: "馬鞍山鞍駿街33號" },
                        time: { start: temp_time1, end: temp_time2 },
                        characteristics: "Activity, Outdoor, Swimming"
                        // {
                        //     type: {
                        //         meal: {
                        //             time: {
                        //                 dinner: { weight: 100 }
                        //             },
                        //             cusine: {
                        //                 chinese: { weight: 100 }
                        //             },
                        //             weight: 100
                        //         }
                        //     }
                        // }
                    },
                ],
                proposed: [],
                invited: [],
                taken: [],
                happenned: [],
                rated: []
            }
            ,
            friends: [
                { id: 0, nickname: "小明", firstName: "Siu Ming", lastName: "Chan", lastMeetingTime: null, picked: false },
                { id: 1, nickname: "傻強", firstName: "Dump", lastName: "Strong", lastMeetingTime: null, picked: false },
                { id: 2, nickname: "Christina", firstName: "Wing Yan", lastName: "Wong", lastMeetingTime: null, picked: false },
                { id: 3, nickname: "Kelvin", firstName: "Yiu", lastName: "Leung", lastMeetingTime: null, picked: false },
                { id: 4, nickname: "Howard", firstName: "Siu Ming", lastName: "Chan", lastMeetingTime: null, picked: false },
                { id: 5, nickname: "Katherine", firstName: "Siu Ming", lastName: "Chan", lastMeetingTime: null, picked: false },
                { id: 6, nickname: "Richard", firstName: "Siu Ming", lastName: "Chan", lastMeetingTime: null, picked: false },
                { id: 7, nickname: "Harold", firstName: "Siu Ming", lastName: "Chan", lastMeetingTime: null, picked: false },
                { id: 8, nickname: "Tim", firstName: "Siu Ming", lastName: "Chan", lastMeetingTime: null, picked: false },
                { id: 9, nickname: "Katie", firstName: "Siu Ming", lastName: "Chan", lastMeetingTime: null, picked: false },
            ],
            groups: [
                {
                    id: -1, groupname: "Big O", createDate: null, lastMeetingTime: null, picked: false, groupList: [
                        { id: 1, nickname: "Richard", firstName: "Siu Ming", lastName: "Chan", lastMeetingTime: null, picked: false },
                        { id: 1, nickname: "Harold", firstName: "Siu Ming", lastName: "Chan", lastMeetingTime: null, picked: false },
                        { id: 1, nickname: "Tim", firstName: "Siu Ming", lastName: "Chan", lastMeetingTime: null, picked: false },
                        { id: 1, nickname: "Katie", firstName: "Siu Ming", lastName: "Chan", lastMeetingTime: null, picked: false },
                    ]
                },
                { id: -2, groupname: "Primary Schoolmates", createDate: null, lastMeetingTime: null, picked: false, groupList: [] },
                { id: -3, groupname: "High School Friends", createDate: null, lastMeetingTime: null, picked: false, groupList: [] },
                { id: -4, groupname: "6C", createDate: null, lastMeetingTime: null, picked: false, groupList: [] },
                { id: -5, groupname: "莊員", createDate: null, lastMeetingTime: null, picked: false, groupList: [] },
            ],
            priorities: [

            ],
            people: {
                search: "",
                suggestion: []
            },
            focus: {
                opening: false,
                item: {
                    searchBox: false,
                    searchBoxGroup: false,
                    createGroupBox: false,
                    groupInfoBox: false,
                    priorityInfoBox: false,
                },
                people: {},
                friends: [],
                friend: { id: null, nickname: null, firstName: null, lastName: null, lastMeetingTime: null, picked: null },
                group: { id: null, groupname: null, createDate: null, lastMeetingTime: null, picked: null, groupList: [] },
                date: null,
                event: {
                    id: 1,
                    type: "group",
                    proposer: { id: 0, nickname: "Ben Yuen", firstName: "Yat Hang", lastName: "Yuen" },
                    taker: {
                        id: -1, groupname: "High School Friends", createDate: null, lastMeetingTime: null, groupList: [
                            { nickname: "Sosad", firstName: "Kwok Hang", lastName: "Lau" },
                            { nickname: "Ben Yuen", firstName: "Yat Hang", lastName: "Yuen" },
                        ]
                    },
                    people: [
                        { person: { id: 1, nickname: "Ben Yuen", firstName: "Yat Hang", lastName: "Yuen" }, status: "" },
                        { person: { id: 0, nickname: "Sosad", firstName: "Kwok Hang", lastName: "Lau" }, status: "suggested" }],
                    location: { name: "馬鞍山游泳池", district: "Sha Tin", territory: "New Territory", address: "馬鞍山鞍駿街33號" },
                    time: { start: temp_time1, end: temp_time2 },
                    characteristics: "Activity, Outdoor, Swimming"
                    // {
                    //     type: {
                    //         meal: {
                    //             time: {
                    //                 dinner: { weight: 100 }
                    //             },
                    //             cusine: {
                    //                 chinese: { weight: 100 }
                    //             },
                    //             weight: 100
                    //         }
                    //     }
                    // }
                }
            },
            characteristics: {
                type: {
                    meal: {
                        lunch: {

                        },
                        tea: {

                        },
                        dinner: {

                        },
                    },
                    activity: {

                    }
                }
            }
        },
        mounted() {
            if (json != null && json != undefined) {
                this.status = json.status;
                this.friends = json.friends;
                this.groups = json.groups;
                this.events = json.events;
                this.priorities = json.priorities;
            }
        },
        methods: {
            //General
            clearScreen: function () {
                console.log("Clear");
                if (this.focus.opening) {
                    this.focus.opening = false;
                }
                else {
                    var keys = Object.keys(this.focus.item);
                    for (var i = 0; i < keys.length; i++) {
                        this.focus.item[keys[i]] = false;
                    }
                }
            },
            stopClearing: function () {
                this.focus.opening = true;
            },
            logoutRequest: function () {
                axios.get('/logoutRequest')
                    .then(function (response) {
                        if (response.data.success) {
                            alert("Successfully Logout-ed");
                        }
                        else alert("Logout Failed due to Unknown Reason");
                    });
            },
            //Friends
            //Friends->Friends
            moveFriendToPriority(id) {
                for (var i = 0; i < this.friends.length; i++) {
                    if (this.friends[i].id == id) {
                        this.friends[i].picked = true;
                        this.priorities.push(this.friends[i]);
                        break;
                    }
                }
            },
            openPeopleSearchBox() {
                console.log("Open Search");
                this.focus.item.searchBox = true;
                this.focus.opening = true;
            },
            searchPeople(key) {
                var _this = this;
                axios.post('/searchPeopleRequest', { key: key })
                    .then(function (response) {
                        console.log(response.data);
                        _this.people.suggestion = response.data;
                    });
            },
            addPeopleToFriend(id) {
                var _this = this;
                axios.post('/addPeopleRequest', { id: id })
                    .then(function (response) {
                        if (response.data.success) {
                            alert('Successfully Added');
                            var newFriend = response.data.friend;
                            _this.friends.push({id: newFriend.id, nickname: newFriend.nickname, firstName: newFriend.firstName, lastName: newFriend.lastName, lastMeetingTime: null, picked: null});
                        }
                        else if (!response.data.userExist)
                            alert("User doesn't exist");
                        else alert("Failed due to unknown error");
                    });
            },
            //Friends->Groups
            moveGroupToPriority(id) {
                for (var i = 0; i < this.groups.length; i++) {
                    if (this.groups[i].id == id) {
                        this.groups[i].picked = true;
                        this.priorities.push(this.groups[i]);
                        break;
                    }
                }
            },
            showGroupInfo(id) {
                for (var i = 0; i < this.groups.length; i++) {
                    if (id == this.groups[i].id) {
                        this.focus.group = this.groups[i];
                    }
                }
                this.focus.item.groupInfoBox = true;
                this.focus.opening = true;
            },
            searchFriends(key) {
                var _this = this;
                axios.post('/searchFriendsRequest', { key: key })
                    .then(function (response) {
                        console.log(response.data);
                        _this.focus.friends = response.data;
                    });

            },
            addFriendToGroup(id){
                console.log(id);
                var duplicateFlag = false;
                for (var i = 0; i < this.focus.group.groupList.length; i++) {
                    var friend = this.focus.group.groupList[i];
                    if(friend.id == id){
                        duplicateFlag = true; break;
                    }
                }
                if(duplicateFlag) alert('Friend already in Group');
                else{
                    for(var i = 0; i < this.friends.length; i++){
                        var friend = this.friends[i];
                        if(friend.id == id){
                            this.focus.group.groupList.push({id: friend.id, nickname: friend.nickname, firstName: friend.firstName, lastName: friend.lastName});
                            break;
                        }
                    }
                }
            },
            openGroupSearchBox() {
                console.log("Open Search Group");
                this.focus.item.searchBoxGroup = true;
                this.focus.opening = true;
            },
            openGroupCreateBox() {
                this.focus.group = { id: null, groupname: null, createDate: null, lastMeetingTime: null, picked: null, groupList: [] };
                this.focus.item.createGroupBox = true;
                this.focus.opening = true;
            },
            submitNewGroup(){
                var _this = this;
                console.log("Submitting a new Group");
                axios.post('/submitNewGroup', _this.focus.group)
                    .then(function(response){
                        console.log(response);
                        window.location.href = "friends.html";
                    });
            },
            submitChangeGroup(){

            },
            //Friends->priorities
            removeFromPriority(id) {
                this.priorities = this.priorities.filter(function (value, index, arr) {
                    if (value.id == id) {
                        if (value.nickname)
                            for (var i = 0; i < this.friends.length; i++)
                                if (this.friends[i].id == id) {
                                    this.friends[i].picked = false;
                                    break;
                                }
                        if (value.groupname)
                            for (var i = 0; i < this.groups.length; i++)
                                if (this.groups[i].id == id) {
                                    this.groups[i].picked = false;
                                    break;
                                }
                        return false;
                    }
                    else return true;
                }.bind(this));
            },
            moveUpPriority(id) {
                for (var i = 0; i < this.priorities.length; i++) {
                    if (this.priorities[i].id == id) {
                        if (i > 0) {
                            var temp = this.priorities[i];
                            this.priorities[i] = this.priorities[i - 1];
                            this.priorities[i - 1] = temp;
                            this.$forceUpdate();
                        }
                        break;
                    }
                }
            },
            moveDownPriority(id) {
                for (var i = 0; i < this.priorities.length; i++) {
                    if (this.priorities[i].id == id) {
                        if (i < this.priorities.length - 1) {
                            var temp = this.priorities[i];
                            this.priorities[i] = this.priorities[i + 1];
                            this.priorities[i + 1] = temp;
                            this.$forceUpdate();
                        }
                        break;
                    }
                }
            },
            moveTopPriority(id) {
                for (var i = 0; i < this.priorities.length; i++) {
                    if (this.priorities[i].id == id) {
                        var temp = this.priorities[i];
                        this.priorities[i] = this.priorities[0];
                        this.priorities[0] = temp;
                        this.$forceUpdate();
                        break;
                    }
                }
            },
            submitPriorities(){
                var _this = this;
                axios.post('/submitPriorities', _this.priorities)
                    .then(function(response){
                        console.log(response);
                        if(response.data.success){
                            alert("Successfully Submitted Priorities!");
                        }
                        else {
                            alert("Failed to Submit Due to unknown Reason");
                        }
                    });

            },
            //login
            loginRequest(loginInfo) {
                axios.post('/loginRequest', loginInfo)
                    .then(function (response) {
                        if (response.data.success) {
                            alert("Successfully Logged in");
                            window.location.href = "index.html";
                        }
                        else alert("Invalid Email or Password");
                    });
            },
            //register
            registerRequest(registerInfo) {
                console.log(registerInfo);
                if (registerInfo.password != registerInfo.rePassword) alert("Passwords don't match");
                else axios.post('/registerRequest', registerInfo)
                    .then(function (response) {
                        if (response.data.success) {
                            alert("Successfully Registered");
                            window.location.href = "login.html";
                        } else {
                            if (response.data.emailExist) {
                                alert("Email Already Exist");
                            }
                            else alert("Register Failed due to Unknown Reason");
                        }
                    });
            },
        }
    });
});

Vue.component('navbar', {
    props: {
        status: {
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
                <li class="nav-item">
                    <a class="nav-link" href="calendar.html">Calender</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="event.html">Events</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="friends.html">Friends and Groups</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="profile.html">Profile</a>
                </li>
            </ul>
            <div class="form-inline my-2 my-lg-0">
                <button v-if="!status.login" class="btn btn-outline-success my-2 my-sm-0" type="submit" onclick="location.href='login.html'">Login</button>
                <button v-else class="btn btn-outline-danger my-2 my-sm-0" type="submit" @click="logoutRequest()">Logout</button>
            </div>
        </div>
    </nav>`,
    methods: {
        logoutRequest() {
            axios.get('/logoutRequest')
                .then(function (response) {
                    if (response.data.success) {
                        alert("Successfully Logout-ed");
                        window.location.href = "index.html"
                    }
                    else alert("Logout Failed due to Unknown Reason");
                });
        }
    }
});

