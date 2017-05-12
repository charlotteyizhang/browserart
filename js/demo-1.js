// (function() {

    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;
    var tweetCondition = false;
    var colorScheme = [{
        colorR : "220",
        colorG : "57",
        colorB : "85"
    },{
        colorR : "237",
        colorG : "170",
        colorB : "11"
    },{
        colorR : "0",
        colorG : "225",
        colorB : "194"
    }];
    var transparency = 1;
    var speedRate = 1.5;
    var pre_speed = 1;
    var pre_tweet_id = 0;
    var music = ["media/airport.mp3", "media/streetsound.mp3", "media/cafe-voice.mp3"];
    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = width/5; x < width/5*4; x = x + width/20) {
            for(var y = height/5; y < height/5*4; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        // if(!('ontouchstart' in window)) {
        //     window.addEventListener('mousemove', mouseMove);
        // }
        // if(!('ontouchstart' in window)) {
        //     window.addEventListener('mouseclick', mouseClick);
        // }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);

    // get latest data every 10 seconds
         // setInterval(getSoundInput, 1000);
         // setInterval(getSoundInputFromDB, 3000);
         // setInterval(function(){
         //    location.reload();
         //    console.log("reload");
         // }, 10000)
        
        /**
        * Every 10 second
        */
        setInterval(function(){
        // var now = new Date(Date.now());
        // var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();// 20:10:58
        // $("#current-time").html(formatted);
        twitter_update();
        }, 10000);

    }

    function mouseClick(e) {
        while(speedRate<1){
            speedRate = 0.01;
            speedRate --;
        }
    }

    function twitter_update(){
        //only when people enter their world
        if(tweetCondition){
             $.ajax({
                url: 'php/get_tweets.php',
                type: 'GET',
                success: function(response) {
                    if (typeof response.errors === 'undefined' || response.errors.length < 1) {
                        var $tweets = $('<ul></ul>');
                        var $tweet_id = 0;
                        $.each(response.statuses, function(i, obj) {
                            $tweets.append('<li>' + "You have a new message: "+obj.text + '</li>');
                            $tweet_id = obj.id;
                        });
                        
                        $('.tweets-container').fadeOut("slow");
                        $('.tweets-container').html($tweets);
                        if($tweet_id && $tweet_id != pre_tweet_id){

                        $('.tweets-container').fadeIn("slow");
                            pre_tweet_id = $tweet_id;
                            speedRate = 0.8;
                            console.log($tweet_id);
                            playAudio(audioNumber);
                        }else{
                            speedRate = 3;
                        }
                    } else {
                        $('.tweets-container p:first').text('Response error');
                    }
                },
                error: function(errors) {
                    $('.tweets-container p:first').text('Request error');
                }
            });
        }
    }

    function setAudioPlay(flag, num){
        tweetCondition = flag;
        audioNumber = num || 0;
        console.log("audio:"+num);
    }

    //audio should be played under two conditions: new twitter entry and huge pic.
    var audioElement = document.createElement('audio');
    function playAudio(index){

        audioElement.setAttribute('src', music[index]);
        audioElement.play();
        console.log("play");
    }
    function stopAudio(){
        audioElement.pause();
        console.log("stop");
    }
    // function mouseMove(e) {
    //     var posx = posy = 0;
    //     if (e.pageX || e.pageY) {
    //         posx = e.pageX;
    //         posy = e.pageY;
    //     }
    //     else if (e.clientX || e.clientY)    {
    //         posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    //         posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    //     }
    //     target.x = posx;
    //     target.y = posy;
    // }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        // console.log("update:"+speedRate);
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = transparency - 0.55;
                    points[i].circle.active = transparency - 0.1;
                } else if(Math.abs(getDistance(target, points[i])) < 100000) {
                    points[i].active = transparency - 0.75;
                    points[i].circle.active = transparency - 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 400000) {
                    points[i].active = transparency - 0.95;
                    points[i].circle.active = transparency - 0.6;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        //set up the speed TweenLite.to(somewhere, *speed*(1+1*Math.random()), something)
        TweenLite.to(p, speedRate+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    //get Sound Input Ideally from thingSpeak, not ideally from the database
    // function getSoundInput(){
    //     //ajax
    //     var chanel = "103714"
    //     // get the data with a webservice call

    // //https://api.thingspeak.com/channels/9/fields/1.json?results=2
    //     $.getJSON('https://api.thingspeak.com/channels/'+chanel+'/fields/1.json?results=1', function(data)
    //         {
    //             var feedsArray = data.feeds;
    //             speedRate = 1/feedsArray[0].field1;
    //             if(speedRate != pre_speed){
    //                 initAnimation();
    //                 pre_speed = speedRate;
    //                 // console.log("differnt!"+ speedRate);
    //             }
    //         });
    // }

    //get sound input from database
    // function getSoundInputFromDB(){
    //     $.post('php/webquery.php',
    //     {},
    //     function(data){
    //         speedRate = 1/data;
    //         if(speedRate != pre_speed){
    //             initAnimation();
    //             pre_speed = speedRate;
    //             // console.log("differnt!" + speedRate);
    //         }
    //     });
    // }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            var colorset = colorScheme[parseInt(Math.random()*3)];
            if(colorset == null){
                colorset = colorScheme[0];
            }
            ctx.strokeStyle = 'rgba('+colorset.colorR+','+colorset.colorG+','+colorset.colorB+','+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {

            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            var colorset = colorScheme[parseInt(Math.random()*3)];
            if(colorset == null){
                colorset = colorScheme[0];
            }
            ctx.fillStyle = 'rgba('+colorset.colorR+','+colorset.colorG+','+colorset.colorB+','+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    $(document).ready(function() {
      $("#demo-pics-controls").on('click', 'span', function() {
        $("#demo-pics img").removeClass("opaque");

        var newImage = $(this).index();

        $("#demo-pics img").eq(newImage).addClass("opaque");

        $("#demo-pics-controls span").removeClass("selected");
        $(this).addClass("selected");
      });
      //when the pic is clicked, show next pic.
      $("#demo-pics img").on('click', function(){
        var image = $(".opaque");
        var newImageIndex = parseInt(image[0].alt)+1;
        if(newImageIndex > 2){
            newImageIndex = 0;
        }

        $("#demo-pics img").removeClass("opaque");

        $("#demo-pics img").eq(newImageIndex).addClass("opaque");

        $("#demo-pics-controls span").removeClass("selected");
        $("#demo-pics-controls").eq(newImageIndex).addClass("selected");

      })
    });
    
// })();