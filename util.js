var database = require('./database');

var util = {
    flattenEvent: function(cookie, start, end, callback){
        database.getUserEvent(cookie, function(events){
            if(events == null) {callback(null); return};
            var flattenEvent = [];
            for(var i = 0; i < events.length; i++){
                console.log(events[i]);
                if(!events[i].repeating){
                    if(start <= events[i].startTime && end >= events[i].endTime){
                        flattenEvent.push(events[i]);
                    }
                }
                else{
                    if(events[i].repeatType == "day"){
                        var interval = 1000*3600*24;
                        var firstEventStartTime = null;
                        if(start.getTime() > events[i].startTime.getTime())
                            firstEventStartTime = new Date(events[i].startTime.getTime() + parseInt((start.getTime() - events[i].startTime.getTime()) / interval) * interval);
                        else firstEventStartTime = events[i].startTime;
                        console.log("Repeat Type Day first Day:");
                        console.log(firstEventStartTime);
                        var eachEventStartTime = firstEventStartTime;
                        var eachEventEndTime = new Date (events[i].endTime.getTime() + firstEventStartTime.getTime() - events[i].startTime.getTime())
                        while(eachEventEndTime <= end){
                            flattenEvent.push({name: events[i].name, repeating: events[i].repeating, repeatType: events[i].repeatType, startTime: eachEventStartTime, endTime: eachEventEndTime, repeatEnd: events[i].repeatEnd});
                            eachEventStartTime = new Date(eachEventStartTime.getTime() + interval);
                            eachEventEndTime = new Date(eachEventEndTime.getTime() + interval);
                        }
                    }
                    if(events[i].repeatType == "weekday"){
                        var interval = 1000*3600*24;
                        var firstEventStartTime = null;
                        if(start.getTime() > events[i].startTime.getTime())
                            firstEventStartTime = new Date(events[i].startTime.getTime() + parseInt((start.getTime() - events[i].startTime.getTime()) / interval) * interval);
                        else firstEventStartTime = events[i].startTime;
                        console.log("Repeat Type Day first Day:");
                        console.log(firstEventStartTime);
                        var eachEventStartTime = firstEventStartTime;
                        var eachEventEndTime = new Date (events[i].endTime.getTime() + firstEventStartTime.getTime() - events[i].startTime.getTime())
                        while(eachEventEndTime <= end){
                            if(eachEventStartTime.getDay() != 0 && eachEventStartTime.getDay() != 6)
                                flattenEvent.push({name: events[i].name, repeating: events[i].repeating, repeatType: events[i].repeatType, startTime: eachEventStartTime, endTime: eachEventEndTime, repeatEnd: events[i].repeatEnd});
                            eachEventStartTime = new Date(eachEventStartTime.getTime() + interval);
                            eachEventEndTime = new Date(eachEventEndTime.getTime() + interval);
                        }
                    }
                    if(events[i].repeatType == "week"){
                        var interval = 1000*3600*24*7;
                        var firstEventStartTime = null;
                        if(start.getTime() > events[i].startTime.getTime())
                            firstEventStartTime = new Date(events[i].startTime.getTime() + parseInt((start.getTime() - events[i].startTime.getTime()) / (1000*24*3600)) * (1000*24*3600));
                        else firstEventStartTime = events[i].startTime;
                        console.log("Repeat Type Day first Day:");
                        console.log(firstEventStartTime);
                        var eachEventStartTime = firstEventStartTime;
                        var eachEventEndTime = new Date (events[i].endTime.getTime() + firstEventStartTime.getTime() - events[i].startTime.getTime())
                        while(eachEventEndTime <= end){
                            flattenEvent.push({name: events[i].name, repeating: events[i].repeating, repeatType: events[i].repeatType, startTime: eachEventStartTime, endTime: eachEventEndTime, repeatEnd: events[i].repeatEnd});
                            eachEventStartTime = new Date(eachEventStartTime.getTime() + interval);
                            eachEventEndTime = new Date(eachEventEndTime.getTime() + interval);
                        }
                    }
                    
                    
                }
            }
            callback(flattenEvent);
        });
    },
}

module.exports = util;