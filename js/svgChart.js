(function() {
    var width, height, largeHeader, canvas, svg, points, target;
    var audioElement = document.createElement('audio');
    var audioNumber = 0;
    

    width = window.innerWidth;
    height = window.innerHeight;
    target = {x: width/2, y: height/2};

    largeHeader = document.getElementById('large-header');
    largeHeader.style.height = height;

    var canvasW = width/2;
    var canvasH = height/2;

    svg = d3.select("#demo-small-pics").append("svg")
                .attr("width", canvasW)
                .attr("height", canvasH)
                .append("g");

    var links = ["img/reading-sm.png", "img/laptop-sm.png", "img/coffee-sm.png"];
    var pic_num = links.length;
    //generate points
    var pics = [];
    for(var i=1; i <= pic_num; i++) {
        var px = canvasW/4*i;
        var py = canvasH/2;
        var p = {x: px, originX: px, y: py, originY: py };
        pics.push(p);
    }
    //asign rings
    // for(var i in pics) {
    //   var c = new Circle(pics[i], 80);
    //   pics[i].ring = c;
    //   c.draw();
    //   c.myTransition();
    // }
    // assign a pic to each point
    for(var i in pics) {
        var c = new Node(pics[i], 80, links[i], i);
        pics[i].pic = c;
        c.draw();
    }

    function Node(pos, rad, url, i){
      var _this = this;

      // constructor
      (function() {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.url = url || null;
          _this.node = null;
          _this.i = i || null;
      })();

      this.draw = function() {
      _this.node= svg.append("image")
                    .attr("class", "pics")
                   .attr("alt", _this.i)
                   .attr("xlink:href", _this.url)
                   .attr("x", _this.pos.x)
                   .attr("y", _this.pos.y)
                   .attr("height", _this.radius)
                   .attr("width", _this.radius)
                   .on("click", clicked)
                   .on("mouseover", function(){
                      d3.select(this).style("cursor", "pointer")
                    })
                   .on("mouseout", function(){
                      d3.select(this).style("cursor", "default")
                    });
      };
    }

    function Circle(pos, rad){
      var _this = this;
      //constructor Circle()
      (function() {
        _this.pos = pos || null;
        _this.radius = rad || null;
      })();

      this.draw = function(){
        var speedLineGroup = svg.append("g")
                    .attr("class", "speedlines");
      }

      this.myTransition = function(cicleData){
        var radius = _this.radius/3*2;
        var transition = d3.select(this).transition();
        _this.node = svg.append("circle")
                        .attr({"class": "ring",
                       "fill":"red",
                       "stroke":"red",
                       "cx": _this.pos.x+radius/3*2,
                       "cy": _this.pos.y+radius/3*2,
                       "r":radius,
                       "opacity": 0.4,
                       "fill-opacity":0.1
                      })
                    .transition()
                    .duration(function(){         
                    return 3000;
                    })
                    .attr("r", radius + 100 )
                    .attr("opacity", 0)
                    .remove();
        transition.each('end', _this.myTransition);
      }
    }


    function clicked(){
      stopAudio();
      var node = d3.select(this).attr("alt");
      //set the first audio condition true.
      setAudioPlay(true, node);
      
      $("#demo-small-pics").hide();
      $("#demo-pics").show();

      $("#demo-pics").find("img").removeClass("opaque");
      $("#demo-pics").find("img").eq(node).addClass("opaque");

      $("#demo-pics-controls").find("span").removeClass("selected");
      $("#demo-pics-controls").find("span").eq(node).addClass("selected");
    }

    $("#close").on("click", function(){
      stopAudio();
      setAudioPlay(false, 0);
    
      $("#demo-small-pics").show();
      $("#demo-pics").hide();
      $('.tweets-container').fadeOut("slow");
    })

})();