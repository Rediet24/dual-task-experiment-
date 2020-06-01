var randomStuff = ["Y", "X", "C","X","A","B","V","X","X","T"];
var $target;
var dur=2000;
var target=0;
var notarget=0;
var size;
var pressed;
var spe;
var myVar;
var time;
var cancelled;
var loadContentIndex;
var arr= new Array();
var param= new Array();
var hit=0;
var miss=0;
var falseAlarm=0;
var counter=0;
var i=1;
var trial;
var sum_h=0;
var sum_m=0;
var sum_f=0;
var sum_t=0;


function begin(){
  $("#text").hide()
  $("#desc").hide()
  $("#toolbar").hide()
  $("#border").show()
  $("#a").show()
  $("#target").show()
  setTimeout(function(){x.start();},1000);
}

function RandomObjectMover(obj, container) {
 
  this.$object = obj;
  this.$container = container;
  this.container_is_window = container === window;
  this.pixels_per_second = $("#speed").val();
  this.current_position = { x: 0, y: 0 };
  this.is_running = false;
}
setTimeout(RandomObjectMover.prototype.stop, time)

// Set the speed of movement in Pixels per Second.
RandomObjectMover.prototype.setSpeed = function(pxPerSec) {
    this.pixels_per_second = pxPerSec;
}

RandomObjectMover.prototype._getContainerDimensions = function() {
   if (this.$container === window) {
       return { 'height' : this.$container.innerHeight, 'width' : this.$container.innerWidth };
   } else {
       return { 'height' : this.$container.clientHeight, 'width' : this.$container.clientWidth };
   }
}

RandomObjectMover.prototype._generateNewPosition = function() {

    // Get container dimensions minus div size
  var containerSize = this._getContainerDimensions();
  var availableHeight = containerSize.height - this.$object.clientHeight;
  var availableWidth = containerSize.width - this.$object.clientHeight;
    
  // Pick a random place in the space
  var y = Math.floor(Math.random() * availableHeight);
  var x = Math.floor(Math.random() * availableWidth);
    
  return { x: x, y: y };    
}

RandomObjectMover.prototype._calcDelta = function(a, b) {
  var dx   = a.x - b.x;         
  var dy   = a.y - b.y;         
  var dist = Math.sqrt( dx*dx + dy*dy ); 
  return dist;
}

RandomObjectMover.prototype._moveOnce = function() {
        // Pick a new spot on the page
    var next = this._generateNewPosition();
    
    // How far do we have to move?
    var delta = this._calcDelta(this.current_position, next);
    
        // Speed of this transition, rounded to 2DP
        var speed = Math.round((delta / this.pixels_per_second) * 100) / 100;
    
    //console.log(this.current_position, next, delta, speed);
          
    this.$object.style.transition='transform '+speed+'s linear';
    this.$object.style.transform='translate3d('+next.x+'px, '+next.y+'px, 0)';
    
    // Save this new position ready for the next call.
    this.current_position = next;
  
};

RandomObjectMover.prototype.start = function() {

    if (this.is_running) {
    return;
  }

  $target = $('#target');
  $("#target").empty()
  $("#target").html("<h2>"+ "+" +"</h2>")


  size= $("#box").val();
  $("#border").css("width",size)
  $("#border").css("height",size)

    // Make sure our object has the right css set
  this.$object.willChange = 'transform';
  this.$object.pointerEvents = 'auto';
    
  this.boundEvent = this._moveOnce.bind(this)
  
  // Bind callback to keep things moving
  this.$object.addEventListener('transitionend', this.boundEvent);
  
  // Start it moving
  this._moveOnce();
  
  this.is_running = true;

  cancelled= false;

  myVar= window.setInterval(loadContent, dur);

  time= $("#time").val() *1000;
  trial= $("#trial").val()
  spe= $("#speed").val()

  setTimeout(function(){x.stop();},time);

}

RandomObjectMover.prototype.stop = function() {

    if (!this.is_running) {
    return;
  }
  
  this.$object.removeEventListener('transitionend', this.boundEvent);
  
  this.is_running = false;

  cancelled= true;

  clearInterval(myVar)

  clearInterval(repeater)

  var result= (time-counter)/time;
  c= (result-0.99)/0.01;
  miss= target-hit;

  if(target==0){ target=1 }
  if(notarget==0){notarget=1 }

  sum_h= sum_h+ (hit/target);
  sum_m= sum_m+ (miss/target);
  sum_f= sum_f+ (falseAlarm/notarget);
  sum_t= sum_t+ c;

  var dict = {"hit": (hit/target).toFixed(2), "miss": (miss/target).toFixed(2), "False Alarm": (falseAlarm/notarget).toFixed(2), "Tracking Error": c.toFixed(2), "Num. Of Targets": target, "Num. Of Non-targets": notarget};
  arr.push(dict)

  hit=falseAlarm=miss=counter=display=0;
  target=notarget=0;


  i++;
  if(i <= trial){
    alert(" Trial " + i)
    x.start()
  }
  else{

    // var par= {"Number of Trials": trial, "Stimulus Duration (ms) ": dur, "Box speed (Px/sec)": spe, "Trial Duration (ms) ": time, "Box Width (px)" : size}
    var avg= {"Number of Trials": trial, "Stimulus Duration (ms) ": dur, "Box speed (Px/sec)": spe, "Trial Duration (ms) ": time,"Box Width (px)" : size,"Average Hit": (sum_h/trial).toFixed(2) , "Average Miss  ": (sum_m/trial).toFixed(2), "Average False Alarm  ": (sum_f/trial).toFixed(2), "Average Tracking Error  ": (sum_t/trial).toFixed(2)}
    // param.push(par)
    param.push(avg)
    alert("End of Trials. Check Results")
    $("#result").show()
  }

  

}


// Init it
var x = new RandomObjectMover(document.getElementById('border'), window);


// Toolbar stuff
if(document.getElementById('start')!=null){

  document.getElementById('start').addEventListener('click', function(){
    x.start();
  });

}

if(document.getElementById('stop')!=null){

  document.getElementById('stop').addEventListener('click', function(){
      x.stop();
  });

}

if(document.getElementById('speed')!=null){


  document.getElementById('speed').addEventListener('keyup', function(){
    if (parseInt(this.value) > 3000 ) {
          alert('Too fast');
      this.value = 250;
    }

      x.setSpeed(parseInt(this.value));
  });


}

if(document.getElementById('duration')!=null){

  document.getElementById('duration').addEventListener('keyup', function(){
    dur= this.value
  })

}

// Start it off

x.stop();
cancelled=true;

  
function loadContent() {

    $target = $('#target');

     if (cancelled==true) {
       return
    }

   

    loadContentIndex= Math.floor(Math.random() * randomStuff.length)

    $target.fadeOut(function() {
        let display= randomStuff[loadContentIndex];
        if(display=="X"){
          target++;
        }else{
          notarget++;
        }
        $target.text(display);
             document.body.onkeyup = function(){
               if (pressed==false){
                  getKey(event)
                  pressed=true
                }
             }

        $target.fadeIn();
        pressed=false;
    });

    // loadContentIndex++;

    if (randomStuff.length == loadContentIndex) {
        loadContentIndex = 0;
    }

}

function getKey(e){

  if (cancelled==true) {
       return
    }

   if (e.keyCode==32 && $('#target').text()=="X"){
    hit++;
    console.log("hit")
   }

   if (e.keyCode==32 && $('#target').text()!="X"){
    falseAlarm++;
    console.log("falseAlarm")
   }

   if (e.keyCode!=32 && $('#target').text()=="X"){
    miss++;
    console.log("miss")
   }
}


function report(){

  $("#target").empty()
  $("#border").remove()

  document.write("<center>"+ "<button onclick= 'location.reload()'>" + "New Trial" + "</button>" + "</center>");

  // document.write( "<i>" + "<u>"+ "A. List of settings for the block of trials" + "</i>" + "</u>" + "<br>" +  "<br>" );
  // for(let a in param[0]){
  //   document.write(a + " : " + param[0][a] + "<br>");
  // }
  //   document.write("<br>" + "<br>" + "<br>");



  document.write( "<i>" +"<u>"+ "A. Average Results for the block of trials" + "</i>" + "</u>"+ "<br>" +  "<br>" );
  var table = document.createElement('table');


  var th = document.createElement("th");
  var tr = document.createElement("tr"); 
  var tr2 = document.createElement("tr"); 

  for (let a in param[0]){

    var text= document.createTextNode(a);
    var td = document.createElement('td');
    td.width='100'
    td.appendChild(text);
    tr2.appendChild(td);

    var text1 = document.createTextNode(param[0][a]);
    var td1 = document.createElement('td');
    td1.appendChild(text1);
    tr.appendChild(td1);
}

    table.appendChild(tr2);
    table.appendChild(tr);

  document.body.appendChild(table);



  document.write("<br>" + "<br>" + "<br>");

  document.write( "<i>" +"<u>" + "B. Results for the block of trials" + "</i>" +  "<br>" + "</u>");
  for (let k = 0; k< arr.length; k++) {
    let p= k+1;
    document.write( "<b>" + "<h2>"+ "<center>" + "Results for Trial " + p + "</center>" +"</b>" + "</h2>"+ "<br>");
        for (let j in arr[k]) {
            document.write( j + ": " + arr[k][j] + "<br>");
        }
        document.write("*********************************************************************************************************************************************************************" + "<br>" + "<br>");
    } 


  document.write("<center>"+ "<button onclick= 'location.reload()'>" + "New Trial" + "</button>" + "</center>");

}



$("#border").mouseover(function(){
    incInterval= setInterval(function(){
      counter++;
    },100);

  });


$("#border").mouseout(
  function(){
    clearInterval(incInterval);
});








