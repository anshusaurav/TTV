//https://api.twitch.tv/helix/videos?user_id=108268890 for videos



let channelMainElem = document.querySelector('.streams-list-div');
let loaderElem = document.querySelector('.search-fail-div');
let headerElem = document.querySelector('h2');
let titleElem = document.querySelector('title');

//gameNameIdMap.set()

class SearchMain{
    constructor(str){
        this.user = '';
        this.game = '';
        this.gameName = '';
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
    set ErrorStr(str){
        this.errorStr = str;
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
    async getGameByGameId(){
        let feeds,response;
        try{
        response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${this.game}&first=${this.numResult}`,{
            method:'GET',
            headers: {
            'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
            }
        });
        
        feeds = await response.json();
        // console.log('Sunygame', feeds);
    
        if(feeds.data.length > 0)
            return {isDone: true,result: feeds.data};
        return {isDone: false,result: feeds.data};
        }   
        catch(error){
            console.log(error);
            return {isDone: false,result: null};
        }
    }
    async getGameByGameIdAndView(){
        let feeds,response;
        
        try{
            response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${this.game}&first=${this.numResult}`,{
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
    async getGameByGameIdAndLang(){
        let feeds,response;
        
        try{
            response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${this.game}&first=${this.numResult}&language=${this.lang}`,{
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
    async getGameByGameIdAndLangAndViewer(){
        let feeds,response;
        
        try{
            response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${this.game}&first=${this.numResult}&language=${this.lang}`,{
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
    async getUserByName(){
        // console.log(userName);
        let feedsOne, responseOne, feedsTwo, responseTwo;
        try{
            responseOne = await fetch(`https://api.twitch.tv/helix/users?login=${this.user}`,{
                method:'GET',
                headers: {
                'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
                }
            });
            
            feedsOne = await responseOne.json();
            let player_id;
            if(!feedsOne.data){
               return {isDone:false, result:null, isLive: false};
            }
            else
                player_id = feedsOne.data[0].id;
            // console.log(feedsOne);
            //console.log(player_id);
            // console.log(feedsOne.data.length);
            if(feedsOne.data.length > 0) {
                responseTwo = await fetch(`https://api.twitch.tv/helix/streams?user_id=${player_id}`,{
                method:'GET',
                headers: {
                    'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
                    }
                });
                feedsTwo = await responseTwo.json();
                // console.log(feedsTwo);
                loaderElem.style.visibility = 'hidden';
                if(feedsTwo.data.length > 0)
                    return {isDone: true,result: feedsTwo.data, isLive: true};
                else
                    return {isDone: true,result: feedsOne.data, isLive: false};
            }
            else
                return {isDone: false,result: null};
        }   
        catch(error){
            console.log(error);
            return  {isDone: false,result: null};
        }
    }
    async getGameName(){
        let feeds,response;
        try{
        response = await fetch(`https://api.twitch.tv/helix/games?id=${this.game}`,{
            method:'GET',
            headers: {
            'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
            }
        });
        
        feeds = await response.json();
        if(feeds.data.length){
            this.gameName = feeds.data[0].name;
            loaderElem.style.visibility = 'hidden';
            // console.log(val,"jhhjjhj")
            return ;
        }
        return false;
        }
        catch(error){
            console.log(error);
        }
    }

}





// getGameName(29595)


headerElem.style.display = 'none';
async function loadChannels() {
    let totalStr = sessionStorage.getItem('searchedKey');
    let searchEx1 = new SearchMain(totalStr);
    titleElem.innerHTML = 'Search results for ' + totalStr; 
    let flag = false;
    // console.log(elem);

    if(searchEx1.gFlag == 1){
        let res = await searchEx1.getUserByName();
        // console.log(res);
        console.log(res.result);
        let arr =  res.result;
        let str = '';

        if(res.isLive){
            
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
        }
        else{
            arr.forEach(elem =>{
                str += `<div class='streams-list-elem'>
                <div class='streams-elem-grid'>
                    <div class='streamer-img-div'>
                        <img src =${elem.profile_image_url} class='offline-img streamer-img'>
    
                    </div>
                    <div class='streamer-details-div'>
                        <a href='https://www.twitch.tv/${elem.login}'><h3 class='streamer-name'>${elem.display_name}</h3></a>
                        
                        <h4 class='stream-view-count'>View Count: ${getCounts(elem.view_count)} </h4>
                        
                    </div>
                </div>
            </div>`;
            });
        }
        channelMainElem.innerHTML = str;
        headerElem.style.display = 'block';
        return true;
        // paintLiveChannel();
    }
    else if(searchEx1.gFlag == 2) {
        let res;
        let gameN = await searchEx1.getGameName();
        
        if(searchEx1.flagLang && searchEx1.flagView){
            res = await searchEx1.getGameByGameIdAndLangAndViewer();
            
        }
        else if(searchEx1.flagLang && !searchEx1.flagView){
            res = await searchEx1.getGameByGameIdAndLang();
            
        }
        else if(!searchEx1.flagLang && searchEx1.flagView){
            res = await searchEx1.getGameByGameIdAndView();
        }
        else {
            res = await searchEx1.getGameByGameId();
        }
        let str = '';
        console.log('Done: ' + res.isDone);
        if(res.isDone){
            let arr = res.result;
            
            // console.log('HERE');
            console.log(arr.length);
            if(arr.length == 0) {
                searchEx1.ErrorStr = 'No results found';
            }
            // console.log(gameN.res);
            arr.forEach(elem =>{
                str += `<div class='streams-list-elem'>
                <div class='streams-elem-grid'>
                    <div class='streamer-img-div'>
                        <img src =${getImageThumb(elem.thumbnail_url)} class='online-img streamer-img'>

                    </div>
                    <div class='streamer-details-div'>
                        <a href='https://www.twitch.tv/${elem.user_name}'><h3 class='streamer-name'>${elem.user_name}</h3></a>
                        <h4 class='stream-game-name'>${searchEx1.gameName}</h4>
                        <h4 class='stream-view-count'>${getCounts(elem.viewer_count)} viewers</h4>
                        <h4 class='stream-title-name'>${elem.title}</h4>
                        <h5 class='Language'>${elem.language}</h5>
                    </div>
                </div>
            </div>`;
            });
            channelMainElem.innerHTML = str;
            headerElem.style.display = 'block';
        }
        else{
            console.log(searchEx1.user +' '+ searchEx1.game + ' ' +searchEx1.errorStr);
            headerElem.innerHTML = "No matches found";
            headerElem.style.display = 'block';
            loaderElem.style.visibility = 'hidden';
            flag = true
            return false;
        }
        return true;

    }
    else {
        console.log(searchEx1.user +' '+ searchEx1.game + ' ' +searchEx1.errorStr);
        headerElem.innerHTML = searchEx1.errorStr;
        headerElem.style.display = 'block';
        loaderElem.style.visibility = 'hidden';
        flag = true
        return false;
    }
    if(searchEx1.errorStr && flag){
        console.log(searchEx1.user +' '+ searchEx1.game + ' ' +searchEx1.errorStr);
        headerElem.innerHTML = searchEx1.errorStr;
        headerElem.style.display = 'block';
        loaderElem.style.visibility = 'hidden';
        flag = true
        return false;
    }
}
function getImageThumb(str){
    let ind = str.indexOf('-{width}x{height}');
    let res1 = str.replace('{width}', '412');
    let res = res1.replace('{height}', '230');
    // let res = str.substr(0, ind) + str.substr(ind+17);
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
// async function paintLiveChannel(){
//     let res = await loadChannels();
//     console.log(res);
//     let allImageElem = document.querySelectorAll('online-img');
//     console.log(allImageElem.length);
//     allImageElem.forEach(elem =>{
//         let divElem = elem.closest('.streamer-img-div');
//         console.log(divElem);
//     })
// }

// paintLiveChannel();

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

