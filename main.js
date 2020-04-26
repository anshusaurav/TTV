
let objArr = [];
let gameArr = [];
let sliderIndex;
let preIn;
let postIn;
let preInPre;
let postInPost;
var embedOne, embedTwo, embedThree;
async function showTopic() {
    let feeds,response;
    response = await fetch(`https://api.twitch.tv/helix/streams`,{
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
    postInPost = 2;
    preInPre = objArr.length-2;
    console.log()
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
    postInPost = 2;
    preInPre = objArr.length-2;
    loadNewSliders(sliderIndex);
    
   
}
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

let searchHelperElem = document.querySelector('.search-help-container');
let searchHelpArrow = document.querySelector('.search-help-arrow');
let searchInputElem = document.querySelector('.search-div');
let inputSElem = document.querySelector('.input-search');
inputSElem.addEventListener('keyup', proceedWithSearch)
let searchFound = true;
async function proceedWithSearch(event){
    if(event.keyCode == 13) {
        let str = this.value;
        console.log(str);
        sessionStorage.setItem('searchedKey', str);  
        window.open(
            'search.html',
            '_blank' // <- This is what makes it open in a new window.
          );
          
    }
}



rightElem.addEventListener('click', next);
leftElem.addEventListener('click', previous);

logoImgElem.addEventListener('mouseenter', replaceSrctoGif);
logoImgElem.addEventListener('mouseleave', replaceSrctoPng);
function replaceSrctoGif(event){
    this.src = 'assets/media/logo.gif'
}
function replaceSrctoPng(event){
    this.src = 'assets/media/favicon-32x32.png'
    
}
document.addEventListener('click', function(event){
    var isClickInside = searchInputElem.contains(event.target);
    if (isClickInside) {
        searchHelperElem.style.display='block';
        searchHelpArrow.style.display='block';
    } else {
        searchHelperElem.style.display='none';
        searchHelpArrow.style.display='none';
    }
});
let categoryElemList = document.querySelectorAll('.section-header');
let categorySupportList = document.querySelectorAll('.support-header');
let categoryCompList = document.querySelectorAll('.section-tab');

console.log(categoryElemList);
console.log(categorySupportList);
console.log(categoryCompList);
// gameNavElem.style.display = 'none';
function placeSupport(){
    categorySupportList.forEach((elem, index) =>{
        elem.style.position = 'absolute';
        elem.style.left = (categoryElemList[index].offsetLeft) + 'px';
        elem.style.width = (categoryElemList[index].offsetWidth ) + 'px';
        if(index == 0){
            elem.style.visibility ='visible';
        }
    });
}
function placeSupportLater(){
    categorySupportList.forEach((elem, index) =>{
        elem.style.position = 'absolute';
        elem.style.left = (categoryElemList[index].offsetLeft) + 'px';
        elem.style.width = (categoryElemList[index].offsetWidth ) + 'px';
        
    });
}
placeSupport();
window.onresize = placeSupportLater;
headerElem.addEventListener('click', toggleDP);

function toggleDP(event){
    
    let wholeElem = event.target.closest('.section-tab');
    if(wholeElem){
        
        categoryCompList.forEach(elem =>{
            let innElem = elem.querySelector('.support-header');
            if(Array.from(innElem.classList).indexOf('make-bg-dp')!=-1){
                innElem.classList.toggle('make-bg-dp');
                innElem.style.visibility ='hidden';
            }
        });

        let supportElem = wholeElem.querySelector('.support-header');
        supportElem.classList.toggle('make-bg-dp');
        supportElem.style.visibility ='visible';
        categoryElemList.forEach(elem =>{
            if(Array.from(elem.classList).indexOf('make-fg-dp')!=-1)
                elem.classList.toggle('make-fg-dp');
        });

        let mainElem = wholeElem.querySelector('.section-header');
        mainElem.classList.toggle('make-fg-dp');
    }
}
// let firstHeaderSupportElem = document.querySelector('.support-header');
// firstHeaderSupportElem.style.visibility = 'visible';
trendingButton.addEventListener('click', showTrending);
categoriesButton.addEventListener('click', showCategories);
function showTrending(event){
    gameNavElem.style.display = 'none';
    resultBigElem.style.borderTop = '2px solid aliceblue';
    showTopic();
}
function showCategories(event){
    gameNavElem.style.display = 'grid';
    resultBigElem.style.borderTop = 'none';
}
function next(event) {

    console.log('dsdas');
    preInPre = preIn;
    preIn = sliderIndex;
    sliderIndex++;
    if(sliderIndex == objArr.length)
    sliderIndex = 0;

    console.log(sliderIndex);
    postInPost = postIn;
    postIn = sliderIndex + 1;
    if(postIn == objArr.length)
        postIn = 0;
    
    loadNewSliders(sliderIndex);
}
function previous(event) {
    console.log('dsdas');
    
    postIn = sliderIndex;
    if(sliderIndex == 0)
        sliderIndex = objArr.length-1;
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
    videoElem.style.background = '#300A66';
    embedTwo = new Twitch.Embed("twitch-embed2", {
        width: 880,
        height: 420,
        layout: "video",
        channel: objArr[sliderIndex].user_name
    });
    // videoElem.style.background = 'black';
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
