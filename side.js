//https://api.twitch.tv/helix/videos?user_id=108268890 for videos
async function search(){
    let isDone = false;
    let isGame = false;
    let isUser = false;
    if(isDone == false){
        
        let str = sessionStorage.getItem('searchedKey');
        let obj = matchesGameByGameId(str);
        let h1 = document.createElement('h1');
        h1.innerHTML = str;
        document.body.append(h1);
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
    
    let str = userNameWithUser.trim();
    if(str.toLowerCase().startsWith('user:')){
        let ret = str.slice(5);
        if(ret.length > 0)
            return {res: true, result: ret};
        return {res:false, result: null};
    }
    else{
        return {res:false, result: null};
    }
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
