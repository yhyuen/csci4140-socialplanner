var database = require('./database');

var util = {
    processRegistration: function(data, cookie, callback){
        try{
            var queue = [data];
            while(queue.length > 0){
                var item = queue.shift();
                var newSubCatagories = [];
                for(var i = 0; i < item.subCatagories.length; i++){
                    var targetItem = item.subCatagories[i];
                    if(targetItem.preferenced){
                        delete targetItem.focus;
                        delete targetItem.suggestion;
                        queue.push(targetItem);
                        newSubCatagories.push(targetItem);
                    }
                }
                item.subCatagories = newSubCatagories;
            }
            database.submitRegistration(data, cookie, function(response){
                if(!response.success){
                    callback(response);
                }
                else{
                    database.getCharacteristic(function(characteristic){
                        if(characteristic == null || characteristic.name != "characteristic" || !Array.isArray(characteristic.subCatagories)){
                            characteristic = {name: "characteristic", subCatagories: []};
                        }
                        var Cqueue = [characteristic];
                        var Dqueue = [data];
                        while(Dqueue.length > 0){
                            var Ditem = Dqueue.shift();
                            var Citem = Cqueue.shift();
                            for(var i = 0; i < Ditem.subCatagories.length; i++){
                                var found = false;
                                var targetItem = Ditem.subCatagories[i];
                                for(var j = 0; j < Citem.subCatagories.length; j++){
                                    var matchItem = Citem.subCatagories[j];
                                    if(targetItem.name == matchItem.name){
                                        found = true;
                                        if(matchItem.popularity == null) matchItem.popularity = 1;
                                        else matchItem.popularity++;
                                        if(matchItem.recentPopularity == null) matchItem.recentPopularity = 1;
                                        else matchItem.recentPopularity++;
                                        Dqueue.push(targetItem);
                                        Cqueue.push(matchItem);
                                        break;
                                    }
                                }
                                if(!found){
                                    Citem.subCatagories.push({
                                        name: targetItem.name,
                                        subCatagories: [],
                                        popularity: 1,
                                        recentPopularity: 1,
                                    });
                                    Dqueue.push(targetItem);
                                    Cqueue.push(Citem.subCatagories[Citem.subCatagories.length - 1]);
                                }
                            }
                        }
                        database.pushCharacteristic(characteristic, function(response){
                            callback(response);
                        });
                    });
                }
            });
        }catch(e){
            console.log(e);
            callback({succes: false});
        }
    },
    extractCharacteristic: function(callback){

    },
    flattenEventWithCookie: function (cookie, start, end, callback) {
        database.getUserEvent(cookie, function (events) {
            if (events == null) {
                callback(null); return
            }
            else util.flattenEvent(events, start, end, callback);
        });
    },
    flattenEvent: function (events, start, end, callback) {
        if (events == null) { callback(null); return }
        var flattenEvent = [];
        for (var i = 0; i < events.length; i++) {
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
                    var eachEventStartTime = firstEventStartTime;
                    var eachEventEndTime = new Date(events[i].endTime.getTime() + firstEventStartTime.getTime() - events[i].startTime.getTime())
                    while (eachEventEndTime <= end && eachEventEndTime <= events[i].repeatEnd) {
                        flattenEvent.push({ name: events[i].name, repeating: events[i].repeating, repeatType: events[i].repeatType, startTime: eachEventStartTime, endTime: eachEventEndTime, repeatEnd: events[i].repeatEnd });
                        eachEventStartTime = new Date(eachEventStartTime.getTime() + interval);
                        eachEventEndTime = new Date(eachEventEndTime.getTime() + interval);
                    }
                }
                if (events[i].repeatType == "workday") {
                    var interval = 1000 * 3600 * 24;
                    var firstEventStartTime = null;
                    if (start.getTime() > events[i].startTime.getTime())
                        firstEventStartTime = new Date(events[i].startTime.getTime() + parseInt((start.getTime() - events[i].startTime.getTime()) / interval) * interval);
                    else firstEventStartTime = events[i].startTime;
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
    generateEvent(callback){
        util.matching(function(matchings){
            matchings = util.sortMatchingsIntoArray(matchings);
            for(var i = 0; i < matchings.length; i++){
                if(matchings[i].id.includes(",")){
                    let idA, idB;
                    [idA, idB] = matchings[i].id.split(",");
                    util.findMutalTime(idA, idB, function(time){
                        util.findMutualInterest(idA, idB, function(interest){
                            util.matchActivities(interest, time, function(activities){
                                if(activities == null){
                                    var eventA = {
                                        name: 
                                    } 

                                // "name" : "Morning Run",
                                // "startTime" : ISODate("2019-05-20T23:00:00Z"),
                                // "endTime" : ISODate("2019-05-21T00:00:00Z"),
                                // "repeating" : true,
                                // "repeatType" : "workday",
                                // "repeatEnd" : ISODate("2019-06-20T16:00:00Z"),
                                // "id" : "2353a8b0-7a48-11e9-84d8-45e1bc060414"
                                }
                            });
                        });
                    });
                }
                else{
                    ///////////////////////////////
                }
            }
        });
    },
    collectionArrayToSet(array) {
        var set = {};
        if (array == null || array.length == null) return set;
        for (var i = 0; i < array.length; i++) {
            if (array[i].id != null) {
                set[array[i].id] = array[i];
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
        if(Array.isArray(array) == false) return null;
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] == item) return i;
        }
        return null;
    },
    matching: function (callback) {
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
                            var oppoPrior = util.indexInArray(oppoUser.priorities, 'id', currentUser.id);
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
                                    var oppoUser = allUser[currentPriority.groupList[j].id];
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
            callback(matchings);
        });
    },
    sortMatchingsIntoArray(matchings) {
        var matchingsArray = [];
        for (var key in matchings) {
            matchingsArray.push({id: key, priority: matchings[key]});
        }
        matchingsArray.sort(function (a, b) { return a.priority < b.priority ? -1 : a.priority == b.priority ? 0 : 1});
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
                        allEvents = userAEvents.concat(userBEvents);
                        allEvents.sort(function(a,b){return a.startTime > b.startTime ? 1 : -1 });
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
                            if(allEvents.length > 0)
                                tempEndTime = allEvents[0].startTime;
                            else{
                                if(event.endTime < end)
                                    tempEndTime = end;
                                break;
                            }
                            // var tempDayEnd = new Date(tempStartTime.getFullYear(), tempStartTime.getMonth(), tempStartTime.getDay() + 1);
                            // if(tempEndTime > tempDayEnd){
                            //     var lastEnd = tempStartTime;
                            //     for(var time = tempDayEnd; time < tempEndTime; time = new Date(time.getTime() + 1000*3600*24)){
                            //         timeSlots.push({startTime: lastEnd, endTime: tempDayEnd});
                            //         lastEnd = tempDayEnd; 
                            //     }
                            //     timeSlots.push({startTime: lastEnd, endTime: tempEndTime});
                            // }
                            // else 
                            timeSlots.push({startTime: tempStartTime, endTime:tempEndTime});
                        }
                        timeSlots = util.processTimeSlots(timeSlots);
                        callback(timeSlots);
                    });
                });
            });
        });
    },
    processTimeSlots: function(rawTimeSlots){
        var newTimeSlots = [];
        // Chop into Days
        var tempTimeSlots = [];
        for (var i = 0; i < rawTimeSlots.length; i++) {
            rawTimeSlot = rawTimeSlots[i];
            var startTime = rawTimeSlot.startTime;
            var endTime = rawTimeSlot.endTime;
            var dayEnd = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate() + 1, 0);
            if (endTime > dayEnd) {
                var lastEnd = startTime;
                for (var time = dayEnd; time < endTime; time = new Date(time.getTime() + 1000 * 3600 * 24)) {
                    tempTimeSlots.push({ startTime: lastEnd, endTime: dayEnd});
                    lastEnd = dayEnd;
                }
                tempTimeSlots.push({ startTime: lastEnd, endTime: endTime });
            }
            else tempTimeSlots.push({startTime: startTime, endTime: endTime});
        }
        // Remove 00:00 to 07:30, check if each at least 6 hour long
        for(var i = 0; i < tempTimeSlots.length; i++){
            tempTimeSlot = tempTimeSlots[i];
            var startTime = tempTimeSlot.startTime;
            var endTime = tempTimeSlot.endTime;
            var dayStart = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 7, 30);
            var dayEnd = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate() + 1, 0);
            if(startTime < dayStart){
                startTime = dayStart;
            }
            if(endTime > dayEnd){
                endTime = dayEnd;
            }
            if(startTime < endTime && endTime.getTime() - startTime.getTime() >= 1000*3600*5){
                newTimeSlots.push({startTime: startTime, endTime: endTime})
            }
        }
        return newTimeSlots;
    }
    ,enlargeTree: function(mainTree, smallTree){
        var queue = [mainTree];
        var Aqueue = [smallTree];
        while(queue.length > 0 || Aqueue.length > 0){
            var item = queue.shift();
            var Aitem = Aqueue.shift();
            for(var i = 0; i < Aitem.subCatagories.length; i++){
                var target = Aitem.subCatagories[i];
                var found = item.subCatagories.find(function(a){return a.name == target.name});
                if(found == null){
                    var found = {name: target.name, subCatagories: [], rating: 50}
                    item.subCatagories.push(found);
                }
                queue.push(found);
                Aqueue.push(target);
            }
        }
    },
    sortTreeByName: function(tree){
        var queue = [tree];
        while(queue.length > 0){
            var item = queue.shift();
            item.subCatagories.sort(function(a,b){return a.name > b.name ? 1 : a.name == b.name ? 0 : -1});
            for(var i = 0; i < item.subCatagories.length; i++){
                queue.push(item.subCatagories[i]);
            }
        }
    },
    combinePreferences:function(main, subPreferences){
        var queue = [main];
        var subQueue = [];
        for(var i = 0; i < subPreferences.length; i++) 
            subQueue.push([subPreferences[i]]);
        while(queue.length > 0){
            var item = queue.shift();
            var subItem = [];
            for(var i = 0; i < subPreferences.length; i++)
                subItem.push(subQueue[i].shift());
            for(var i = 0; i < item.subCatagories.length; i++){
                var target = item.subCatagories[i];
                queue.push(target);
                var subTarget = [];
                for(var j = 0; j < subPreferences.length; j++){
                    subTarget.push(subItem[j].subCatagories[i]);
                    subQueue[j].push(subTarget[j]);
                }
                var ratingSum = subTarget.reduce((prev, curr) => curr = parseInt(curr.rating) + prev, 0);
                target.rating = ratingSum / subTarget.length;
            }
        }
    },
    findMutualInterest: function(idA, idB, callback){
        database.getUser(idA, function (userA) {
            database.getUser(idB, function (userB) {
                if (userA == null || userB == null || userA.preferences == null || userB.preferences == null) callback({success: false});
                var mainPreferences = {name: 'characteristic', subCatagories: []};
                util.enlargeTree(mainPreferences, userA.preferences);
                util.enlargeTree(mainPreferences, userB.preferences);
                util.enlargeTree(userA.preferences, mainPreferences);
                util.enlargeTree(userB.preferences, mainPreferences);
                util.sortTreeByName(mainPreferences);
                util.sortTreeByName(userA.preferences);
                util.sortTreeByName(userB.preferences);
                util.combinePreferences(mainPreferences, [userA.preferences, userB.preferences]);
                callback(mainPreferences);
            });
        });
    },
    matchActivities(preferences, time, callback){
        database.getAllActivities(function(activities){
            callback(callback);
        });
    },
}

module.exports = util;