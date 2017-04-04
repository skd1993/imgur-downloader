const electron = require('electron')

const { app, BrowserWindow } = electron;

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

var mainWindow = null;
var urls = [];
var s = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
            // frame: false
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});


function search() {
    var searchText = document.getElementById('search').value;
    document.getElementById('inner').innerHTML = searchText;
    s = searchText;
    console.log(s);
    request(s, function(err, resp, body) {
        console.log('here');
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(body);
            $('.post-image-placeholder').each(function() {
                console.log(this);
                var url = this.attribs.src;
                urls.push('http:\/\/' + url.substr(2));
                // if (url.indexOf('i.imgur.com') != -1) {
                //     urls.push(url);
                // }
            });
            console.log(urls);
            for (var i = 0; i < urls.length; i++) {
                request(urls[i]).pipe(fs.createWriteStream('app/img/' + i + '.png'));
            }
        } else {
            console.log(err);
        }
    });
}