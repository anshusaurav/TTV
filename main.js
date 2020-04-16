
let objArr = [];
let sliderIndex;
let preIn;
let postIn ;
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
console.log(objArr);  
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

// }
rightElem.addEventListener('click', next);
leftElem.addEventListener('click', previous);

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
    

    console.log(preIn, postIn);
    prevVidElem.innerHTML = `<img src=${getImageThumb(objArr[preIn].thumbnail_url)} class='prev-thumb'>`;
    nextVidElem.innerHTML = `<img src=${getImageThumb(objArr[postIn].thumbnail_url)} class='next-thumb'>`;

    embedTwo = new Twitch.Embed("twitch-embed2", {
        width: 720,
        height: 400,
        layout: "video",
        channel: objArr[sliderIndex].user_name
    });
    
}
function getImageThumb(str){
    let ind = str.indexOf('-{width}x{height}');
    let res = str.substr(0, ind) + str.substr(ind+17);
    console.log(res);
    return res;
}

