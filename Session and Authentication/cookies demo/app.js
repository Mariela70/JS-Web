const app = require('express')();
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser);
app.use(session({
    secret: 'my secret code',
    saveUnitializated: true,
    resave: false,
    cookie: {secure: false}
}));
app.get('/', (req, res) => {
    res.cookie('cookieParser', 1);
    req.session.visited = (req.session.visited || 0) + 1;
    res.send('Hello Visit counter: ' + req.session.visited);
});
app.listen(3000);