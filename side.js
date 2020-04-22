//https://api.twitch.tv/helix/videos?user_id=108268890 for videos
class SearchMain{
    constructor(str){

        //this.user;
        //this.game;
        //this.flagLang;
        //this.flagView;
        this.user = '';
        this.game = '';
        this.flagLang = false;
        this.flagView = false;
        this.langList = [];
        this.view = '';
        this.numResult = 100;
        this.query = '';
        this.valid = false;
        this.errorStr = '';
        let testStr = str.trim();
        
        if(testStr.startsWith('{')) {
            let tokens = testStr.match(/\S+/g);
            let userStr = tokens[0];
            if(userStr.endsWith('}')){
                let mayBeStr = userStr.substr(1, userStr.length-2);
                if(mayBeStr.length > 0)
                    this.user = mayBeStr;
                else
                this.errorStr = 'User Length must not be 0';
            }
            else
            this.errorStr= 'No closing braces for user'
        }
        else if(testStr.startsWith('[')) {
            let tokens = testStr.match(/\S+/g);
            console.log(tokens);
            let gameStr = tokens[0];
            if(gameStr.endsWith(']')){
                console.log('|'+gameStr+'|'+gameStr.length)

                let mayBeStr = gameStr.substr(1, gameStr.length-2);
                console.log(mayBeStr);
                if(mayBeStr.length > 0){
                    let regEx = new RegExp(/^\d+$/);
                    const found = mayBeStr.match(regEx);
                    if(found){
                        this.game = mayBeStr;
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
                arr.push(tokens[i]);
            }
        }
        arr.forEach(elem =>{
            if(elem.slice(5).length == 2){
                this.langList.push(elem.slice(5));
                this.flagLang = true;
            }
            else
                this.errorStr = 'Langauge code should be of two alphabets';
        })
    }
    extractViewer(testStr){
        let tokens = testStr.match(/\S+/g);
        let arr = [];
        for(let i = 1; i < tokens.length; i++) {
            if(tokens[i].toLowerCase.startsWith('viewer:')){
                let mayBeStr = tokens[i].toLowerCase().slice(7);
                let regEx = new RegExp(/^\d+$/);
                const found = mayBeStr.match(regEx);
                if(found){
                    this.view = mayBeStr;
                    this.flagView = true;
                }
                else{
                    this.errorStr = 'Viewer should be numeric';
                }
            }
            else if(tokens[i].toLowerCase.startsWith('viewers:')){
                let mayBeStr = tokens[i].toLowerCase().slice(8);
                let regEx = new RegExp(/^\d+$/);
                const found = mayBeStr.match(regEx);
                if(found){
                    this.view = mayBeStr;
                    this.flagView = true;
                }
                else{
                    this.errorStr = 'Viewer should be numeric';
                }
            }
        }
        
    }
}

let searchEx1 = new SearchMain('{gorgc}');
console.log('First:' +searchEx1.errorStr);
let searchEx2 = new SearchMain('[29595] lang:en viewer:677');
console.log('Second: '+searchEx2.errorStr);
console.log('Second: '+searchEx2.langList);
console.log('Second: '+searchEx2.view);
let searchEx3 = new SearchMain('[29dsd595]');// lang:en viewer:677 lang:pt');
console.log('Third: ' + searchEx3.errorStr);
let searchEx4 = new SearchMain('[29595]')// lang:en viewer:6g899 viewers: 2174');
console.log('Forth: '+ searchEx4.errorStr);
console.log('Done');

async function search(){
    let isDone = false;
    let isGame = false;
    let isUser = false;
    if(isDone == false){
        
        let totalStr = sessionStorage.getItem('searchedKey');
        let arr = totalStr.match(/\S+/g);
        console.log(arr);
        let str = arr[0];
        let obj = matchesGameByGameId(str);
        // let h1 = document.createElement('h1');
        // h1.innerHTML = str;
        // document.body.append(h1);
        //console.log(obj.stringify())
        
        if(obj.res == true){
            console.log('Valid format for game ' + str);
            //console.log(getGameByGameId(obj.result) );
            let bool = await getGameByGameId(obj.result);
            if(bool)
                console.log('Game-ID-Valid');
            else
                console.log('Game-ID not a game');
            isDone = true;
            isGame = true;
        }
        else{
            console.log('Invalid format for game')
        }
    }

    if(isDone == false){
        let obj = matchesUserByUserName(str);
        //console.log(obj.stringify())
        
        if(obj.res == true){
            console.log('Valid format for user ' + obj.result);
            //console.log(getGameByGameId(obj.result) );
            let qRes = await getStatusByUserName(obj.result);    //return object {user found, but not live or user found and live, user not found}
            if(qRes.res){
                if(qRes.isLive)
                    console.log(qRes.isLive  + ' Player is live');
                else
                    console.log(qRes.isLive  + ' Player is not live');
            }
            else
                console.log(qRes.isLive + ' Player is live');
            isDone = true;
            isUser = true;
        }
        else{
            console.log('Invalid format for user')
        }
    }
    if(isDone == false){
        let obj = matchesStreamByGameIdAndLang(str);
        //console.log(obj.stringify())
        
        if(obj.res == true){
            console.log('Valid format for lang ' + obj.result);
            //console.log(getGameByGameId(obj.result) );
            let qRes = await getStreamByGameIdAndLang(29595,obj.result, 100);   
            if(qRes)
                console.log(qRes  + ' Language and game found');
            else
                console.log(qRes + ' Error with langauge');
            isDone = true;
            isGame = true;
        }
        else{
            console.log('Invalid format for user')
        }
    }
    if(isDone == false){
        let obj = matchesStreamByGameIdAndViewerCount(str);
        //console.log(obj.stringify())
        
        if(obj.res == true){
            console.log('Valid format for lang ' + obj.result);
            //console.log(getGameByGameId(obj.result) );
            let qRes = await getStreamByGameIdAndViewerCount(29595,'en', 100, obj.result);    //return object {user found, but not live or user found and live, user not found}

            console.log(qRes  + ' # streams with more than ' + obj.result +' viewers');
            
            isDone = true;
            isGame = true;
        }
        else{
            console.log('Invalid format for user')
        }
    }
}

//  For game [game-id]
//  https://api.twitch.tv/helix/streams?game_id=29595
//Check if game id is perfect in format i.e. inside '[', ']'
function matchesGameByGameId(gIdWithBraces) {
    if(gIdWithBraces.trim().startsWith ('[') && gIdWithBraces.endsWith(']'))
    {
        let str = gIdWithBraces.trim();
        let res = str.substr(1, str.length-2);
        console.log('|'+res+'|');
        //ccheck whether res shouldn't have non-numeric characters
        let regEx = new RegExp(/^\d+$/);
        const found = res.match(regEx);
        if(found)
            return {res: true, result: res};
        return {res: false, result: null};
    }
    return {res: false,result: null};
}

//Check if a game exists with extracted correct formatted gameid
async function getGameByGameId(gId){
    console.log(gId);
    let feeds,response;
    searchFound = false;
    try{
    response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gId}`,{
        method:'GET',
        headers: {
        'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
        }
    });
    
    feeds = await response.json();
    console.log('Sunygame', feeds);

    if(feeds.data.length > 0)
        return true;
    return false;
    }   
    catch(error){
        console.log(error);
        return false;
    }
}

//  For game [game-id]
//https://api.twitch.tv/helix/users?login=gorgc if user exists take id
//look with that id 
//https://api.twitch.tv/helix/streams?user_id=108268890
//Check if user name is present 'user:gorgc'
function matchesUserByUserName(userNameWithUser) {
    if(gIdWithBraces.trim().startsWith ('{') && gIdWithBraces.endsWith('}'))
    {
        let str = gIdWithBraces.trim();
        let ret = str.substr(1, str.length-2);
        console.log('|'+res+'|');
        if(ret.length >= 1)
            return {res: true, result: ret};
        return {res: false, result: null};
    }
    return {res: false,result: null};

}


//Check if a game exists with extracted correct formatted gameid
async function getStatusByUserName(userName){
    console.log(userName);
    let feedsOne, responseOne, feedsTwo, responseTwo;
    searchFound = false;
    try{
        responseOne = await fetch(`https://api.twitch.tv/helix/users?login=${userName}`,{
            method:'GET',
            headers: {
            'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
            }
        });
        
        feedsOne = await responseOne.json();
        console.log('Sunyuser', feedsOne);
        let player_id = feedsOne.data[0].id;

        if(feedsOne.data.length > 0) {
            responseTwo = await fetch(`https://api.twitch.tv/helix/streams?user_id=${player_id}`,{
            method:'GET',
            headers: {
                'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
                }
            });
            feedsTwo = await responseTwo.json();
            console.log('Sunyuser', feedsTwo);
            if(feedsTwo.data[0].type=='live')
                return {res: true, isLive:true};
            return {res:true, isLive:false};
        }
        else
            return {res:false, result: null};
    }   
    catch(error){
        console.log(error);
        return false;
    }
}

//Search for language

//https://api.twitch.tv/helix/streams?game_id=29595&first=100&language=pt
//For viewer count appli filter on result for viewer_count	>1000
//For live apply filter on result for type="live" or type=""
function matchesStreamByGameIdAndLang(langStr) {
    let str = langStr.trim();
    if(str.toLowerCase().startsWith('lang:')){
        let ret = str.slice(5);
        console.log('Language is' +ret);
        if(ret.length > 0)
            return {res: true, result: ret};
        return {res:false, result: null};
    }
    else{
        return {res:false, result: null};
    }
}

//Check if a game exists with extracted correct formatted gameid
async function getStreamByGameIdAndLang(gId, lang, countResult){
    console.log(gId);
    let feeds,response;
    searchFound = false;
    try{
    response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gId}&first=${countResult}&language=${lang}`,{
        method:'GET',
        headers: {
        'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
        }
    });
    
    feeds = await response.json();
    console.log('Sunylang', feeds);

    if(feeds.data.length > 0)
        return true;
    return false;
    }   
    catch(error){
        console.log(error);
        return false;
    }
}


//https://api.twitch.tv/helix/streams?game_id=29595&first=100&language=pt
//For viewer count appli filter on result for viewer_count	>1000
function matchesStreamByGameIdAndViewerCount(viewerStr) {        //GameID could be optional here
    let str = viewerStr.trim();
    if(str.toLowerCase().startsWith('viewer:')||str.startsWith('viewers:')){
        let ind = str.indexOf(':');
        let ret = str.slice(ind+1);
        console.log('Viewer count' +ret);
        if(ret.length > 0)
            return {res: true, result: ret};
        return {res:false, result: null};
    }
    else{
        return {res:false, result: null};
    }
}

//Check if a game exists with extracted correct formatted gameid
async function getStreamByGameIdAndViewerCount(gId, lang, countResult, viewerCount){
    console.log(gId);
    let feeds,response;
    searchFound = false;
    try{
    response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gId}&first=${countResult}&language=${lang}`,{
        method:'GET',
        headers: {
        'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
        }
    });
    
    feeds = await response.json();
    console.log('Sunylang', feeds);
    let cnt = 0;
    feeds.data.forEach(elem =>{
        if(elem.viewer_count > viewerCount) {
            cnt++;
        }
    })
    return cnt;
    }   
    catch(error){
        console.log(error);
        return false;
    }
}
search();
