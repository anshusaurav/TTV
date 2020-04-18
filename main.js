
let objArr = [];
let gameArr = [];
let sliderIndex;
let preIn;
let postIn ;
let games = [{'name':'Volrant', 'game_id': '516575'},
            {'name':'Pubg', 'game_id': '493057'},
            {'name':'GTA', 'game_id': '32982'},
            {'name':'Fortnite', 'game_id': '33214'},
            {'name':'Fifa', 'game_id': '512804'},
            {'name':'Dota', 'game_id': '29595'}]
var embedOne, embedTwo, embedThree;
async function showTopic() {
    let feeds,response;
    // response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}`,{
    //     method:'GET',
    //     headers: {
    //     'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
    //     }
    // });
    response = await fetch(`https://api.twitch.tv/helix/streams/`,{
        method:'GET',
        headers: {
        'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
        }
    });
    feeds = await response.json();
    console.log('search');
    //console.log(feeds);
    objArr.push(...feeds.data);
    console.log(objArr);
    sliderIndex = 0;
    preIn = objArr.length-1;
    postIn = 1;
    loadNewSliders(sliderIndex)
   
}
showTopic();
async function showGame(gameId) {
    let feeds,response;
    response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}`,{
        method:'GET',
        headers: {
        'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
        }
    });
    
    feeds = await response.json();
    console.log('game');
    objArr = [];

    objArr.push(...feeds.data);
    console.log(objArr);
    sliderIndex = 0;
    preIn = objArr.length-1;
    postIn = 1;
    loadNewSliders(sliderIndex);
    
   
}
async function showTopGames(){
    let feeds,response;
    response = await fetch(`https://api.twitch.tv/helix/games/top`,{
        method:'GET',
        headers: {
        'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
        }
    });
    
    feeds = await response.json();
    console.log('top');
    objArr.push(...feeds.data);
    console.log(objArr);
    
    
}
showTopGames();
//512804 fifa
//29595 dota
//"516575"volarant
// 33214 fortnite
//493057  pubg PC
//"32982" GTA
//"512710" COD

//showGame('512804');
//console.log(objArr);  


let logoImgElem = document.querySelector('.logo-img');
let mainContElem = document.querySelector('.full-container');
let contElem = document.querySelector('.container');
let rightElem = document.querySelector('.right-arrow');
let leftElem = document.querySelector('.left-arrow');
let introElem = document.querySelector('.intro-content');
let descElem = document.querySelector('.desc-content');
let videoElem = document.querySelector('.video-bg');
let prevVidElem = document.querySelector('.video-prev');
let nextVidElem = document.querySelector('.video-next');
let prevVidDiv = document.querySelector('.prev-video');
let nextVidDiv = document.querySelector('.next-video');
let pVidMainElem = document.querySelector('.prev-inside');
let nVidMainElem = document.querySelector('.next-inside');
let ggGridElem = document.querySelector('.wrapper');
let pElem = document.querySelector('.prev-thumb');
let nElem = document.querySelector('.next-thumb');
let headerElem = document.querySelector('.header');
let resultBigElem = document.querySelector('.result-container');
let trendingButton = document.querySelector('.trending-tab');
let categoriesButton = document.querySelector('.categores-tab');

let gameNavElem = document.querySelector('.wrapper');
rightElem.addEventListener('click', next);
leftElem.addEventListener('click', previous);

console.log('LOGOOOOOO' + logoImgElem)
logoImgElem.addEventListener('mouseenter', replaceSrctoGif);
logoImgElem.addEventListener('mouseleave', replaceSrctoPng);
function replaceSrctoGif(event){
    this.src = 'assets/media/logo.gif'
}
function replaceSrctoPng(event){
    this.src = 'assets/media/logo-24.png'
    
}


let categoryElemList = document.querySelectorAll('.section-header');
let categorySupportList = document.querySelectorAll('.support-header');
let categoryCompList = document.querySelectorAll('.section-tab');

console.log(categoryElemList);
console.log(categorySupportList);
gameNavElem.style.display = 'none';
function placeSupport(){
    categorySupportList.forEach((elem, index) =>{
        elem.style.position = 'absolute';
        elem.style.left = (categoryElemList[index].offsetLeft) + 'px';
        elem.style.width = (categoryElemList[index].offsetWidth*1.02 ) + 'px';
        
    });
}
placeSupport();
window.onresize = placeSupport;
headerElem.addEventListener('click', toggleDP);

function toggleDP(event){
    
    let wholeElem = event.target.closest('.section-tab');
    if(wholeElem){
        
        categoryCompList.forEach(elem =>{
            let innElem = elem.querySelector('.support-header');
            if(Array.from(innElem.classList).indexOf('make-bg-dp')!=-1)
                innElem.classList.toggle('make-bg-dp');
            //innElem.classList.toggle('make-bg-dp');
        });

        let supportElem = wholeElem.querySelector('.support-header');
        supportElem.classList.toggle('make-bg-dp');

        categoryElemList.forEach(elem =>{
            if(Array.from(elem.classList).indexOf('make-fg-dp')!=-1)
                elem.classList.toggle('make-fg-dp');
        });

        let mainElem = wholeElem.querySelector('.section-header');
        mainElem.classList.toggle('make-fg-dp');
        // supportElem.style.background = 'rgb(216, 190, 255)';
    }
}
trendingButton.addEventListener('click', showTrending);
categoriesButton.addEventListener('click', showCategories);
function showTrending(event){
    gameNavElem.style.display = 'none';
    resultBigElem.style.borderTop = '2px solid aliceblue';
}
function showCategories(event){
    gameNavElem.style.display = 'grid';
    resultBigElem.style.borderTop = 'none';
}
function next(event) {
//event.preventDefault();

    console.log('dsdas');
    preIn = sliderIndex;
    sliderIndex++;
    if(sliderIndex == objArr.length)
    sliderIndex = 0;

    console.log(sliderIndex);

    postIn = sliderIndex + 1;
    if(postIn == objArr.length)
    postIn = 0;
    try{

    }
    catch(error){
        console.log(error);
    }
    loadNewSliders(sliderIndex);
}
function previous(event) {
    //event.preventDefault();
    console.log('dsdas');
    postIn = sliderIndex;
    if(sliderIndex == 0)
    sliderIndex =objArr.length-1;
    else
    sliderIndex--;
    console.log(sliderIndex);
    preIn = sliderIndex - 1;
    if(preIn == -1)
    preIn = objArr.length-1;
    loadNewSliders(sliderIndex);

}
function loadNewSliders(sliderIndex) {
    embedOne = null;
    embedTwo = null;
    embedThree = null; 
    while(videoElem.firstChild){
        videoElem.removeChild(videoElem.firstChild);
    }
    videoElem.style.background = 'url("assets/media/giphy.gif") center center no-repeat;';
    console.log(preIn, postIn);
    embedTwo = new Twitch.Embed("twitch-embed2", {
        width: 880,
        height: 420,
        layout: "video-with-chat",
        channel: objArr[sliderIndex].user_name
    });
    pElem.src = 'assets/media/giphy.gif';
    nElem.src = 'assets/media/giphy.gif';
    let imgP = new Image();
    imgP.onload = function(){
        pElem.src = this.src;
    };
    imgP.src = getImageThumb(objArr[preIn].thumbnail_url);

    
    
    let imgN = new Image();
    imgN.onload = function(){
        nElem.src = this.src;
    };
    imgN.src = getImageThumb(objArr[postIn].thumbnail_url);
    
}
function imgReplaceGif(){
    let pElem = document.querySelector('.prev-thumb');
    console.log(pElem.clientHeight, pElem.clientWidth);
    pElem = document.querySelector('.next-thumb');
    console.log(pElem.clientHeight, pElem.clientWidth);

}
function getImageThumb(str){
    let ind = str.indexOf('-{width}x{height}');
    let res = str.substr(0, ind) + str.substr(ind+17);
    console.log(res);
    return res;
}

ggGridElem.addEventListener('click', switchGames);
function switchGames(event){
    let gameDivElem = event.target.closest('.game-div');
    if(gameDivElem){
        let x = gameDivElem.dataset.gameid;
        showGame(x) 
    }
}
function move(elem) {
    var left = 0
    function frame() {
        left++  // update parameters
        elem.style.left = left + 'px' // show frame
        if (left == 100)  // check finish condition
            clearInterval(id)
    }
    var id = setInterval(frame, 10) // draw every 10ms
}
setTimeout(imgReplaceGif, 20000);