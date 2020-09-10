function handleResult(res) {
}

function capture() {
    var w = video.videoWidth;
    var h = video.videoHeight;
    var canvas = document.getElementById("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);
    var image = canvas.toDataURL("image/jpeg");
    var img = document.getElementById("result")
    img.src = image;
    data = JSON.stringify({
        image: document.getElementById("result").src
    });
    $.post('/recognize/', {
        data: data
    }, function(res) {
        if (res.result == 'OK') {
            console.log(res);
            handleResult(res);
        } else {
          console.log('Nothing');
        }
    })
}

setInterval(capture, 1000);