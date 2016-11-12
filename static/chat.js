$(function() {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);

    chatsock.onmessage = function(message) {
        var data = JSON.parse(message.data);
        var chat = $("#chat")
        var ele = $('<tr></tr>')

        ele.append(
            $("<td></td>").text(data.timestamp)
        )
        ele.append(
            $("<td></td>").text(data.handle)
        )
        ele.append(
            $("<td></td>").text(data.message)
        )

        chat.append(ele)
    };

    $("#chatform").on("submit", function(event) {
        var message = {
            handle: $('#handle').val(),
            message: $('#message').val(),
        }

        var httpRequest = new XMLHttpRequest();
        var url = 'http://text-processing.com/api/sentiment/';

        function responseUpdate() {
            if (httpRequest.readyState == XMLHttpRequest.DONE) {
                if (httpRequest.status == 200) {
                    var response = JSON.parse(httpRequest.responseText);
                } else {
                    alert('whoops')
                }
            }
        }

        httpRequest.onreadystatechange = responseUpdate;
        httpRequest.open('GET', url)
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        httpRequest.send('text=' + message.message);
        // var response = JSON.parse(httpRequest.responseText);

        // function responseUpdate() {
        //     if (httpRequest.readyState == XMLHttpRequest.DONE) {
        //         if (httpRequest.status == 200) {
        //             var response = JSON.parse(httpRequest.responseText);
        //         } else {
        //             alert('whoops')
        //         }
        //     }
        // }

        if (response) {
            if (response['probability'] > 0.55) {
                alert('stop. too mean.');
                return false;
            }
        }
        if (!response) {
            alert('fuck');
        }

        chatsock.send(JSON.stringify(message));
        $("#message").val('').focus();
        return false;
    });
});
