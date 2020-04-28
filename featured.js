
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

}
function moveRight(){

}

function getImageThumb(str){
    let ind = str.indexOf('-{width}x{height}');
    let res = str.substr(0, ind) + str.substr(ind+17);
    console.log(res);
    return res;
}
// showTopic();
init();