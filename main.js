async function showTopic(gameId) {
    let posts,response;
    response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}`,{
        method:'GET',
        headers: {
        'Client-ID': 'iswx80n6way6l4cvuecpmtz3gw75vd'
        }
    });
    
    posts = await response.json();
    console.log('search');
    console.log(posts);
    // resultPosts.push(...posts.data.children);
    // resultPosts.forEach(elem=>createLiElem(elem));
   
}
showTopic(570);
new Twitch.Embed("twitch-embed", {
    width: 854,
    height: 480,
    layout: "video",
    channel: "zai"
});