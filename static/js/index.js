(function() {

    let width = 320; // We will scale the photo width to this
    let height = 0; // This will be computed based on the input stream

    let streaming = false;

    let video = null;
    let canvas = null;
    let photo = null;
    let startbutton = null;
    let result = null

    function boot() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');
        result = document.getElementById('result')

        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.log("Error: " + err);
            });

        video.addEventListener('canplay', function(ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

        startbutton.addEventListener('click', function(ev) {
            const picture = takePicture();
            assertpicture(picture)
            ev.preventDefault();
        }, false);

        clearphoto();
    }

    function clearphoto() {
        const context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }

    function takePicture() {
        const context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            const data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
            return data;
        } else {
            clearphoto();
        }
    }

    function assertpicture(picture) {
        // Assert that picture is valid thorough backend, then:

        const textElement = document.getElementById('result').children[0]

        data = JSON.stringify({
            image: picture
        });
        $.post('/recognize/', {
            data: data
        }, function(res) {
            if (res.result == 'OK') {
                console.log(res);
                _setPositiveResult(res.flag)
            } else {
              _setNegativeResult()
            }
        })

        function _setPositiveResult(flag) {
            textElement.innerText = 'Ключ: ' + flag
            textElement.className = 'mt-5 text-center'
        }

        function _setNegativeResult() {
            textElement.innerText = 'Ошибка аутентификации'
            textElement.className = 'mt-5 text-center'
        }

        function _clearResult() {
            textElement.innerText = '...'
            textElement.className = 'mt-5 text-center text-muted'
        }
    }

    window.addEventListener('load', boot, false);
})();