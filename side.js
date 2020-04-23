//https://api.twitch.tv/helix/videos?user_id=108268890 for videos

let gameNameIdMap = new Map();
//gameNameIdMap.set()

class SearchMain{
    constructor(str){
        this.user = '';
        this.game = '';
        this.flagLang = false;
        this.flagView = false;
        this.lang = '';
        this.view = '';
        this.numResult = 100;
        this.query = '';
        this.valid = false;
        this.errorStr = '';
        this.gFlag = 0;
        let testStr = str.trim();
        
        if(testStr.startsWith('{')) {
            let tokens = testStr.match(/\S+/g);
            let userStr = tokens[0];
            if(userStr.endsWith('}')){
                let mayBeStr = userStr.substr(1, userStr.length-2);
                if(mayBeStr.length > 0){
                    this.user = mayBeStr;
                    this.gFlag = 1;
                }
                else
                    this.errorStr = 'User Length must not be 0';
            }
            else
            this.errorStr= 'No closing braces for user'
        }
        else if(testStr.startsWith('[')) {
            let tokens = testStr.match(/\S+/g);
            let gameStr = tokens[0];
            if(gameStr.endsWith(']')){
                let mayBeStr = gameStr.substr(1, gameStr.length-2);
                if(mayBeStr.length > 0){
                    let regEx = new RegExp(/^\d+$/);
                    const found = mayBeStr.match(regEx);
                    if(found){
                        this.game = mayBeStr;
                        this.gFlag = 2;
                        this.extractLanguage(str);
                        this.extractViewer(str);
                    }
                    else {
                        this.errorStr = 'Only numeric characters for game id';
                    }
                }
                else
                    this.errorStr = 'Game Length must not be 0';
            }
            else
                this.errorStr= 'No closing braces for game'
        }
        else {
            this.errorStr = "Doesn't start with a { or [";
        }
    }
    extractLanguage(testStr){
        let tokens = testStr.match(/\S+/g);
        let arr = [];
        for(let i = 1; i < tokens.length; i++) {
            if(tokens[i].toLowerCase().startsWith('lang:')){
                let mayBeStr = tokens[i].toLowerCase().slice(5);
                if(mayBeStr.length == 2){
                    this.lang = mayBeStr;
                    this.flagLang = true;
                }
                else{
                    this.errorStr = 'Langauge code should be of two alphabets';
                    this.gFlag = 0;
                }
            }
        }
        
    }
    extractViewer(testStr){
        let tokens = testStr.match(/\S+/g);
        let arr = [];
        for(let i = 1; i < tokens.length; i++) {
            if(tokens[i].toLowerCase().startsWith('viewer:')){
                let mayBeStr = tokens[i].toLowerCase().slice(7);
                let regEx = new RegExp(/^\d+$/);
                const found = mayBeStr.match(regEx);
                if(found){
                    this.view = mayBeStr;
                    this.flagView = true;
                }
                else{
                    this.gFlag = 0;
                    this.errorStr = 'Viewer should be numeric';
                }
            }
            else if(tokens[i].toLowerCase().startsWith('viewers:')){
                let mayBeStr = tokens[i].toLowerCase().slice(8);
                let regEx = new RegExp(/^\d+$/);
                const found = mayBeStr.match(regEx);
                if(found){
                    this.view = mayBeStr;
                    this.flagView = true;
                }
                else{
                    this.gFlag = 0;
                    this.errorStr = 'Viewer should be numeric';
                }
            }
        }   
    }
    async getGameByGameId(gId){
        //console.log(gId);
        let feeds,response;
        try{
        response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gId}&first=${this.numResult}`,{
            method:'GET',
            headers: {
            'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
            }
        });
        
        feeds = await response.json();
        console.log('Sunygame', feeds);
    
        if(feeds.data.length > 0)
            return {isDone: true,result: feeds.data};
        return {isDone: false,result: feeds.data};
        }   
        catch(error){
            console.log(error);
            return {isDone: false,result: null};
        }
    }
    async getGameByGameIdAndView(gId){
        console.log(gId);
        let feeds,response;
        
        try{
            response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gId}&first=${this.numResult}`,{
            method:'GET',
            headers: {
            'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
            }
        });
        
        feeds = await response.json();
        let arr = [...feeds.data];
        let newArr = arr.filter(elem => elem.viewer_count>this.view)
        if(feeds.data.length > 0)
            return {isDone: true,result: newArr};
        return {isDone: false,result: newArr};
        }   
        catch(error){
            console.log(error);
            return {isDone: false,result: null};
        }
        
    }
    async getGameByGameIdAndLang(gId){
        console.log(gId);
        let feeds,response;
        
        try{
            response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gId}&first=${this.numResult}&language=${this.lang}`,{
            method:'GET',
            headers: {
            'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
            }
        });
        
        feeds = await response.json();
    
        if(feeds.data.length > 0)
            return {isDone: true,result: feeds.data};
        return {isDone: false,result: feeds.data};
        }   
        catch(error){
            console.log(error);
            return {isDone: false,result: null};
        }
    }
    async getGameByGameIdAndLangAndViewer(gId){
        console.log(gId);
        let feeds,response;
        
        try{
            response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gId}&first=${this.numResult}&language=${this.lang}`,{
            method:'GET',
            headers: {
            'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
            }
        });
        
        feeds = await response.json();
        let arr = [...feeds.data];
        let newArr = arr.filter(elem => elem.viewer_count>this.view)
        if(feeds.data.length > 0)
            return {isDone: true,result: newArr};
        return {isDone: false,result: newArr};
        }   
        catch(error){
            console.log(error);
            return {isDone: false,result: null};
        }
    }
    async getUserByName(userName){
        // console.log(userName);
        let feedsOne, responseOne, feedsTwo, responseTwo;
        try{
            responseOne = await fetch(`https://api.twitch.tv/helix/users?login=${userName}`,{
                method:'GET',
                headers: {
                'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
                }
            });
            
            feedsOne = await responseOne.json();
            let player_id = feedsOne.data[0].id;
    
            if(feedsOne.data.length > 0) {
                responseTwo = await fetch(`https://api.twitch.tv/helix/streams?user_id=${player_id}`,{
                method:'GET',
                headers: {
                    'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
                    }
                });
                feedsTwo = await responseTwo.json();
                return {isDone: true,result: feedsTwo.data};
            }
            else
                return {isDone: false,result: null};
        }   
        catch(error){
            console.log(error);
            return  {isDone: false,result: null};
        }
    }
}

// async function test(){
//     let totalStr = sessionStorage.getItem('searchedKey');
//     let searchEx1 = new SearchMain(totalStr);
//     // console.log(elem);
//     if(searchEx1.gFlag == 1){
//         let res = await searchEx1.getUserByName(searchEx1.user);
//         console.log(res);
//     }
//     else if(searchEx1.gFlag == 2) {
//         if(searchEx1.flagLang && searchEx1.flagView){
//             let res = await searchEx1.getGameByGameIdAndLangAndViewer(searchEx1.game);
//             console.log('1');
//             console.log(res);
//         }
//         else if(searchEx1.flagLang && !searchEx1.flagView){
//             let res = await searchEx1.getGameByGameIdAndLang(searchEx1.game);
//             console.log('2');
//             console.log(res);
//         }
//         else if(!searchEx1.flagLang && searchEx1.flagView){
//             let res = await searchEx1.getGameByGameIdAndView(searchEx1.game);
//             console.log('3');
//             console.log(res);
//         }
//         else {
//             let res = await searchEx1.getGameByGameId(searchEx1.game);
//             console.log('4');
//             console.log(res);
//         }
//     }
//     else {
//         console.log(searchEx1.user +' '+ searchEx1.game + ' ' +searchEx1.errorStr);
//     }
// }
let channelMainElem = document.querySelector('.streams-list-div');
let headerAllElem = document.querySelector('h2');
let headerElemArr = Array.from(headerAllElem);
headerElemArr.forEach(elem => elem.style.display = 'none');
async function loadChannels() {
    let totalStr = sessionStorage.getItem('searchedKey');
    let searchEx1 = new SearchMain(totalStr);
    // console.log(elem);
    if(searchEx1.gFlag == 1){
        let res = await searchEx1.getUserByName(searchEx1.user);
        console.log(res);
    }
    else if(searchEx1.gFlag == 2) {
        let res;
        if(searchEx1.flagLang && searchEx1.flagView){
            res = await searchEx1.getGameByGameIdAndLangAndViewer(searchEx1.game);
            
        }
        else if(searchEx1.flagLang && !searchEx1.flagView){
            res = await searchEx1.getGameByGameIdAndLang(searchEx1.game);
            
        }
        else if(!searchEx1.flagLang && searchEx1.flagView){
            res = await searchEx1.getGameByGameIdAndView(searchEx1.game);
        }
        else {
            res = await searchEx1.getGameByGameId(searchEx1.game);
        }
        let str = '';
        let arr = res.result;
        console.log('HERE');
        console.log(arr);
        arr.forEach(elem =>{
            str += `<div class='streams-list-elem'>
            <div class='streams-elem-grid'>
                <div class='streamer-img-div'>
                    <img src =${getImageThumb(elem.thumbnail_url)} class='online-img streamer-img'>

                </div>
                <div class='streamer-details-div'>
                    <a href='https://www.twitch.tv/${elem.user_name}'><h3 class='streamer-name'>${elem.user_name}</h3></a>
                    <h4 class='stream-game-name'>${elem.game_id}</h4>
                    <h4 class='stream-view-count'>${getCounts(elem.viewer_count)} viewers</h4>
                    <h4 class='stream-title-name'>${elem.title}</h4>
                    <h5 class='Language'>${elem.language}</h5>
                </div>
            </div>
        </div>`;
        });
        channelMainElem.innerHTML = str;
        headerElemArr.forEach(elem => elem.style.display = 'block');
    }
    else {
        console.log(searchEx1.user +' '+ searchEx1.game + ' ' +searchEx1.errorStr);
    }
}
function getImageThumb(str){
    let ind = str.indexOf('-{width}x{height}');
    // let res1 = str.replace('{width}', '400');
    // let res = res1.replace('{height}', '300');
    let res = str.substr(0, ind) + str.substr(ind+17);
    console.log(res);
    return res;
}
function getCounts(cnt) {
    let res;
    if(cnt >= 1000)
    {    
        res = cnt/1000;
        return res.toFixed(1)+'K';
    }
    return cnt;
    

}
// test();
loadChannels();

//https://api.twitch.tv/helix/games?id=29595
/*
{
    "data": [
        {
            "id": "29595",
            "name": "Dota 2",
            "box_art_url": "https://static-cdn.jtvnw.net/ttv-boxart/Dota%202-{width}x{height}.jpg"
        }
    ]
}
*/


// async function search(){
//     let isDone = false;
//     let isGame = false;
//     let isUser = false;
//     if(isDone == false){
        
//         let totalStr = sessionStorage.getItem('searchedKey');
//         let arr = totalStr.match(/\S+/g);
//         console.log(arr);
//         let str = arr[0];
//         let obj = matchesGameByGameId(str);
//         // let h1 = document.createElement('h1');
//         // h1.innerHTML = str;
//         // document.body.append(h1);
//         //console.log(obj.stringify())
        
//         if(obj.res == true){
//             console.log('Valid format for game ' + str);
//             //console.log(getGameByGameId(obj.result) );
//             let bool = await getGameByGameId(obj.result);
//             if(bool)
//                 console.log('Game-ID-Valid');
//             else
//                 console.log('Game-ID not a game');
//             isDone = true;
//             isGame = true;
//         }
//         else{
//             console.log('Invalid format for game')
//         }
//     }

//     if(isDone == false){
//         let obj = matchesUserByUserName(str);
//         //console.log(obj.stringify())
        
//         if(obj.res == true){
//             console.log('Valid format for user ' + obj.result);
//             //console.log(getGameByGameId(obj.result) );
//             let qRes = await getStatusByUserName(obj.result);    //return object {user found, but not live or user found and live, user not found}
//             if(qRes.res){
//                 if(qRes.isLive)
//                     console.log(qRes.isLive  + ' Player is live');
//                 else
//                     console.log(qRes.isLive  + ' Player is not live');
//             }
//             else
//                 console.log(qRes.isLive + ' Player is live');
//             isDone = true;
//             isUser = true;
//         }
//         else{
//             console.log('Invalid format for user')
//         }
//     }
//     if(isDone == false){
//         let obj = matchesStreamByGameIdAndLang(str);
//         //console.log(obj.stringify())
        
//         if(obj.res == true){
//             console.log('Valid format for lang ' + obj.result);
//             //console.log(getGameByGameId(obj.result) );
//             let qRes = await getStreamByGameIdAndLang(29595,obj.result, 100);   
//             if(qRes)
//                 console.log(qRes  + ' Language and game found');
//             else
//                 console.log(qRes + ' Error with langauge');
//             isDone = true;
//             isGame = true;
//         }
//         else{
//             console.log('Invalid format for user')
//         }
//     }
//     if(isDone == false){
//         let obj = matchesStreamByGameIdAndViewerCount(str);
//         //console.log(obj.stringify())
        
//         if(obj.res == true){
//             console.log('Valid format for lang ' + obj.result);
//             //console.log(getGameByGameId(obj.result) );
//             let qRes = await getStreamByGameIdAndViewerCount(29595,'en', 100, obj.result);    //return object {user found, but not live or user found and live, user not found}

//             console.log(qRes  + ' # streams with more than ' + obj.result +' viewers');
            
//             isDone = true;
//             isGame = true;
//         }
//         else{
//             console.log('Invalid format for user')
//         }
//     }
// }

//  For game [game-id]
//  https://api.twitch.tv/helix/streams?game_id=29595
//Check if game id is perfect in format i.e. inside '[', ']'
// function matchesGameByGameId(gIdWithBraces) {
//     if(gIdWithBraces.trim().startsWith ('[') && gIdWithBraces.endsWith(']'))
//     {
//         let str = gIdWithBraces.trim();
//         let res = str.substr(1, str.length-2);
//         console.log('|'+res+'|');
//         //ccheck whether res shouldn't have non-numeric characters
//         let regEx = new RegExp(/^\d+$/);
//         const found = res.match(regEx);
//         if(found)
//             return {res: true, result: res};
//         return {res: false, result: null};
//     }
//     return {res: false,result: null};
// }

// //Check if a game exists with extracted correct formatted gameid
// async function getGameByGameId(gId){
//     console.log(gId);
//     let feeds,response;
//     searchFound = false;
//     try{
//     response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gId}`,{
//         method:'GET',
//         headers: {
//         'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
//         }
//     });
    
//     feeds = await response.json();
//     console.log('Sunygame', feeds);

//     if(feeds.data.length > 0)
//         return true;
//     return false;
//     }   
//     catch(error){
//         console.log(error);
//         return false;
//     }
// }

// //  For game [game-id]
// //https://api.twitch.tv/helix/users?login=gorgc if user exists take id
// //look with that id 
// //https://api.twitch.tv/helix/streams?user_id=108268890
// //Check if user name is present 'user:gorgc'
// function matchesUserByUserName(userNameWithUser) {
//     if(gIdWithBraces.trim().startsWith ('{') && gIdWithBraces.endsWith('}'))
//     {
//         let str = gIdWithBraces.trim();
//         let ret = str.substr(1, str.length-2);
//         console.log('|'+res+'|');
//         if(ret.length >= 1)
//             return {res: true, result: ret};
//         return {res: false, result: null};
//     }
//     return {res: false,result: null};

// }


// //Check if a game exists with extracted correct formatted gameid
// async function getStatusByUserName(userName){
//     console.log(userName);
//     let feedsOne, responseOne, feedsTwo, responseTwo;
//     searchFound = false;
//     try{
//         responseOne = await fetch(`https://api.twitch.tv/helix/users?login=${userName}`,{
//             method:'GET',
//             headers: {
//             'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
//             }
//         });
        
//         feedsOne = await responseOne.json();
//         console.log('Sunyuser', feedsOne);
//         let player_id = feedsOne.data[0].id;

//         if(feedsOne.data.length > 0) {
//             responseTwo = await fetch(`https://api.twitch.tv/helix/streams?user_id=${player_id}`,{
//             method:'GET',
//             headers: {
//                 'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
//                 }
//             });
//             feedsTwo = await responseTwo.json();
//             console.log('Sunyuser', feedsTwo);
//             if(feedsTwo.data[0].type=='live')
//                 return {res: true, isLive:true};
//             return {res:true, isLive:false};
//         }
//         else
//             return {res:false, result: null};
//     }   
//     catch(error){
//         console.log(error);
//         return false;
//     }
// }

// //Search for language

// //https://api.twitch.tv/helix/streams?game_id=29595&first=100&language=pt
// //For viewer count appli filter on result for viewer_count	>1000
// //For live apply filter on result for type="live" or type=""
// function matchesStreamByGameIdAndLang(langStr) {
//     let str = langStr.trim();
//     if(str.toLowerCase().startsWith('lang:')){
//         let ret = str.slice(5);
//         console.log('Language is' +ret);
//         if(ret.length > 0)
//             return {res: true, result: ret};
//         return {res:false, result: null};
//     }
//     else{
//         return {res:false, result: null};
//     }
// }

// //Check if a game exists with extracted correct formatted gameid
// async function getStreamByGameIdAndLang(gId, lang, countResult){
//     console.log(gId);
//     let feeds,response;
//     searchFound = false;
//     try{
//     response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gId}&first=${countResult}&language=${lang}`,{
//         method:'GET',
//         headers: {
//         'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
//         }
//     });
    
//     feeds = await response.json();
//     console.log('Sunylang', feeds);

//     if(feeds.data.length > 0)
//         return true;
//     return false;
//     }   
//     catch(error){
//         console.log(error);
//         return false;
//     }
// }


// //https://api.twitch.tv/helix/streams?game_id=29595&first=100&language=pt
// //For viewer count appli filter on result for viewer_count	>1000
// function matchesStreamByGameIdAndViewerCount(viewerStr) {        //GameID could be optional here
//     let str = viewerStr.trim();
//     if(str.toLowerCase().startsWith('viewer:')||str.startsWith('viewers:')){
//         let ind = str.indexOf(':');
//         let ret = str.slice(ind+1);
//         console.log('Viewer count' +ret);
//         if(ret.length > 0)
//             return {res: true, result: ret};
//         return {res:false, result: null};
//     }
//     else{
//         return {res:false, result: null};
//     }
// }

// //Check if a game exists with extracted correct formatted gameid
// async function getStreamByGameIdAndViewerCount(gId, lang, countResult, viewerCount){
//     console.log(gId);
//     let feeds,response;
//     searchFound = false;
//     try{
//     response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gId}&first=${countResult}&language=${lang}`,{
//         method:'GET',
//         headers: {
//         'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
//         }
//     });
    
//     feeds = await response.json();
//     console.log('Sunylang', feeds);
//     let cnt = 0;
//     feeds.data.forEach(elem =>{
//         if(elem.viewer_count > viewerCount) {
//             cnt++;
//         }
//     })
//     return cnt;
//     }   
//     catch(error){
//         console.log(error);
//         return false;
//     }
// }
// search();
