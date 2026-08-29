const mapArticle = (item) => {
    const title = item.title || '';
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = ((hash << 5) - hash + title.charCodeAt(i)) | 0;
    }
    const id = Math.abs(hash).toString(36);

    return {
        id,
        title,
        category: item.source?.name || 'general',
        description: item.description,
        link: item.url,
    };
};

const interactions = {};

const getInteractions = (email) => {
    if (!interactions[email]) {
        interactions[email] = { read: [], favorites: [] };
    }
    return interactions[email];
};

const markAsRead = (email, articleId, cachedArticles) => {
    if (!articleId) {
        const err = new Error('Article ID is required');
        err.statusCode = 400;
        throw err;
    }

    if (cachedArticles && !cachedArticles.find(a => a.id === articleId)) {
        const err = new Error('Article not found');
        err.statusCode = 404;
        throw err;
    }

    const userInteractions = getInteractions(email);
    const article = { id: articleId, readAt: new Date().toISOString() };
    const exists = userInteractions.read.find(a => a.id === article.id);
    if (!exists) {
        userInteractions.read.push(article);
    }
    return userInteractions.read;
};

const markAsFavorite = (email, articleId, cachedArticles) => {
    if (!articleId) {
        const err = new Error('Article ID is required');
        err.statusCode = 400;
        throw err;
    }

    if (cachedArticles && !cachedArticles.find(a => a.id === articleId)) {
        const err = new Error('Article not found');
        err.statusCode = 404;
        throw err;
    }

    const userInteractions = getInteractions(email);
    const article = { id: articleId, favoritedAt: new Date().toISOString() };
    const exists = userInteractions.favorites.find(a => a.id === article.id);
    if (!exists) {
        userInteractions.favorites.push(article);
    }
    return userInteractions.favorites;
};

const getReadArticles = (email) => {
    return getInteractions(email).read;
};

const getFavoriteArticles = (email) => {
    return getInteractions(email).favorites;
};

module.exports = { mapArticle, markAsRead, markAsFavorite, getReadArticles, getFavoriteArticles };
