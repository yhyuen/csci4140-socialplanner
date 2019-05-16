var database = require('./database');

var util = {
    flattenEventWithCookie: function (cookie, start, end, callback) {
        database.getUserEvent(cookie, function (events) {
            if (events == null) {
                callback(null); return
            }
            else flattenEvent(events, start, end, callback);
        });
    },
    flattenEvent: function (events, start, end, callback) {
        if (events == null) { callback(null); return }
        var flattenEvent = [];
        for (var i = 0; i < events.length; i++) {
            console.log(events[i]);
            if (!events[i].repeating) {
                if (start <= events[i].startTime && end >= events[i].endTime) {
                    flattenEvent.push(events[i]);
                }
            }
            else {
                if (events[i].repeatType == "day") {
                    var interval = 1000 * 3600 * 24;
                    var firstEventStartTime = null;
                    if (start.getTime() > events[i].startTime.getTime())
                        firstEventStartTime = new Date(events[i].startTime.getTime() + parseInt((start.getTime() - events[i].startTime.getTime()) / interval) * interval);
                    else firstEventStartTime = events[i].startTime;
                    console.log("Repeat Type Day first Day:");
                    console.log(firstEventStartTime);
                    var eachEventStartTime = firstEventStartTime;
                    var eachEventEndTime = new Date(events[i].endTime.getTime() + firstEventStartTime.getTime() - events[i].startTime.getTime())
                    while (eachEventEndTime <= end && eachEventEndTime <= events[i].repeatEnd) {
                        flattenEvent.push({ name: events[i].name, repeating: events[i].repeating, repeatType: events[i].repeatType, startTime: eachEventStartTime, endTime: eachEventEndTime, repeatEnd: events[i].repeatEnd });
                        eachEventStartTime = new Date(eachEventStartTime.getTime() + interval);
                        eachEventEndTime = new Date(eachEventEndTime.getTime() + interval);
                    }
                }
                if (events[i].repeatType == "weekday") {
                    var interval = 1000 * 3600 * 24;
                    var firstEventStartTime = null;
                    if (start.getTime() > events[i].startTime.getTime())
                        firstEventStartTime = new Date(events[i].startTime.getTime() + parseInt((start.getTime() - events[i].startTime.getTime()) / interval) * interval);
                    else firstEventStartTime = events[i].startTime;
                    console.log("Repeat Type Day first Day:");
                    console.log(firstEventStartTime);
                    var eachEventStartTime = firstEventStartTime;
                    var eachEventEndTime = new Date(events[i].endTime.getTime() + firstEventStartTime.getTime() - events[i].startTime.getTime())
                    while (eachEventEndTime <= end && eachEventEndTime <= events[i].repeatEnd) {
                        if (eachEventStartTime.getDay() != 0 && eachEventStartTime.getDay() != 6)
                            flattenEvent.push({ name: events[i].name, repeating: events[i].repeating, repeatType: events[i].repeatType, startTime: eachEventStartTime, endTime: eachEventEndTime, repeatEnd: events[i].repeatEnd });
                        eachEventStartTime = new Date(eachEventStartTime.getTime() + interval);
                        eachEventEndTime = new Date(eachEventEndTime.getTime() + interval);
                    }
                }
                if (events[i].repeatType == "week") {
                    var interval = 1000 * 3600 * 24 * 7;
                    var firstEventStartTime = null;
                    if (start.getTime() > events[i].startTime.getTime())
                        firstEventStartTime = new Date(events[i].startTime.getTime() + parseInt((start.getTime() - events[i].startTime.getTime()) / (1000 * 24 * 3600)) * (1000 * 24 * 3600));
                    else firstEventStartTime = events[i].startTime;
                    console.log("Repeat Type Day first Day:");
                    console.log(firstEventStartTime);
                    var eachEventStartTime = firstEventStartTime;
                    var eachEventEndTime = new Date(events[i].endTime.getTime() + firstEventStartTime.getTime() - events[i].startTime.getTime())
                    while (eachEventEndTime <= end && eachEventEndTime <= events[i].repeatEnd) {
                        flattenEvent.push({ name: events[i].name, repeating: events[i].repeating, repeatType: events[i].repeatType, startTime: eachEventStartTime, endTime: eachEventEndTime, repeatEnd: events[i].repeatEnd });
                        eachEventStartTime = new Date(eachEventStartTime.getTime() + interval);
                        eachEventEndTime = new Date(eachEventEndTime.getTime() + interval);
                    }
                }


            }
        }
        callback(flattenEvent);
    },
    collectionArrayToSet(array) {
        var set = {};
        if (array == null || array.length == null) return set;
        for (var i = 0; i < array.length; i++) {
            if (array[i].id != null) {
                set[id] = array[i];
            }
        }
        return set;
    },
    toTuple: function (a, b) {
        if (a < b) return [a, b];
        else return [b, a];
    },
    indexInArray(array, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == item) return i;
        }
        return null;
    },
    indexInArray(array, key, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] == item) return i;
        }
        return null;
    },
    matching: function () {
        database.getAllUser(function (response) {
            if (response == null || response == null) return;
            var allUser = util.collectionArrayToSet(response);
            var matchings = {};
            for (var id in allUser) {
                var currentUser = allUser[id];
                if (currentUser.priorities != null && currentUser.priorities.length != null) {
                    for (var i = 0; i < currentUser.priorities.length; i++) {
                        var currentPriority = currentUser.priorities[i];
                        if (currentPriority.nickname != undefined) { //person
                            var oppoUser = allUser[currentPriority.id];
                            if (matchings[util.toTuple(currentUser.id, oppoUser.id)] != null) continue;
                            var oppoPrior = util.indexInArray(oppoUser.priorities, id, currentUser.id);
                            if (oppoPrior != null) {
                                matchings[util.toTuple(currentUser.id, oppoUser.id)] = (i + oppoPrior) / 2;
                                console.log("Match Made [User]");
                                console.log(currentUser.nickname + ", " + oppoUser.nickname);
                            }
                        }
                        if (currentPriority.groupname != undefined) { //group
                            if (currentPriority.groupList != null && currentPriority.groupList.length != null) {
                                if (matchings[currentPriority.id] != null) continue;
                                var groupMembers = currentPriority.groupList.length;
                                var prioredMembers = 0;
                                var totalPrior = 0;
                                for (var j = 0; j < currentPriority.groupList.length; j++) {
                                    var oppoUser = allUser[currentPriority.groupList[i].id];
                                    var oppoPrior = util.indexInArray(oppoUser.priorities, id, currentPriority.id);
                                    if (oppoPrior != null) {
                                        prioredMembers++;
                                        totalPrior += oppoPrior;
                                    }
                                }
                                if (prioredMembers >= groupMembers * 0.85) {
                                    matchings[currentPriority, id] = totalPrior / prioredMembers;
                                    console.log("Match Made [Group]");
                                    console.log(currentPriority.groupname);
                                }
                            }
                        }
                    }
                }
            }
            return matchings;
        });
    },
    sortMatchingsIntoArray(matchings) {
        var matchingsArray = [];
        for (var key in matchings) {
            matchingsArray.push([key, matchings[key]]);
        }
        matchingsArray.sort(function (a, b) {
            a = a[1];
            b = b[1];
            return a < b ? -1 : (a > b ? 1 : 0);
        });
        return matchingsArray;
    },
    findMutalTime: function (idA, idB, callback) {
        database.getUser(idA, function (userA) {
            database.getUser(idB, function (userB) {
                if (userA == null || userB == null || userA.events == null || userB.events == null) return;
                var now = new Date();
                var start = new Date(now.getTime() + 1000*3600*24*2);
                var end = new Date(now.getTime() + 1000*3600*24*37);
                util.flattenEvent(userA.events, start, end, function(userAEvents){
                    util.flattenEvent(userB.events, start, end, function(userBEvents){
                        allEvents = userAEvents.concat(userAEvents);
                        allEvents.sort(function(a,b){return a.startTime < b.startTime ? 1 : -1 });
                        var event = null;
                        var timeSlots = [];
                        var tempStartTime = null;
                        var tempEndTime = null;
                        if(allEvents.length > 0 && allEvents[0].startTime > start){
                            timeSlots.push({startTime: start, endTime: allEvents[0].startTime});
                        }
                        while(allEvents.length > 0){
                            event = allEvents.shift();
                            tempStartTime = event.endTime;
                            while(allEvents.length > 0 && allEvents[0].startTime < event.endTime){
                                event = allEvents.shift();
                                tempStartTime = event.endTime;
                            }
                            tempEndTime = allEvents[0].startTime;
                            timeSlots.push({startTime: tempStartTime, endTime:tempEndTime});
                        }
                        if(event.endTime < end){
                            timeSlots.push({startTime: event.endTime, endTime: end});
                        }
                        callback(timeSlots);
                    });
                });
            });
        });
    },
    divideTimeSlots: function(timeSlots){
        timePieces = [];
        var lunch1 = {type: 'lunch', start: 1000*3600*11, end: 1000*3600*12};
        var lunch2 = {type: 'lunch', start: 1000*3600*12, end: 1000*3600*13};
        var lunch3 = {type: 'lunch', start: 1000*3600*13, end: 1000*3600*14};
        var dinner1 = {type: 'dinner', start: 1000*3600*17, end: 1000*3600*18};
        var dinner2 = {type: 'dinner', start: 1000*3600*18, end: 1000*3600*19};
        var dinner3 = {type: 'dinner', start: 1000*3600*19, end: 1000*3600*20};
        var dinner4 = {type: 'dinner', start: 1000*3600*20, end: 1000*3600*22};
        var fullday1 = {type: 'fullday', start: 1000*3600*10, end: 1000*3600*18};
        var fullday2 = {type: 'fullday', start: 1000*3600*11, end: 1000*3600*19};
        var fullday3 = {type: 'fullday', start: 1000*3600*12, end: 1000*3600*20};
        var fullday4 = {type: 'fullday', start: 1000*3600*13, end: 1000*3600*21};
        var fullday5 = {type: 'fullday', start: 1000*3600*14, end: 1000*3600*22};
        var halfday1 = {type: 'halfday', start: 1000*3600*15, end: 1000*3600*18};
        var halfday2 = {type: 'halfday', start: 1000*3600*16, end: 1000*3600*19};
        var halfday3 = {type: 'halfday', start: 1000*3600*17, end: 1000*3600*20};
        var halfday4 = {type: 'halfday', start: 1000*3600*18, end: 1000*3600*21};
        var halfday5 = {type: 'halfday', start: 1000*3600*19, end: 1000*3600*22};

        var activities = [lunch1, lunch2, lunch3, dinner1, dinner2, dinner3, dinner4, fullday1, fullday2, fullday3, fullday4, fullday5, halfday1, halfday2, halfday3, halfday4, halfday5];
        for(var i = 0; i < timeSlots.length; i++){
            var timeSlot = timeSlots[i];
            var day = timeSlot.getDate();
            for (var i = 0; i < activities.length; i++){
                if(timeSlot.start.getTime() > day.getTime() + activities[i].start && timeSlot.end.getTime() < day.getTime() + activities[i].end){
                    
                }
            }
        }
    }
}

module.exports = util;