
let objArr = [];
let gameArr = [];
let sliderIndex;
let preIn;
let postIn;
let preInPre;
let postInPost;
var embedOne, embedTwo, embedThree;
var divArr = [];
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
    // init();
   
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
    // init();
    
   
}
let logoImgElem = document.querySelector('.logo-img');
let mainContElem = document.querySelector('.full-container');
let contElem = document.querySelector('.container');

let mainResultCont = document.querySelector('.featured-container');
let nextMoveButton = document.querySelector('.right-arrow');
let prevMoveButton = document.querySelector('.left-arrow');
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

let left2Elem = document.querySelector('.side-thumb-minus2');
let left1Elem = document.querySelector('.side-thumb-minus1');
let right1Elem = document.querySelector('.side-thumb-plus1');
let right2Elem = document.querySelector('.side-thumb-plus2');

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

async function init(){
    await showTopic();
    let indArr = [preInPre, preIn,sliderIndex, postIn, postInPost];
    for(let i =0; i < 5; i++){
        let tempDiv = document.createElement('div');
        let imgElem = document.createElement('img');
        let imgL = new Image();
        imgL.onload = function(){
            imgElem.src = this.src;
        }
        imgL.src = getImageThumb(objArr[indArr[i]].thumbnail_url);
        tempDiv.classList.add('featured-elem'); 
        tempDiv.append(imgElem);
        
        mainResultCont.append(tempDiv);
        divArr.push(tempDiv);
    }
    let videoFeatureElem = document.querySelector('.featured-container >:nth-child(3)');
    videoFeatureElem.removeChild(videoFeatureElem.firstChild);
    videoFeatureElem.innerHTML = `<iframe
    src="https://player.twitch.tv/?channel=${objArr[sliderIndex].user_name}&parent=localhost&muted=true"
    height="420"
    width="880"
    frameborder="0"
    scrolling="no"
    allowfullscreen="true">
    </iframe>`;
    console.log(sliderIndex);

}
async function initGame(x){
    await showGame(x);
    let indArr = [preInPre, preIn,sliderIndex, postIn, postInPost];
    for(let i =0; i < 5; i++){
        let tempDiv = document.createElement('div');
        let imgElem = document.createElement('img');
        let imgL = new Image();
        imgL.onload = function(){
            imgElem.src = this.src;
        }
        imgL.src = getImageThumb(objArr[indArr[i]].thumbnail_url);
        tempDiv.classList.add('featured-elem'); 
        tempDiv.append(imgElem);
        
        mainResultCont.append(tempDiv);
        divArr.push(tempDiv);
    }
    let videoFeatureElem = document.querySelector('.featured-container >:nth-child(3)');
    videoFeatureElem.removeChild(videoFeatureElem.firstChild);
    videoFeatureElem.innerHTML = `<iframe
    src="https://player.twitch.tv/?channel=${objArr[sliderIndex].user_name}&parent=localhost&muted=true"
    height="420"
    width="880"
    frameborder="0"
    scrolling="no"
    allowfullscreen="true">
    </iframe>`;
    console.log(sliderIndex);
}
function moveLeft(event){
    
    postInPost = postIn;
    postIn = sliderIndex;
    sliderIndex--;
    if(sliderIndex == -1)
        sliderIndex = objArr.length-1;
    
    console.log(sliderIndex);
    preIn = sliderIndex - 1;
    if(preIn == -1)
        preIn = objArr.length-1;
    preInPre = preIn-1;
    if(preInPre == -1)
        preInPre = objArr.length-1;

    
    let newDiv = document.createElement('div');
    newDiv.classList.add('featured-elem');

    let imgElem = document.createElement('img');
    let imgL = new Image();
    imgL.onload = function(){
        imgElem.src = this.src;
    }
    imgL.src = getImageThumb(objArr[postInPost].thumbnail_url);
    newDiv.append(imgElem);
    mainResultCont.removeChild(mainResultCont.querySelector('.featured-elem'));
    mainResultCont.append(newDiv);


    let imageFeatureElem = document.querySelector('.featured-container >:nth-child(2)');
    console.dir(imageFeatureElem);
    imageFeatureElem.removeChild(mainResultCont.querySelector('iframe'));
    imgElem = document.createElement('img');
    imgL = new Image();
    imgL.onload = function(){
        imgElem.src = this.src;
    }
    imgL.src = getImageThumb(objArr[preIn].thumbnail_url);
    imageFeatureElem.append(imgElem);

    let videoFeatureElem = document.querySelector('.featured-container >:nth-child(3)');
    videoFeatureElem.removeChild(videoFeatureElem.firstChild);
    videoFeatureElem.innerHTML = `<iframe
    src="https://player.twitch.tv/?channel=${objArr[sliderIndex].user_name}&parent=localhost&muted=true"
    height="420"
    width="880"
    frameborder="0"
    scrolling="no"
    allowfullscreen="true">
    </iframe>`;


}
function moveRight(event){
    preInPre = preIn;
    preIn = sliderIndex;
    sliderIndex++;
    if(sliderIndex == objArr.length)
    sliderIndex = 0;

    console.log(sliderIndex);
    postIn = sliderIndex + 1;
    if(postIn == objArr.length)
        postIn = 0;
    postInPost = postIn+1;
    postInPost%=objArr.length;

    mainResultCont.removeChild(mainResultCont.lastChild);
    let newDiv = document.createElement('div');
    newDiv.classList.add('featured-elem');

    let imgElem = document.createElement('img');
    let imgL = new Image();
    imgL.onload = function(){
        imgElem.src = this.src;
    }
    imgL.src = getImageThumb(objArr[preInPre].thumbnail_url);
    newDiv.append(imgElem);
    mainResultCont.prepend(newDiv);

    let imageFeatureElem = document.querySelector('.featured-container >:nth-child(4)');
    console.dir(imageFeatureElem);
    imageFeatureElem.removeChild(mainResultCont.querySelector('iframe'));
    imgElem = document.createElement('img');
    imgL = new Image();
    imgL.onload = function(){
        imgElem.src = this.src;
    }
    imgL.src = getImageThumb(objArr[postIn].thumbnail_url);
    imageFeatureElem.append(imgElem);

    let videoFeatureElem = document.querySelector('.featured-container >:nth-child(3)');
    videoFeatureElem.removeChild(videoFeatureElem.firstChild);
    videoFeatureElem.innerHTML = `<iframe
    src="https://player.twitch.tv/?channel=${objArr[sliderIndex].user_name}&parent=localhost&muted=true"
    height="420"
    width="880"
    frameborder="0"
    scrolling="no"
    allowfullscreen="true">
    </iframe>`;
}
prevMoveButton.addEventListener('click', moveLeft);
nextMoveButton.addEventListener('click', moveRight);

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
        initGame(x) 
    }
}
init();