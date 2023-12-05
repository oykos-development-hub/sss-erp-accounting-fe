const getMovementArticles = `query MovementArticlesOverview($title:String) {
   movementArticles_Overview(title:$title){
        status 
        message
        items 
    }
}`;

export default getMovementArticles;
