const electron = require('electron')

const { app, BrowserWindow } = electron;

var request = require('request');
var fs = require('fs');

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

    is_gallery = (s.indexOf('gallery') < 0) ? false : true;

    document.getElementById('inner').innerHTML = 'is this a gallery? ==> ' + is_gallery;

    refine = s.substr(s.lastIndexOf('/') + 1);

    console.log('the id of album: ' + refine);

    request_url = 'http://api.imgur.com/3/album/' + refine + '/images';

    console.log(request_url);

    var options = {
        url: request_url,
        headers: {
            'Authorization': 'Client-ID xxxxxxxxx'
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            // console.log(response);
            console.log(info.data);
            console.log(info.data.images.length);
            console.log(info.data.images);
            for(var i=0; i<info.data.images.length; i++){
                var html = '<li>' + info.data.images[i].link + '</li>';
                urls.push(info.data.images[i].link);
                document.getElementById('listofimages').innerHTML += html;
                var extension = urls[i].substr(urls[i].lastIndexOf('.'));
                request(urls[i]).pipe(fs.createWriteStream('app/img/' + i + extension));
            }
        }
        else {
            console.log('some error occured');
        }
    }

    request(options, callback);

    // request(s, function(err, resp, body) {
    //     console.log('here');
    //     if (!err && resp.statusCode == 200) {
    //         $('.post-image-placeholder').each(function() {
    //             console.log(this);
    //             var url = this.attribs.src;
    //             urls.push('http:\/\/' + url.substr(2));
    //             // if (url.indexOf('i.imgur.com') != -1) {
    //             //     urls.push(url);
    //             // }
    //         });
    //         console.log(urls);
    //         for (var i = 0; i < urls.length; i++) {
    //             request(urls[i]).pipe(fs.createWriteStream('app/img/' + i + '.png'));
    //         }
    //     } else {
    //         console.log(err);
    //     }
    // });
}
