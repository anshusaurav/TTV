//https://api.twitch.tv/helix/videos?user_id=108268890 for videos



let channelMainElem = document.querySelector('.streams-list-div');
let videosMainElem = document.querySelector('.videos-list-div');
let loaderElem = document.querySelector('.search-fail-div');
let headerElems = document.querySelectorAll('.search-res-headers');
let allHrElems = document.querySelectorAll('hr');
let titleElem = document.querySelector('title');

//gameNameIdMap.set()
//169376085
class SearchMain{
    constructor(str){
        this.user = '';
        this.user_id = '';
        this.game = '';
        this.gameName = '';
        this.flagLang = false;
        this.flagView = false;
        this.lang = '';
        this.view = '';
        this.numResult = 2;
        this.query = '';
        this.valid = false;
        this.errorStr = '';
        this.gFlag = 0;
        this.tagsMap = new Map();
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
        console.log(feeds);
        if(feeds.data.length > 0)
            return {isDone: true,result: feeds.data};
        return {isDone: false,result: feeds.data};
        }   
        catch(error){
            console.log(error);
            if(error.message ==='Failed to fetch')
                return  {isDone: false,result: null,isInternet: 1};
            else
                return {isDone: false,result: null,isInternet: 2};
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
            if(error.message ==='Failed to fetch')
                return  {isDone: false,result: null,isInternet: 1};
            else
                return {isDone: false,result: null,isInternet: 2};
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
            if(error.message ==='Failed to fetch')
                return  {isDone: false,result: null,isInternet: 1};
            else
                return {isDone: false,result: null,isInternet: 2};
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
            if(error.message ==='Failed to fetch')
                return  {isDone: false,result: null,isInternet: 1};
            else
                return {isDone: false,result: null,isInternet: 2};
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
            
            console.log(feedsOne);  
            let player_id;
            if(!feedsOne.data){
               return {isDone:false, result:null, isLive: false, isInternet: 2};
            }
            else{
                player_id = feedsOne.data[0].id;
                this.user_id = player_id;
            }
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
            if(error.message ==='Failed to fetch')
                return  {isDone: false,result: null,isInternet: 1};
            else
                return {isDone: false,result: null,isInternet: 2};
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
            return {isDone: true,result: feeds.data[0], isInternet: 2};;
        }
        return {isDone: false,result: null, isInternet: 2};
        }
        catch(error){
            console.log(error);
            if(error.message ==='Failed to fetch')
                return  {isDone: false,result: null,isInternet: 1};
            else
                return {isDone: false,result: null,isInternet: 2};
        }
    }
    async getVideosByUser(){
        let feeds,response;
        try{
        response = await fetch(`https://api.twitch.tv/helix/videos?user_id=${this.user_id}`,{
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
            if(error.message ==='Failed to fetch')
            return  {isDone: false,result: null,isInternet: 1};
        else
            return {isDone: false,result: null,isInternet: 2};
        }
    }
    async getVideosByGame(){
        let feeds,response;
        try{
        response = await fetch(`https://api.twitch.tv/helix/videos?game_id=${this.game}`,{
            method:'GET',
            headers: {
            'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
            }
        });
        
        feeds = await response.json();
        // console.log('Sunygame', feeds);
        console.log(feeds);
        if(feeds.data.length > 0)
            return {isDone: true,result: feeds.data};
        return {isDone: false,result: feeds.data};
        }   
        catch(error){
            console.log(error);
            if(error.message ==='Failed to fetch')
            return  {isDone: false,result: null,isInternet: 1};
        else
            return {isDone: false,result: null,isInternet: 2};
        }
    }
    async getTagByGame(tag_id){
        //https://api.twitch.tv/helix/tags/streams?tag_id=0569b171-2a2b-476e-a596-5bdfb45a1327
        if(this.tagsMap.has(tag_id))
            return; 
        let feeds,response;
        try{
        response = await fetch(`https://api.twitch.tv/helix/tags/streams?tag_id=${tag_id}`,{
            method:'GET',
            headers: {
            'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
            }
        });
        
        feeds = await response.json();
        if(feeds.data)
            this.tagsMap.set(tag_id, feeds.data[0].localization_names["en-us"]);
        }   
        catch(error){
            console.log(error);
           
        }
    }
}





// getGameName(29595)


headerElems.forEach(elem =>elem.style.display = 'none');
allHrElems.forEach(elem =>elem.style.display = 'none');
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
        if(res.isDone){
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
            let allImg = document.querySelectorAll('.streamer-img-div');
            allImg.forEach(elem =>{
                let imgElem = elem.querySelector('.streamer-img');
                if(imgElem.classList.contains('online-img')){
                    let elemLive = document.createElement('p');
                    elemLive.classList.add('live-elem')
                    elemLive.innerHTML = 'LIVE';
                    elem.prepend(elemLive);
                    elem.addEventListener('mouseover', (event)=>{
                        elem.style.transform = 'translate3d(0.25rem, -0.25rem, 0)';
                        let color = Math.floor(Math.random()*16777215).toString(16);
                        elem.style.boxShadow = `-6px 6px 2px 0px #${color}`;
                    });
                    elem.addEventListener('mouseleave', (event)=>{
                        elem.style.transform = 'translate3d(-0.25rem, 0.25rem, 0)';
                        elem.style.boxShadow = '';
                    });
                }
                else{
                    elem.style.background='rgb(5, 5, 5)';
                }
            });
            headerElems.forEach(elem =>elem.style.display = 'block');
            allHrElems.forEach(elem =>elem.style.display = 'block');
            // headerElem.style.display = 'block';

            let resVid = await searchEx1.getVideosByUser();
            let arrVid = resVid.result;
            let vidStr = '';
            console.log(arrVid)
            arrVid.forEach(elem => {
                vidStr += `<div class='streams-list-elem'>
                <div class='streams-elem-grid'>
                    <div class='streamer-img-div'>
                        <img src =${getImageThumb2(elem.thumbnail_url)} class='online-img streamer-img'>
    
                    </div>
                    <div class='streamer-details-div'>
                        <a href=${elem.url}><h3 class='streamer-name'>${elem.user_name}</h3></a>
                        <h4 class='stream-game-name'>${elem.duration}</h4>
                        <h4 class='stream-view-count'>${getCounts(elem.view_count)} views</h4>
                        <h4 class='stream-title-name'>${elem.title}</h4>
                        <h5 class='Language'>${elem.language}</h5>
                    </div>
                </div>
            </div>`;
           
            });
           
// //https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/d62baf5b9966672aa9a8_gorgc_1278993105_79997912/thumb/thumb0.jpg
            videosMainElem.innerHTML = vidStr;
            // console.log(arrVid);
            return true;
        }
        else{
            console.log(searchEx1.user +' '+ searchEx1.game + ' ' +searchEx1.errorStr);
            // if()
            console.log(res.isInternet);
            if(res.isInternet === 1)  {
                headerElems[0].innerHTML = "No Internet";
                // allHrElems[0].style.display = 'block';
            }
            else if(res.isInternet === 2) {
                headerElems[0].innerHTML = "No matches found"
                // allHrElems[0].style.display = 'block';
            }
            headerElems[0].style.display = 'block';
            allHrElems[0].style.display = 'block';
            loaderElem.style.visibility = 'hidden';
            flag = true
            return false;
        }
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
                str += `
            <div class='streams-list-elem'>
                <div class='streams-elem-grid'>
                    <div class='streamer-img-div'>
                        <img src =${getImageThumb(elem.thumbnail_url)} class='online-img streamer-img'>

                    </div>
                    <div class='streamer-details-div'>
                        <a href='https://www.twitch.tv/${elem.user_name}'><h3 class='streamer-name'>${elem.user_name}</h3></a>
                        <h4 class='stream-game-name'>${searchEx1.gameName}</h4>
                        <h4 class='stream-view-count'>${getCounts(elem.viewer_count)} viewers</h4>
                        <h4 class='stream-title-name'>${elem.title}</h4>
                        <h5 class='Language'>${elem.language}</h5>`;
                    
            // if(elem.tag_ids){
            //     str += `<div class="tags-container">`;
            //     elem.tag_ids.forEach(async(e) =>{
            //         let temp = await searchEx1.getTagByGame(e);
            //         // console.log('T',temp, e);
            //         console.log(searchEx1.tagsMap.get(e));
            //         while(true)
            //         {
            //             if(searchEx1.tagsMap.has(e))
            //             break;
            //             console.log('here');
            //         }
            //         str +=`<p class="tags-elem">${searchEx1.tagsMap.get(e)} </p>`;
            //     })
            //     str += '</div>';
            // }
            str +=`</div>
                </div>
            </div>`;
            });
            
            channelMainElem.innerHTML = str;

            //let allStreams = document
            let allImg = document.querySelectorAll('.streamer-img-div');
            allImg.forEach(elem =>{
                let imgElem = elem.querySelector('.streamer-img');
                if(imgElem.classList.contains('online-img')){
                    let elemLive = document.createElement('p');
                    elemLive.classList.add('live-elem')
                    elemLive.innerHTML = 'LIVE';
                    elem.prepend(elemLive);
                    elem.addEventListener('mouseover', (event)=>{
                        elem.style.transform = 'translate3d(0.25rem, -0.25rem, 0)';
                        let color = Math.floor(Math.random()*16777215).toString(16);
                        elem.style.boxShadow = `-6px 6px 2px 0px #${color}`;
                    });
                    elem.addEventListener('mouseleave', (event)=>{
                        elem.style.transform = 'translate3d(-0.25rem, 0.25rem, 0)';
                        elem.style.boxShadow = '';
                    });
                    
                    
                }
                
            });
            headerElems.forEach(elem =>elem.style.display = 'block');
            allHrElems.forEach(elem =>elem.style.display = 'block');
            // headerElem.style.display = 'block';

            let resVid = await searchEx1.getVideosByGame();
            let arrVid = resVid.result;
            let vidStr = '';
            console.log(arrVid)
            arrVid.forEach(elem => {
                vidStr += `<div class='streams-list-elem'>
                <div class='streams-elem-grid'>
                    <div class='streamer-img-div'>
                        <img src=${getImageThumb2(elem.thumbnail_url)} class='online-img streamer-img'>
    
                    </div>
                    <div class='streamer-details-div'>
                        <a href=${elem.url}><h3 class='streamer-name'>${elem.user_name}</h3></a>
                        <h4 class='stream-game-name'>${elem.duration}</h4>
                        <h4 class='stream-view-count'>${getCounts(elem.view_count)} views</h4>
                        <h4 class='stream-title-name'>${elem.title}</h4>
                        <h5 class='Language'>${elem.language}</h5>
                    </div>
                </div>
            </div>`;
            });

// //https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/d62baf5b9966672aa9a8_gorgc_1278993105_79997912/thumb/thumb0.jpg
            videosMainElem.innerHTML = vidStr;
            console.log(arrVid);
            return true;
        }
        else{
            console.log(searchEx1.user +' '+ searchEx1.game + ' ' +searchEx1.errorStr);
            console.log(res.isInternet);
            if(res.isInternet === 1)    
                headerElem[0].innerHTML = "No Internet";
            else if(res.isInternet === 2)    
                headerElem[0].innerHTML = "No matches found"
            headerElem[0].style.display = 'block';
            loaderElem.style.visibility = 'hidden';
            flag = true
            return false;
        }
        return true;

    }
    else {
        console.log(searchEx1.user +' '+ searchEx1.game + ' ' +searchEx1.errorStr);
        headerElem[0].innerHTML = searchEx1.errorStr;
        headerElem[0].style.display = 'block';
        loaderElem.style.visibility = 'hidden';
        flag = true
        return false;
    }
    
}
function getDuration(str){
    let indOne = str.indexOf('h');
    let indTwo = str.indexOf('m');
    let indThree = str.indexOf('s');
    let h = 0;
    h= +str.substr(0, indOne);
    let m = 0;
    m = +str.substr(indOne+1, indTwo);
    let s = 0;
    s = +str.substr(indTwo+1);
    let res = '';

        res += h;
        res +='h';

        res += m;
        res +='m';


        res += s;
        res +='s';

    return res;
}
function getImageThumb(str){
    let ind = str.indexOf('-{width}x{height}');
    let res1 = str.replace('{width}', '412');
    let res = res1.replace('{height}', '236');
    // let res = str.substr(0, ind) + str.substr(ind+17);
    // console.log(res);
    return res;
}
function getImageThumb2(str){
    let ind = str.indexOf('-%{width}x%{height}');
    let res1 = str.replace('%{width}', '412');
    let res = res1.replace('%{height}', '236');
    // let res = str.substr(0, ind) + str.substr(ind+17);
    // console.log(res);
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
function loadComplete(){
    
}
loadChannels();


//Add tags https://api.twitch.tv/helix/tags/streams?tag_id=0569b171-2a2b-476e-a596-5bdfb45a1327

// {
//     "data": [
//         {
//             "tag_id": "0569b171-2a2b-476e-a596-5bdfb45a1327",
//             "is_auto": true,
//             "localization_names": {
//                 "bg-bg": "руски",
//                 "cs-cz": "Ruština",
//                 "da-dk": "Russisk",
//                 "de-de": "Russisch",
//                 "el-gr": "Ρωσικά",
//                 "en-us": "Russian",
//                 "es-es": "Ruso",
//                 "es-mx": "Ruso",
//                 "fi-fi": "venäjä",
//                 "fr-fr": "Russe",
//                 "hu-hu": "Orosz",
//                 "it-it": "Russo",
//                 "ja-jp": "ロシア語",
//                 "ko-kr": "러시아어",
//                 "nl-nl": "Russisch",
//                 "no-no": "Russisk",
//                 "pl-pl": "rosyjski",
//                 "pt-br": "Russo",
//                 "pt-pt": "Russo",
//                 "ro-ro": "Rusă",
//                 "ru-ru": "Русский",
//                 "sk-sk": "Ruština",
//                 "sv-se": "Ryska",
//                 "th-th": "รัสเซีย",
//                 "tr-tr": "Rusça",
//                 "vi-vn": "Tiếng Nga",
//                 "zh-cn": "俄文",
//                 "zh-tw": "俄文"
//             },
//             "localization_descriptions": {
//                 "bg-bg": "За потоци с използване на руски",
//                 "cs-cz": "Pro vysílání obsahující ruštinu.",
//                 "da-dk": "Til streams, hvori der indgår russisk",
//                 "de-de": "Für Streams auf Russisch.",
//                 "el-gr": "Για μεταδόσεις που περιλαμβάνουν τη χρήση Ρωσικών",
//                 "en-us": "For streams featuring the use of Russian",
//                 "es-es": "Para transmisiones en ruso.",
//                 "es-mx": "Para streams que incluyen el uso del ruso.",
//                 "fi-fi": "Lähetyksille, joissa puhutaan venäjää.",
//                 "fr-fr": "Pour les streams dont tout ou une partie est en russe",
//                 "hu-hu": "Orosz nyelvű közvetítések",
//                 "it-it": "Per gli streaming in lingua russa",
//                 "ja-jp": "ロシア語を使用する配信に使われます",
//                 "ko-kr": "러시아어를 사용하는 방송",
//                 "nl-nl": "Voor streams waarin Russisch wordt gesproken",
//                 "no-no": "For kringkastinger som er på russisk",
//                 "pl-pl": "Dla streamów, podczas których używany jest język rosyjski",
//                 "pt-br": "Para transmissões que utilizam o idioma russo.",
//                 "pt-pt": "Para transmissões em russo.",
//                 "ro-ro": "Pentru redări în flux care presupun folosirea limbii ruse",
//                 "ru-ru": "Трансляции на русском языке",
//                 "sk-sk": "Pre streamy, ktoré obsahujú ruštinu",
//                 "sv-se": "För streamar som innehåller användning av ryska",
//                 "th-th": "สำหรับสตรีมที่มีการใช้ภาษารัสเซีย",
//                 "tr-tr": "Rusça konuşulan yayınlar için",
//                 "vi-vn": "Dành cho chương trình truyền trực tiếp có nội dung sử dụng tiếng Nga",
//                 "zh-cn": "直播内容使用俄文",
//                 "zh-tw": "使用俄文的實況"
//             }
//         }
//     ],
//     "pagination": {}
// }