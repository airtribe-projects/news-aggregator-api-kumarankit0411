const tap = require('tap');
const supertest = require('supertest');
const app = require('../app');
const server = supertest(app);

const mockUser = {
    name: 'Clark Kent',
    email: 'clark@superman.com',
    password: 'Krypt()n8',
    preferences:['movies', 'comics']
};

let token = '';
let articleId = '';

tap.test('POST /users/signup', async (t) => { 
    const response = await server.post('/users/signup').send(mockUser);
    t.equal(response.status, 201);
    t.end();
});

tap.test('POST /users/signup with missing email', async (t) => {
    const response = await server.post('/users/signup').send({
        name: mockUser.name,
        password: mockUser.password
    });
    t.equal(response.status, 400);
    t.end();
});

tap.test('POST /users/login', async (t) => { 
    const response = await server.post('/users/login').send({
        email: mockUser.email,
        password: mockUser.password
    });
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'token');
    token = response.body.token;
    t.end();
});

tap.test('POST /users/login with wrong password', async (t) => {
    const response = await server.post('/users/login').send({
        email: mockUser.email,
        password: 'wrongpassword'
    });
    t.equal(response.status, 401);
    t.end();
});

tap.test('GET /users/preferences', async (t) => {
    const response = await server.get('/users/preferences').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'preferences');
    t.same(response.body.preferences, mockUser.preferences);
    t.end();
});

tap.test('GET /users/preferences without token', async (t) => {
    const response = await server.get('/users/preferences');
    t.equal(response.status, 401);
    t.end();
});

tap.test('PUT /users/preferences', async (t) => {
    const response = await server.put('/users/preferences').set('Authorization', `Bearer ${token}`).send({
        preferences: ['movies', 'comics', 'games']
    });
    t.equal(response.status, 200);
    t.end();
});

tap.test('Check PUT /users/preferences', async (t) => {
    const response = await server.get('/users/preferences').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.same(response.body.preferences, ['movies', 'comics', 'games']);
    t.end();
});

tap.test('GET /news', async (t) => {
    const response = await server.get('/news').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'news');
    articleId = response.body.news[0].id;
    t.end();
});

tap.test('GET /news without token', async (t) => {
    const response = await server.get('/news');
    t.equal(response.status, 401);
    t.end();
});

tap.test('GET /news returns cached result on second call', async (t) => {
    const response1 = await server.get('/news').set('Authorization', `Bearer ${token}`);
    const response2 = await server.get('/news').set('Authorization', `Bearer ${token}`);
    t.equal(response1.status, 200);
    t.equal(response2.status, 200);
    t.same(response1.body.news, response2.body.news);
    t.end();
});

tap.test('POST /news/:id/read marks article as read', async (t) => {
    const response = await server.post(`/news/${articleId}/read`).set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'read');
    t.end();
});

tap.test('POST /news/:id/read without token', async (t) => {
    const response = await server.post(`/news/${articleId}/read`);
    t.equal(response.status, 401);
    t.end();
});

tap.test('POST /news/:id/read with invalid id returns 404', async (t) => {
    const response = await server.post('/news/invalid-id-xyz/read').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 404);
    t.end();
});

tap.test('GET /news/read returns read articles', async (t) => {
    const response = await server.get('/news/read').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'read');
    t.ok(response.body.read.length > 0);
    t.end();
});

tap.test('POST /news/:id/favorite marks article as favorite', async (t) => {
    const response = await server.post(`/news/${articleId}/favorite`).set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'favorites');
    t.end();
});

tap.test('POST /news/:id/favorite without token', async (t) => {
    const response = await server.post(`/news/${articleId}/favorite`);
    t.equal(response.status, 401);
    t.end();
});

tap.test('POST /news/:id/favorite with invalid id returns 404', async (t) => {
    const response = await server.post('/news/invalid-id-xyz/favorite').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 404);
    t.end();
});

tap.test('GET /news/favorites returns favorite articles', async (t) => {
    const response = await server.get('/news/favorites').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'favorites');
    t.ok(response.body.favorites.length > 0);
    t.end();
});

tap.test('GET /news/search/:keyword returns results', async (t) => {
    const response = await server.get('/news/search/technology').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'news');
    t.end();
});

tap.test('GET /news/search/:keyword without token', async (t) => {
    const response = await server.get('/news/search/technology');
    t.equal(response.status, 401);
    t.end();
});

tap.test('Scheduler can start and stop without error', async (t) => {
    const scheduler = require('../app/services/scheduler');
    await scheduler.start();
    scheduler.stop();
    t.pass('Scheduler started and stopped without error');
    t.end();
});
