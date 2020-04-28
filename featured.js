
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
    // let videoFeatureElem = document.querySelector('.featured-container >:nth-child(3)');
    // videoFeatureElem.removeChild(videoFeatureElem.firstChild);
    // videoFeatureElem.innerHTML = `<iframe
    // src="https://player.twitch.tv/?channel=${objArr[sliderIndex].user_name}&parent=localhost&muted=true"
    // height="420"
    // width="880"
    // frameborder="0"
    // scrolling="no"
    // allowfullscreen="true">
    // </iframe>`;
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


    // let videoFeatureElem = document.querySelector('.featured-container >:nth-child(2)');
    // console.dir(videoFeatureElem);
    // videoFeatureElem.removeChild(videoFeatureElem.firstChild);
    // imgElem = document.createElement('img');
    // imgL = new Image();
    // imgL.onload = function(){
    //     imgElem.src = this.src;
    // }
    // imgL.src = getImageThumb(objArr[preIn].thumbnail_url);
    // videoFeatureElem.append(imgElem);


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
}

function getImageThumb(str){
    let ind = str.indexOf('-{width}x{height}');
    let res = str.substr(0, ind) + str.substr(ind+17);
    console.log(res);
    return res;
}
// showTopic();
init();