
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
    // loadInitialSliders(sliderIndex)
   
}
let mainResultCont = document.querySelector('.featured-container');
let prevMoveButton = document.querySelector('.left-arrow');
let nextMoveButton = document.querySelector('.right-arrow');
prevMoveButton.addEventListener('click', moveLeft);
nextMoveButton.addEventListener('click', moveRight);
async function init(){
    await showTopic();
    let indArr = [preInPre, preIn,sliderIndex, postIn, postInPost];
    for(let i =0; i < 5; i++){
        let tempDiv = document.createElement('div');
        let imgElem = document.createElement('img');
        imgElem.src = getImageThumb(objArr[indArr[i]].thumbnail_url);
        tempDiv.classList.add('featured-elem'); 
        tempDiv.append(imgElem);
        
        mainResultCont.append(tempDiv);
        divArr.push(tempDiv);
    }

}
function moveLeft(){
    
    postInPost = postIn;
    postIn = sliderIndex;
    if(sliderIndex == 0)
        sliderIndex = objArr.length-1;
    else
        sliderIndex--;
    console.log(sliderIndex);
    preIn = sliderIndex - 1;
    if(preIn == -1)
        preIn = objArr.length-1;
    preInPre = preIn-1;
    if(preInPre == -1)
        preInPre = objArr.length-1;
    mainResultCont.removeChild(mainResultCont.firstChild);
    let newDiv = document.createElement('div');
    newDiv.classList.add('featured-elem');
    let imgElem = document.createElement('img');
    imgElem.src = getImageThumb(objArr[postInPost].thumbnail_url);
    newDiv.append(imgElem);
    mainResultCont.append(newDiv);

}
function moveRight(){
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
    imgElem.src = getImageThumb(objArr[preInPre].thumbnail_url);
    newDiv.append(imgElem);
    mainResultCont.prepend(newDiv);
}

function getImageThumb(str){
    let ind = str.indexOf('-{width}x{height}');
    let res = str.substr(0, ind) + str.substr(ind+17);
    console.log(res);
    return res;
}
// showTopic();
init();