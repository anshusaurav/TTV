async function showTopic(gameId) {
    let posts,response;
    response = await fetch(`https://api.twitch.tv/helix/streams?game_id=${gameId}`);
    
    posts = await response.json();
    console.log('search');
    console.log(posts);
    // resultPosts.push(...posts.data.children);
    // resultPosts.forEach(elem=>createLiElem(elem));
   
}
showTopic(33214);