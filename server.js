const app = require('.');
const config = require('./app/config');
const scheduler = require('./app/services/scheduler');

app.listen(config.port, (err) => {
    if (err) {
        console.error('Server failed to start:', err);
        return;
    }
    console.log(`Server is listening on ${config.port}`);
    scheduler.start();
});
