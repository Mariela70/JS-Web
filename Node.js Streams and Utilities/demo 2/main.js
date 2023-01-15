function handleRequest(req, res) {
    if (req.url == '/favicon.ico') {
        res.writeHead(404);
        res.write('404 Not Found');
        res.end();
    }else if (req.method == 'GET') {

    }else if (req.method == 'POSY') {
        
    }else {
        res.writeHead(404);
        res.write('404 Not Found');
        res.end();
    }

}
module.exports = {
    handleRequest
};