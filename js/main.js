(function(){
    var canvasBody = document.getElementById("canvas"),
        canvas = canvasBody.getContext("2d"),
        gui = new dat.GUI(),
        w = canvasBody.width = window.innerWidth,
        h = canvasBody.height = window.innerHeight,
        stats,
        pi2 = Math.PI*2,
        pi= Math.PI,
        piD2 = Math.PI/2,
        tick = 0,
        opts = {
            canvas: {
                backgroundColor: "rgba(20,20,20,alpha)",
                bgAlpha: 0.2,
                amount: 50,
                displayStats: false,
            },
            particle: {
                speed: 1,
                maxSpeed: 0.25,
                bounce: false
            },
            size: 10,
            light: 5
        },
        Colors = [
            "#2ecc71", //green
            "#3498db", //blue
            "#e67e22", //orange
            "#e74c3c", //red
            "#ecf0f1", //white
            "#9b59b6", //purple
            "#2c3e50", //night-blue
        ],
        particles = [],
        Mouse = new Vector2(w/2, h/2), 
        Particle = function(X, Y){
            this.pos = new Vector2(X||0, Y||0);
            this.acc = new Vector2(0, 0);
            this.speed = new Vector2(0, 0);
            this.color = Colors[Math.floor(Math.random()*Colors.length)];
            this.maxSpeed = opts.particle.maxSpeed + Math.random()*opts.particle.maxSpeed;
        }; 

    Particle.prototype.update = function(){
        if(opts.particle.bounce){
            this.border();
        }
        this.speed.add(this.acc);
        this.speed.limit(10);
        this.pos.add(this.speed);
        this.acc.set(0);

    };
    Particle.prototype.lookFor = function(tar){
        var dir = tar.copy();
        dir.sub(this.pos);
        var steer = dir.sub(this.speed);
        steer.limit(this.maxSpeed)
        this.force(steer); 
    };
    Particle.prototype.force = function(f){
        this.acc.add(f);
    };
    Particle.prototype.render = function(){
        var d = this.speed.direction();
        canvas.strokeStyle = this.color;
        canvas.fillStyle = this.color;
        canvas.beginPath();
        canvas.moveTo(Math.cos(d)*(opts.size)+this.pos.x,Math.sin(d)*(opts.size)+this.pos.y);
        canvas.lineTo(Math.cos(d+piD2)*(opts.size/3)+this.pos.x,Math.sin(d+piD2)*(opts.size/2)+this.pos.y);
        canvas.lineTo(Math.cos(d-piD2)*(opts.size/3)+this.pos.x,Math.sin(d-piD2)*(opts.size/3)+this.pos.y)
        canvas.lineTo(Math.cos(d)*opts.size+this.pos.x,Math.sin(d)*opts.size+this.pos.y);
        canvas.closePath();
        canvas.stroke();
        canvas.fill();
    };

    Particle.prototype.border = function(){
        this.pos.x > w - opts.size ? (this.speed.x*=-1, this.pos.x = w-opts.size) : undefined;
        this.pos.x < opts.size ? (this.speed.x*=-1, this.pos.x = opts.size) : undefined;
        this.pos.y > h - opts.size ? (this.speed.y*=-1, this.pos.y = h-opts.size) : undefined;
        this.pos.y < opts.size ? (this.speed.y*=-1, this.pos.y = opts.size) : undefined;
    };
    function populate(){
        canvas.fillStyle = opts.canvas.backgroundColor.replace("alpha", 1);
        canvas.fillRect(0,0,w,h)
        particles = [];
        for(var i = 0; i < opts.canvas.amount; particles[i++] = new Particle(Math.random()*w, Math.random()*h));
    };
    function statsC(){
        if(opts.canvas.displayStats){
            document.querySelector(".statss").style.opacity = "0.9"
        } else {
            document.querySelector(".statss").style.opacity = "0"
        }
    };
    function setup(){
        stats = new Stats();
        stats.showPanel( 0 );
        populate();
        gui.add(opts.canvas, 'amount', 1, 750).onFinishChange(populate);
        gui.add(opts, "size", 5, 50);
        gui.add(opts.canvas, "displayStats").onFinishChange(statsC).name("Display FPS");
        gui.add(opts.particle, "bounce");
        gui.close();
        stats.domElement.className = "statss";
        document.body.appendChild( stats.domElement );
        window.requestAnimationFrame(loop);
        statsC();
    };

    function loop(){
        stats.begin();
        canvas.fillStyle = opts.canvas.backgroundColor.replace("alpha", opts.canvas.bgAlpha);
        canvas.fillRect(0,0,w,h);

        particles.map(function(P){
            P.lookFor(Mouse);
            P.update();
            P.render();
        });

        canvas.fillStyle= "white";
        canvas.beginPath();
        canvas.arc(Mouse.x, Mouse.y, opts.light, 0, pi2);
        canvas.closePath();
        canvas.shadowBlur=20;
        canvas.shadowColor="white"
        canvas.fill();

        canvas.shadowBlur=0;
        window.requestAnimationFrame(loop);
        stats.end();
    };
    setup();

    window.addEventListener("resize", function(){
        w = canvasBody.width = window.innerWidth;
        h = canvasBody.height = window.innerHeight;
    });
    window.addEventListener("mousemove", function(e){
        Mouse.set({x:e.pageX,y:e.pageY});		
    });
    canvasBody.addEventListener("mousedown", populate);
})();