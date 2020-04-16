
// let videoArr = [
//     {id: 1, username: 'Cartoon Penguin', userimg: 'assets/media/image-1.png', videourl: 'assets/media/clip-1.mp4', gamename: 'FireFly', parlorname: 'KopanVR', descone:'Had a blast yesterday at KopanVR and scores 87', desctwo: 'Can you beat it? hahaha Follow for more...'},
//     {id: 2, username: 'Little Penguin', userimg: 'assets/media/image-2.png', videourl: 'assets/media/clip-2.mp4', gamename: 'Pavlov', parlorname: 'VivianVR', descone:'Had so much fun at the arcade', desctwo: 'Checkout game on steam. '},
//     {id: 3, username: 'Yellow-Eyed Penguin', userimg: 'assets/media/image-3.png', videourl: 'assets/media/clip-3.mp4', gamename: 'Shadow-Legend', parlorname: 'Arena-Space', descone:'Had so much fun playing Shadow Legend', desctwo: 'Checkout game on steam. '},
//     {id: 4, username: 'Snares Penguin', userimg: 'assets/media/image-4.png', videourl: 'assets/media/clip-4.mp4', gamename: 'Boneworks', parlorname: 'MK2 VR', descone:'Had so much fun playing Shadow Legend at MK2 VR', desctwo: 'Checkout game on steam. '},
//     {id: 5, username: 'Emperor Penguin', userimg: 'assets/media/image-5.png', videourl: 'assets/media/clip-5.mp4', gamename: 'Counter-Fight', parlorname: 'VivianVR', descone:'Had so much fun playing at VivianVR', desctwo: 'Checkout game on steam. '}
//     ];
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
    // resultPosts.forEach(elem=>createLiElem(elem));
   
}
showTopic();

// https://codepen.io/butlerx/details/xgGaWr
// initial bug if smaller width
// size fix for max-width media query calculate and assign proper size

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
// let mql = window.matchMedia('(max-width: 728px)');
// //console.dir(window.innerWidth);
// if(window.innerWidth < 728){
//     prevVidDiv.style.display = 'none';
//     nextVidDiv.style.display = 'none';
//     mainContElem.style.display = 'flex'
//     mainContElem.style.alignItems ='center';
//     mainContElem.style.justifyContent ='center';
//     mainContElem.style.maxWidth = '400px';
//     mainContElem.style.minWidth = '360px';
//     pVidMainElem.style.visibility = 'visible';
//     nVidMainElem.style.visibility = 'visible';
//     //console.log('Yes');
// }
rightElem.addEventListener('click', next);
leftElem.addEventListener('click', previous);
// nVidMainElem.addEventListener('click', next)
// pVidMainElem.addEventListener('click', previous);
// mql.addListener(handleWidthChange);
// function handleWidthChange(event) {
//     console.dir(window);
//     if(event.matches){
//         prevVidDiv.style.display = 'none';
//         nextVidDiv.style.display = 'none';
//         mainContElem.style.display = 'flex'
//         mainContElem.style.alignItems ='center';
//         mainContElem.style.justifyContent ='center';
//         mainContElem.style.maxWidth = '400px';
//         mainContElem.style.minWidth = '360px';
//         pVidMainElem.style.visibility = 'visible';
//         nVidMainElem.style.visibility = 'visible';
//         console.log('Yes');

//     }
//     else
//     {
//         prevVidDiv.style.display = 'flex';
//         nextVidDiv.style.display = 'flex';
//         contElem.style.margin= '0 auto';
//         mainContElem.style.display = 'grid';
//         mainContElem.style.maxWidth = '800px';
//         mainContElem.style.minWidth = '800px';
//         mainContElem.style.justifyContent ='space-between';
//         pVidMainElem.style.visibility = 'hidden';
//         nVidMainElem.style.visibility = 'hidden';
//         console.log('No');

//     }
// }
// videoElem.addEventListener('ended',next);
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
    //<user ID>
    // let response = await fetch(`https://api.twitch.tv/helix/users/${objArr[preIn].id}`,{
    //     method:'GET',
    //     headers: {
    //     'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'

    //     }
    // });
    // let feeds = await response.json();
    // console.log(feeds);
    // introElem.innerHTML = 
    // `<div class='user-img-div'>
    // <div class='img-circle'>
    
    // </div>
    // </div>
    // <div class='user-info-one'>
    //     <h3 class='user-name'>${objArr[sliderIndex].user_id}</h3>
    //     <input class='follow-btn' type='button' value='follow'>
    // </div>
    // <div class='user-info-two'>
    //     <p class='game-info'> 
    //         Playing
    //         <span class='game-span'>
    //             <a class='game-link'>${objArr[sliderIndex].language}</a>
    //         </span> 
    //         at 
    //         <span class='game-span'>${objArr[sliderIndex].viewer_count} 
    //         </span>
    //         viewers
    //     </p>
    // </div>`
    // descElem.innerHTML = 
    // `<p>${objArr[preIn].title}</p>`;
    //videoElem.setAttribute('src', videoArr[sliderIndex].videourl);

    console.log(preIn, postIn);
    //prevVidElem.setAttribute('src', videoArr[preIn].videourl );
    //nextVidElem.setAttribute('src', videoArr[postIn].videourl );
    prevVidElem.innerHTML = `<img src=${getImageThumb(objArr[preIn].thumbnail_url)} class='prev-thumb'>`;
    nextVidElem.innerHTML = `<img src=${getImageThumb(objArr[postIn].thumbnail_url)} class='next-thumb'>`;
    // embedOne = new Twitch.Embed("twitch-embed1", {
    //     width: 162,
    //     height: 90,
    //     layout: "video",
    //     autoplay: false,
    //     channel: objArr[preIn].user_name
    // });
    embedTwo = new Twitch.Embed("twitch-embed2", {
        width: 720,
        height: 400,
        layout: "video",
        channel: objArr[sliderIndex].user_name
    });
    // embedThree = new Twitch.Embed("twitch-embed3", {
    //     width:162,
    //     height: 90,
    //     layout: "video",
    //     autoplay: false,
    //     channel: objArr[postIn].user_name
    // });
}
function getImageThumb(str){
    let ind = str.indexOf('-{width}x{height}');
    let res = str.substr(0, ind) + str.substr(ind+17);
    console.log(res);
    return res;
}

