var courtImg,courtOutline,logo,rim,net,backboard,frameModel,shoe,lace,bballtex,jerseyFront,jerseyBack,brick,swish,bigx,bigy,rows;
function preload() {
    table = loadTable("threepointers.csv", "csv", "header");
    courtImg=loadImage("court.png");
    courtOutline=loadImage("court_outline.png");
    logo=loadImage("nbaLogo.png");
    shoutOutToMyManJakeForShowingMeWhatTextureIsCameInSoCLUTCH=loadImage("basketballTexture.jpg")
    jerseyFront=loadImage("curryFront.png")
    jerseyBack=loadImage("curryBack.png")
    rim=loadModel("rim.obj")
    net=loadModel("net.obj")
    backboard=loadModel("backboard.obj")
    frameModel=loadModel("frame.obj")
    lace=loadModel("lace.obj")
    shoe=loadModel("shoe.obj")
    brick=loadSound("brick.mp3")
    swish=loadSound("swish.mp3")
}
var WebGLCanvas=document.getElementById("defaultCanvas0")
var cameraTypeElement=document.getElementById("camera")
function setup() {
    createCanvas(900, 500,WEBGL,WebGLCanvas);
    rows=table.getRows();
    angleMode(DEGREES)
    //scale is 5 pixels to 1 foot
}
var courtWidth=50*5
var courtLength=94*5
var cameraPos=[400,-150,0]
//value 2 is negative, bc negative of value 2 is the vertical dist from the court
var cameraDir=[180,-26.4]
//horizontal dir, vertical dir)
var cameraScope=100
var dataPlaying=false;
var shots=[];
var frame=0;
var moveSpeed=5;
var mousePos=[[-1,-1],[-1,-1]];
var cameraType="side";
//auto, false, fixed, or side
var shotsSelected=[];
var scrollBarY=0;
var scrollY=0;
//var shotsUsed=[];
var crosshairOverPoints=false;
var curry,ball,curryAction;
let inHoopX;
let inHoopY;
let inHoopZ;
let bounceNum=0
let banking=false;
let ballDownStart,ballDownCurrent,distOut,angleOut;
let bounceHeight=25;
let oldCameraValue=cameraTypeElement.value;
let cameraSelectionChanged=false;
let ballRelease=0;
let gameClock=false;
let gameClockStart=0;
let clockStarted=false;
let clockStopped=false;
let soundPlayed=false;
bigx=-1
bigy=-0.25
function draw() {
    background(200);
    function mouseInBounds(){
        return(mouseX>=0&&mouseX<=900&&mouseY>=0&&mouseY<=500);
    }
    if(cameraTypeElement.value=="free"){
        cameraType=false
    }else{
        cameraType=cameraTypeElement.value
    }
    if(oldCameraValue!=cameraTypeElement.value){
        cameraSelectionChanged=true;
        if(!mouseIsPressed&&mouseInBounds()){
            cameraSelectionChanged=false;
            oldCameraValue=cameraTypeElement.value
        }
    }else{
        cameraSelectionChanged=false;
    }
    function setUpMap(){
        camera(cameraPos[0], cameraPos[1], cameraPos[2],cameraPos[0]+cos(cameraDir[0])*(cos(cameraDir[1])*cameraScope),cameraPos[1]-sin(cameraDir[1])*cameraScope,cameraPos[2]-sin(cameraDir[0])*(cos(cameraDir[1])*cameraScope));
        //camera(200, -400, 800);
        

        rotateX(90)
        image(courtImg,-(courtLength*1292/1190)/2,-courtWidth/2,courtLength*1292/1190,courtWidth)
        image(courtOutline,-(courtLength*1593/1190)/2,-(courtWidth*849/687)/2,courtLength*1593/1190,courtWidth*849/687)
        fill("gray")
        noStroke()
        rotateX(-90)
        
        translate(courtLength/2-3.75,0,0)
            rotateX(90)
                translate(0,0,42.6)
                    fill("red")
                    model(rim)
                    fill("white")
                    model(net)
                translate(0,0,-42.6)
                fill(255,255,255,255)
                stroke("white")
                //noFill()
                fill(255,255,255,0)
                translate(4,0,56.06)
                    box(1,27.25,16)
                    translate(-0.7,-4.8,0)
                    rotateY(90)
                    fill(255,255,255,25)
                    stroke(227,224,220)
                        rect(0,0,7.5,10)
                        noStroke()
                        //translate(0.4,0,0)
                        rect(6.5,0,2,10)
                        //translate(0.4,0,0)
                        rotateZ(180)
                        image(logo,-6,4,5,2.5)
                        rotateZ(180)
                    rotateY(-90)
                    translate(0.7,4.8,0)
                translate(-4,0,-56.06)
                noStroke()
                fill("gray")
                translate(46,18,0)
                    model(frameModel)
                translate(-46,-18,0)
            rotateX(-90)
        translate(-courtLength/2+3.75,0,0)
        fill("red")
        stroke("black")
        //point(cameraPos[0], cameraPos[1], cameraPos[2])
        if(curry.action=="none"&&!crosshairOverPoints){
            strokeWeight(0.25)
            let cameraLookingAt=new coordinate(cameraPos[0]+cos(cameraDir[0])*(cos(cameraDir[1])*cameraScope),cameraPos[1]-sin(cameraDir[1])*cameraScope,cameraPos[2]-sin(cameraDir[0])*(cos(cameraDir[1])*cameraScope))
            //point(cameraLookingAt.x,cameraLookingAt.y,cameraLookingAt.z);
            //point(cameraLookingAt.x-cos(cameraDir[1])*0.5,cameraLookingAt.y-sin(cameraDir[1])*0.5,cameraLookingAt.z);
            //line(cameraLookingAt.x-sin(cameraDir[0])*0.5,cameraLookingAt.y,cameraLookingAt.z-cos(cameraDir[0])*0.5,cameraLookingAt.x-sin(cameraDir[0]+180)*0.5,cameraLookingAt.y,cameraLookingAt.z-cos(cameraDir[0]+180)*0.5)
            //line(cameraLookingAt.x-cos(-cameraDir[1]-90)*0.5,cameraLookingAt.y-sin(-cameraDir[1]-90)*0.5,cameraLookingAt.z,cameraLookingAt.x-cos(-cameraDir[1]+180-90)*0.5,cameraLookingAt.y-sin(-cameraDir[1]+180-90)*0.5,cameraLookingAt.z)
            translate(cameraLookingAt.x,cameraLookingAt.y,cameraLookingAt.z);
            rotateY(cameraDir[0])
            rotateZ(180-cameraDir[1])
            line(0,0,-0.5,0,0,0.5)
            line(0,-0.5,0,0,0.5,0)
            rotateZ(-180+cameraDir[1])
            rotateY(-cameraDir[0])
            translate(-cameraLookingAt.x,-cameraLookingAt.y,-cameraLookingAt.z);
            strokeWeight(1)
        }
    }
    function distBetweenPoints(x1,y1,z1,x2,y2,z2){
        return sqrt(((x1-x2)**2)+((y1-y2)**2)+((z1-z2)**2))
    }
    function distBetweenPts(x1,y1,x2,y2){
        return sqrt(((x1-x2)**2)+((y1-y2)**2))
    }
    function Body(x,y,z,width,height){
        this.x=x;
        this.y=y;
        this.z=z;
        this.width=width;
        this.height=height;
        //height is 31.25, bc steph is 6'3
        this.joints=[];
        this.tubes=[];
        this.ellipsoids=[];
        this.bodyAngles=[0,90];
        // at 0 degrees for the first one, facing towards hoop
        //90 degrees for the second one is upright
        this.shoeAngle=-10;
        this.ballHandDir=90
        //y along the y of unit circle
        this.jerseyColor="blue"
        this.hasBall=true;
        this.jumpHeight=0;
        this.action="none";
        this.madeShot=true;
        this.bank=false;
        this.fade=false;
        this.setActions=function(){
            this.shootingForm=new action([])
            this.shootingForm.positions.push(new position([85,-70,120,-70,50,-40,105,-10,-90],[105,-20,75,-20,0,270,0,270,0],[0,90],true))
            this.shootingForm.positions.push(new position([95,45,95,10,0,40,90,120,90],[80,-75,100,-75,0,270,0,270,-5],[0,90],true))
            this.shootingForm.positions.push(new position([95,45,95,65,0,40,95,65,90],[80,-75,100,-75,0,270,0,270,-5],[0,90],true))
            this.shootingForm.positions.push(new position([85,-80,85,-80,90,-70,90,-70,90],[80,-80,100,-80,0,270,0,270,-5],[0,90],true))
            this.shootingForm.positions.push(new position([85,-50,85,-80,15,-20,90,-20,90],[80,-80,100,-80,0,270,0,270,-5],[0,90],true))
        }

        //shooting motion 100,45,95,10,10,60,90,120
        this.createBIGBACKBody=function(position){
            let arms=position.arms
            let legs=position.legs
            let body=position.body
            this.ballHandDir=arms[8]
            this.shoeAngle=legs[8]
            this.bodyAngles=[body[0],body[1]]
            if(position.updateBody){
                this.bodyAngles[0]=-atan((0-this.z)/(courtLength/2-this.x))
                //this.bodyAngles[0]=180
            }
            this.tubes=[]
            this.joints=[]
            this.ellipsoids=[]
            //arm tubes on body
            this.joints.push(new joint(false,sin(this.bodyAngles[0]+180)*this.width/2+(-sin(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1)),(-sin(this.bodyAngles[1])*(this.height*0.35/2-1)),(cos(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1))+cos(this.bodyAngles[0]+180)*this.width/2,1))
            this.joints.push(new joint(false,sin(this.bodyAngles[0])*this.width/2+(-sin(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1)),(-sin(this.bodyAngles[1])*(this.height*0.35/2-1)),(cos(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1))+cos(this.bodyAngles[0])*this.width/2,1))
            //left arm
            this.tubes.push(new tube(this.joints[0],1,6.25,[arms[0],arms[1]],this,false))
            //right arm
            this.tubes.push(new tube(this.joints[1],1,6.25,[arms[2],arms[3]],this,false))
            //arm tubes on tubes
            this.joints.push(new joint(false,this.tubes[0].connectX,this.tubes[0].connectY,this.tubes[0].connectZ,1))
            this.joints.push(new joint(false,this.tubes[1].connectX,this.tubes[1].connectY,this.tubes[1].connectZ,1))
            this.tubes.push(new tube(this.joints[2],1,6.25,[arms[4],arms[5]],this,false))
            this.tubes.push(new tube(this.joints[3],1,6.25,[arms[6],arms[7]],this,false))
            this.joints.push(new joint(false,this.tubes[2].connectX,this.tubes[2].connectY,this.tubes[2].connectZ,1))
            this.joints.push(new joint(false,this.tubes[3].connectX,this.tubes[3].connectY,this.tubes[3].connectZ,1))
            this.ellipsoids.push(new ballPart(this.joints[4],this,"hand"))
            this.ellipsoids.push(new ballPart(this.joints[5],this,"hand"))
            //neck and head
            this.joints.push(new joint(false,-sin(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2),-sin(this.bodyAngles[1])*(this.height*0.35/2),cos(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2),0.5))
            this.tubes.push(new tube(this.joints[6],1.25,2,[0,90],this,false))
            this.joints.push(new joint(false,this.tubes[4].connectX,this.tubes[4].connectY,this.tubes[4].connectZ,1))
            this.ellipsoids.push(new ballPart(this.joints[7],this,"head"))
            //legs
            this.joints.push(new joint(this.jerseyColor,sin(this.bodyAngles[0]+180)*(this.width/2-1)+(-sin(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2)),(sin(this.bodyAngles[1])*(this.height*0.35/2)),(cos(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2))+cos(this.bodyAngles[0]+180)*(this.width/2-1),1))
            this.joints.push(new joint(this.jerseyColor,sin(this.bodyAngles[0])*(this.width/2-1)+(-sin(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2)),(sin(this.bodyAngles[1])*(this.height*0.35/2)),(cos(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2))+cos(this.bodyAngles[0])*(this.width/2-1),1))
            this.tubes.push(new tube(this.joints[8],1,7,[legs[0],legs[1]],this,false))
            this.tubes.push(new tube(this.joints[9],1,7,[legs[2],legs[3]],this,false))
            this.tubes.push(new tube(this.joints[8],1.25,6.5,[legs[0],legs[1]],this,this.jerseyColor))
            this.tubes.push(new tube(this.joints[9],1.25,6.5,[legs[2],legs[3]],this,this.jerseyColor))
            this.joints.push(new joint(false,this.tubes[5].connectX,this.tubes[5].connectY,this.tubes[5].connectZ,1.15))
            this.joints.push(new joint(false,this.tubes[6].connectX,this.tubes[6].connectY,this.tubes[6].connectZ,1.15))
            this.tubes.push(new tube(this.joints[10],1,5.5,[legs[4],legs[5]],this,false))
            this.tubes.push(new tube(this.joints[11],1,5.5,[legs[6],legs[7]],this,false))
            this.tubes.push(new tube(new joint(false,this.tubes[9].connectX,this.tubes[9].connectY,this.tubes[9].connectZ,0.5),1,2,[legs[4],legs[5]],this,"white"))
            this.tubes.push(new tube(new joint(false,this.tubes[10].connectX,this.tubes[10].connectY,this.tubes[10].connectZ,0.5),1,2,[legs[6],legs[7]],this,"white"))
            //this.joints.push(new joint("white",this.tubes[11].connectX,this.tubes[11].connectY,this.tubes[11].connectZ,1))
            //this.tubes.push(new tube(this.joints[12],1,4.5,[90,0],this,"blue"))

        }
        this.setActions()
        this.createBIGBACKBody(this.shootingForm.positions[1]);
        this.drawFace=function(type,radius,x,y,z,color){
            //translate(this.x,this.y,this.z)
            stroke(color)
            strokeWeight(4.5*((0.95)**(distBetweenPoints(cameraPos[0],cameraPos[1],cameraPos[2],x,y,z)/30)))
            for(let d1=0;d1<=45;d1++){
                for(let d2=0;d2<=45;d2++){
                    if(type==1){
                        if((d2>=360/8||d2<=90/8)&&(d1>120/8&&d1<240/8)){
                            point(x+cos(d1*8)*(cos(d2*8)*radius),y-sin(d2*8)*radius,z-sin(d1*8)*(cos(d2*8)*radius))
                        }
                    }
                    if(type==2){
                        if(-sin(d2*8)*radius<-2.5&&cos(d1*8)*(cos(d2*8)*radius)<1.2){
                            point(x+cos(d1*8)*(cos(d2*8)*radius),y-sin(d2*8)*radius,z-sin(d1*8)*(cos(d2*8)*radius))
                        }
                    }
                    if(type==3){
                        //point((d1+d2)-10,-((1/2*(d1+d2-10))+10),0)
                        if(-((2*(x+cos(d1*8)*(cos(d2*8)*radius)))+10)-(y-sin(d2*8)*radius)>0&&cos(d1*8)*(cos(d2*8)*radius)<1.2&&cos(d1*8)*(cos(d2*8)*radius)>-1.5&&-sin(d2*8)*radius>-2.5&&-sin(d2*8)*radius<-1){
                            point(x+cos(d1*8)*(cos(d2*8)*radius),y-sin(d2*8)*radius,z-sin(d1*8)*(cos(d2*8)*radius))
                        }
                    }
                    if(type==4){
                        //((((z-sin(d1*8)*(cos(d2*8)*radius))-0)**2)/((sin(120)-sin(240))*radius/2))
                        if(((((z-sin(d1*8)*(cos(d2*8)*radius))-0)**2)/((sin(120)-sin(240))*radius))+(((-sin(d2*8)*radius)**2)/((sin(0)-sin(350))*radius))<1){
                            if(cos(d1*8)*(cos(d2*8)*radius)<0){
                                point(x+cos(d1*8)*(cos(d2*8)*radius),y-sin(d2*8)*radius,z-sin(d1*8)*(cos(d2*8)*radius))
                            }
                        }
                    }
                    if(type==5){
                        if(-sin(d2*8)*radius>1.5&&cos(d1*8)*(cos(d2*8)*radius)>0.3){
                            point(x+cos(d1*8)*(cos(d2*8)*radius),y-sin(d2*8)*radius,z-sin(d1*8)*(cos(d2*8)*radius))
                        }
                    }
                    if(type==6){
                        //face
                        strokeWeight(4*((0.95)**(distBetweenPoints(cameraPos[0],cameraPos[1],cameraPos[2],x,y,z)/30)))
                        stroke(color)
                        if((d2==4&&d1==4)||(d2==4&&d1==41)){
                            if(d1==41){
                            point(x+cos(d1*8)*(cos(d2*8)*radius),y-sin(d2*8)*radius,z-sin(d1*8)*(cos(d2*8)*radius)+0.15)
                            }
                            if(d1==4){
                                point(x+cos(d1*8)*(cos(d2*8)*radius),y-sin(d2*8)*radius,z-sin(d1*8)*(cos(d2*8)*radius)-0.15)
                            }
                            //translate(x+cos(d1*8)*(cos(d2*8)*radius),y-sin(d2*8)*radius,z-sin(d1*8)*(cos(d2*8)*radius))
                            //translate(-(x+cos(d1*8)*(cos(d2*8)*radius)),-(y-sin(d2*8)*radius),-(z-sin(d1*8)*(cos(d2*8)*radius)))
                        }
                        if(d2==44 && (d1<4||d1>41)){
                            point(x+cos(d1*8)*(cos(d2*8)*radius),y-sin(d2*8)*radius,z-sin(d1*8)*(cos(d2*8)*radius)+0.15)
                        }
                        //stroke(232, 174, 107)
                        stroke(194, 153, 107)
                        if(d1==0&&d2<=3&&d2>1){
                            point(x+cos(d1*8)*(cos(d2*8)*radius),y-sin(d2*8)*radius,z-sin(d1*8)*(cos(d2*8)*radius)+0.15)
                        }
                        strokeWeight(6*((0.95)**(distBetweenPoints(cameraPos[0],cameraPos[1],cameraPos[2],x,y,z)/30)))
                        if(d1==0&&d2==2){
                            point(x+cos(d1*8)*(cos(d2*8)*radius),y-sin(d2*8)*radius,z-sin(d1*8)*(cos(d2*8)*radius)+0.15)
                        }
                    }
                }
            }
            strokeWeight(1)
            noStroke()
            //translate(-this.x,-this.y,-this.z)
        }
        this.drawBody=function(){
            //draw chest
            translate(this.x,this.y,this.z);
                //strokeWeight(5)
                //point(0,0,0)
                //point(0,-4,0)
                translate(-sin(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1),-sin(this.bodyAngles[1])*(this.height*0.35/2-1),cos(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1))
                    //stroke("black")
                    //point(0,0,0)
                    //stroke("green")
                    //point(sin(this.bodyAngles[0]+180)*this.width/2,0,cos(this.bodyAngles[0]+180)*this.width/2)
                    //point(sin(this.bodyAngles[0])*this.width/2,0,cos(this.bodyAngles[0])*this.width/2)
                    strokeWeight(1)
                translate(sin(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1),sin(this.bodyAngles[1])*(this.height*0.35/2-1),-cos(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1))

                //translate(sin(this.bodyAngles[0])*this.width/2+(-sin(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1)),(-sin(this.bodyAngles[1])*(this.height*0.35/2-1)),(cos(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1))+cos(this.bodyAngles[0])*this.width/2)
                //point(0,0,0)
            // translate(-(sin(this.bodyAngles[0])*this.width/2+(-sin(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1))),-((-sin(this.bodyAngles[1])*(this.height*0.35/2-1))),-((cos(this.bodyAngles[0])*cos(this.bodyAngles[1])*(this.height*0.35/2-1))+cos(this.bodyAngles[0])*this.width/2))
                noStroke()
                rotateY(-180+this.bodyAngles[0])
                    rotateZ(90-this.bodyAngles[1])
                        //stroke("black")
                        //fill(232, 185, 132)
                        fill(this.jerseyColor)
                        translate(1.4,0,0)
                            rotateY(90)
                                image(jerseyBack,-(this.width*(1102/1384)-2)/2,-(this.height*0.35*(628/1016))/1.5,this.width*(1102/1384)-2,this.height*0.35*688/1016)
                            rotateY(-90)
                        translate(-1.4,0,0)   

                        translate(-1.4,0,0)
                            rotateY(90)
                                image(jerseyFront,-this.width*(524/1018)/2,-this.height*0.35*(898/1386)/1.5,this.width*(524/1018),this.height*0.35*(898/1386))
                            rotateY(-90)
                        translate(1.4,0,0)
                        box(2,this.height*0.35,this.width)
                    rotateZ(-90+this.bodyAngles[1])
                rotateY(180-this.bodyAngles[0])

                //draw all joints and tubes
                for(let j=0;j<this.joints.length;j++){
                    this.joints[j].draw();
                }
                for(let t=0;t<this.tubes.length;t++){
                    this.tubes[t].draw();
                }
                for(let h=0;h<this.ellipsoids.length;h++){
                    this.ellipsoids[h].draw();
                }
                for(let e=11;e<13;e++){
                    translate(this.tubes[e].connectX,this.tubes[e].connectY,this.tubes[e].connectZ)
                        if(e==11){
                            rotateY(this.shoeAngle+this.bodyAngles[0])
                        }else{
                            rotateY(this.bodyAngles[0]-this.shoeAngle)
                        }
                        rotateX(90)
                        translate(-3.25,-2.5,-1.75)
                            fill("blue")
                            //sphere(2)
                            model(shoe)
                            fill("white")
                            model(lace)
                            noFill()
                        translate(3.25,2.5,1.75)
                        rotateX(-90)
                        if(e==11){
                            rotateY(-(this.shoeAngle+this.bodyAngles[0]))
                        }else{
                            rotateY(-(this.bodyAngles[0]-this.shoeAngle))
                        }
                    translate(-this.tubes[e].connectX,-this.tubes[e].connectY,-this.tubes[e].connectZ)
                }
                translate(this.joints[7].x,this.joints[7].y-(((this.height*0.14)-1.5)/2),this.joints[7].z)
                    rotateY(this.bodyAngles[0])
                    stroke(232, 185, 132)
                    translate(0,0,-((this.height*0.14)-1.5))
                    ellipsoid(0.15,0.5,0.25)
                    translate(0,0,2*((this.height*0.14)-1.5))
                    ellipsoid(0.15,0.5,0.25)
                    translate(0,0,-((this.height*0.14)-1.5))
                    noStroke()
                    rotateY(-this.bodyAngles[0])
                translate(-this.joints[7].x,-(this.joints[7].y-(((this.height*0.14)-1.5)/2)),-(this.joints[7].z))
                rotateY(this.bodyAngles[0])
                this.drawFace(1,(this.height*0.14)-1.5,this.joints[7].x,this.joints[7].y-(((this.height*0.14)-1.5)/2),this.joints[7].z,color(91,72,70))
                this.drawFace(2,(this.height*0.14)-1.5,this.joints[7].x,this.joints[7].y-(((this.height*0.14)-1.5)/2),this.joints[7].z,color(91,72,70))
                this.drawFace(3,(this.height*0.14)-1.5,this.joints[7].x,this.joints[7].y-(((this.height*0.14)-1.5)/2),this.joints[7].z,color(91,72,70))
                this.drawFace(4,(this.height*0.14)-1.5,this.joints[7].x,this.joints[7].y-(((this.height*0.14)-1.5)/2),this.joints[7].z,color(91,72,70))
                this.drawFace(5,(this.height*0.14)-1.5,this.joints[7].x,this.joints[7].y-(((this.height*0.14)-1.5)/2),this.joints[7].z,color(91,72,70))
                this.drawFace(6,(this.height*0.14)-1.5,this.joints[7].x,this.joints[7].y-(((this.height*0.14)-1.5)/2),this.joints[7].z,"black")
                rotateY(-this.bodyAngles[0])
            translate(-this.x,-this.y,-this.z);
            //(150,118,93)
        }
        this.normalizeY=function(height){
            if(this.tubes[11].connectY>this.tubes[12].connectY){
                this.y=-(this.tubes[11].connectY+2);
            }else{
                this.y=-(this.tubes[12].connectY+2);
            }
            this.y+=height;
        }
    }
    function joint(color,x,y,z,radius){
        this.x=x;
        this.y=y;
        this.z=z;
        this.color=color;
        this.radius=radius;
        this.draw=function(){
            if(this.color!==false){
                stroke(this.color)
            }else{
                stroke(232, 185, 132)
            }
            strokeWeight(0.15)
            translate(this.x,this.y,this.z);
            if(this.radius<=1){
            sphere(this.radius);
            }else{
                //translate(-5,0,0)
                ellipsoid(this.radius,1,1)
                //translate(5,0,0)
            }
            translate(-this.x,-this.y,-this.z);
            strokeWeight(1)
            noStroke()
        }
    }
    function tube(joint,radius,length,angles,body,color){
        this.joint=joint
        this.radius=radius
        this.length=length
        this.angles=[angles[0]+body.bodyAngles[0],angles[1]+body.bodyAngles[1]-90]
        this.color=color
        this.connectX=this.joint.x+sin(this.angles[0])*cos(this.angles[1])*this.length
        this.connectY=this.joint.y-sin(this.angles[1])*this.length
        this.connectZ=this.joint.z+cos(this.angles[0])*cos(this.angles[1])*this.length
        this.draw=function(){
           // stroke("black")
            //point(this.connectX,this.connectY,this.connectZ)
            noStroke()
            if(this.color!==false){
                fill(this.color)
            }else{
                fill(232, 185, 132)
            }
            translate((this.joint.x+sin(this.angles[0])*cos(this.angles[1])*this.length/2),(this.joint.y-sin(this.angles[1])*this.length/2),(this.joint.z+cos(this.angles[0])*cos(this.angles[1])*this.length/2));
            rotateY(-180+this.angles[0])
            rotateX(90-this.angles[1])
            cylinder(this.radius,this.length);
            rotateX(-90+this.angles[1])
            rotateY(180-this.angles[0])
            //translate(-(this.joint.x+cos(this.angles[0])*cos(this.angles[1])*this.length/2),-(this.joint.y-sin(this.angles[1])*this.length/2),-(this.joint.z-sin(this.angles[0])*cos(this.angles[1])*this.length/2));
            translate(-(this.joint.x+sin(this.angles[0])*cos(this.angles[1])*this.length/2),-(this.joint.y-sin(this.angles[1])*this.length/2),-(this.joint.z+cos(this.angles[0])*cos(this.angles[1])*this.length/2));
        }
    }
    function ballPart(joint,body,type){
        this.joint=joint
        this.body=body
        this.type=type
        //this.radius=radius
        this.draw=function(){
            translate(this.joint.x,this.joint.y,this.joint.z)
            if(this.type=="head"){
                translate(0,-((this.body.height*0.14)-1.5)/2,0)
                ellipsoid((this.body.height*0.14)-1.5)
            }
            if(this.type=="hand"){
                fill(232, 185, 132)
                ellipsoid(1.5,1.3,1.5)
            }
            if(this.type=="head"){
                translate(0,((this.body.height*0.14)-1.5)/2,0)
            }
            translate(-this.joint.x,-this.joint.y,-this.joint.z)
        }
    }
    function action(positions){
        this.positions=positions
        this.actionGoing=false
        this.actionStopped=false
        this.actionStart=0
        this.currentAction=0
        this.positionTransition=function(body,pos1,pos2,actionTime,hasBall){
            let body1;
            let body2;
            if((this.currentAction-this.actionStart)<=actionTime&&!this.actionStopped){
                let returnPos=new position([],[],[]);
                for(let i=0;i<pos1.arms.length;i++){
                    returnPos.arms[i]=lerp(pos1.arms[i],pos2.arms[i],(this.currentAction-this.actionStart)/actionTime)
                }
                for(let i2=0;i2<pos1.legs.length;i2++){
                    returnPos.legs[i2]=lerp(pos1.legs[i2],pos2.legs[i2],(this.currentAction-this.actionStart)/actionTime)
                }  
                if(pos1.updateBody){
                    body1=-atan((0-body.z)/(courtLength/2-body.x))
                }else{
                    body1=pos1.body[0]
                }
                if(pos2.updateBody){
                    body2=-atan((0-body.z)/(courtLength/2-body.x))
                }else{
                    body2=pos2.body[0]
                }
                returnPos.body[0]=lerp(body1,body2,(this.currentAction-this.actionStart)/actionTime)
                returnPos.body[1]=90
                curry.hasBall=hasBall
                return returnPos
            }else{
                this.actionStopped=true
                if(curry.action=="shooting"){
                    if(curry.madeShot){
                        distOut=random()
                        angleOut=random()*360
                    }else{
                        distOut=1.5+(random()*1.5)
                        angleOut=135+random()*270
                    }
                    if(!curry.bank){
                        ball.path=new parabola(calc.adaptToParab(new coordinate(ball.x,ball.y,ball.z)),
                    calc.adaptToParab(new coordinate(ball.x-20,ball.y-50,ball.z+20)),
                    calc.adaptToParab(new coordinate(courtLength/2-4+sin(angleOut)*distOut,-50,cos(angleOut)*distOut)))
                    }else{
                        ball.path=new parabola(calc.adaptToParab(new coordinate(ball.x,ball.y,ball.z)),
                    calc.adaptToParab(new coordinate(ball.x-20,ball.y-50,ball.z+20)),
                    calc.adaptToParab(new coordinate(courtLength/2-2,-55,0)))
                    }
                    ballRelease=millis();
                }
                return pos2
            }
        }
    }
    function position(arms,legs,body,updateBodyAngle){
        this.arms=arms;
        this.legs=legs;
        this.body=body;
        this.updateBody=updateBodyAngle;
    }
    function basketball(x,y,z,radius){
        this.x=x;
        this.y=y;
        this.z=z;
        this.radius=radius;
        this.path=false;
        this.dist=0
        this.xRotation=0;
        this.yRotation=0;
        this.zRotation=0;
        this.draw=function(pointTranslated,body){
            //pointTranslated is if the ball is drawn inside the body main loop
            if(pointTranslated){
                translate(-body.x,-body.y,-body.z)
            }
            translate(this.x,this.y,this.z)
            //stroke(210,118,69)
            rotateX(this.xRotation)
            rotateY(this.yRotation)
            rotateZ(this.zRotation)
                rotateX(-90)
                rotateZ(-90)
                texture(shoutOutToMyManJakeForShowingMeWhatTextureIsCameInSoCLUTCH)
                noStroke()
                sphere(this.radius)
                rotateZ(-90)
                rotateX(90)
            rotateX(-this.xRotation)
            rotateY(-this.yRotation)
            rotateZ(-this.zRotation)
            translate(-this.x,-this.y,-this.z)
            if(pointTranslated){
                translate(body.x,body.y,body.z)
            }
        }
        this.snapToHand=function(body,handNum){
            this.x=body.ellipsoids[handNum-1].joint.x+body.x
            this.y=body.ellipsoids[handNum-1].joint.y+body.y
            this.z=body.ellipsoids[handNum-1].joint.z+body.z
            this.x+=cos(body.ballHandDir)*(this.radius)
            this.y-=sin(body.ballHandDir)*(this.radius)
        }
    }
    function coordinate(x,y,z){
        this.x=x;
        this.y=y;
        this.z=z;
    }
    function parabola(coord1,coord2,coord3){
        //equations fully work w/ rotation over all 3 axes (borrowed from my baseball program)
        //https://www.desmos.com/3d/d73ef88a7a for graph I made
        //z in this parabola is -y, while y is x and x is -z  
        //setting vars
        this.origin_x=coord1.x
        this.origin_y=coord1.y
        this.z_origin=coord1.z;
        this.x1=coord2.x;
        this.y1=coord2.y;
        this.inputz1=coord2.z;
        this.x2=coord3.x;
        this.y2=coord3.y;
        this.z2=coord3.z;
        this.randoms=[];
        //calcing new vars
        this.initialize=function(){
            this.dist2=abs(this.realdist(this.x2,this.y2))
            this.angle=this.findangle(this.origin_x,this.origin_y,this.x2,this.y2);
            this.mult=this.angle/abs(this.angle);
            this.incline=this.arctan(0,this.z_origin,this.dist2,this.z2)
            this.randoms=[random(),random()]
            this.tilt=90+(-0.5+(this.randoms[1]))
            this.dist1=this.dist2/2
            this.z1=(this.z_origin+(tan(this.mult*this.incline)*this.realdist(this.calcX(this.dist1),this.calcY(this.dist1)))+40+(15*this.randoms[0]))*1

            this.dist2=abs(this.realdist(this.x2,this.y2))
            //slope incline thing
            //tan(this.incline*this.mult)*this.realdist(this.weirdpoint(this.x,this.y).x,this.weirdpoint(this.x,this.y).y)+this.z_origin
            
        }  
        this.update=function(coord1,coord2,coord3){
            this.origin_x=coord1.x
            this.origin_y=coord1.y
            this.z_origin=coord1.z;
            this.x1=coord2.x;
            this.y1=coord2.y;
            this.inputz1=coord2.z;
            this.x2=coord3.x;
            this.y2=coord3.y;
            this.z2=coord3.z;
            this.initialize();
        } 
        this.finalquadequation=function(pdist){
            if(pdist>this.dist2){
                pointdist=this.dist2
            }else{
                pointdist=pdist
            }
            return this.tiltpoint(this.calcX(this.incdist(pointdist)),this.calcY(this.incdist(pointdist)),this.incheight(pointdist)+this.z_origin,-(90-this.tilt))
        }
        this.adaptToParab=function(coord){
            return new coordinate(-coord.z,coord.x,-coord.y)
        }
        this.adaptFromParab=function(coord){
            return new coordinate(coord.y,-coord.z,-coord.x)
        }
        this.denom=function(a1,a2,a3){
            return (a1.x-a2.x)*(a1.x-a3.x)*(a2.x-a3.x)
        }
        this.aQuad=function(a1,a2,a3){
            return (a3.x*(a2.y-a1.y)+a2.x*(a1.y-a3.y)+a1.x*(a3.y-a2.y))/this.denom(a1,a2,a3)
        }
        this.bQuad=function(a1,a2,a3){
            return ((a3.x**2)*(a1.y-a2.y)+(a2.x**2)*(a3.y-a1.y)+(a1.x**2)*(a2.y-a3.y))/this.denom(a1,a2,a3)
        }
        this.cQuad=function(a1,a2,a3){
            return (a2.x*a3.x*(a2.x-a3.x)*a1.y+a3.x*a1.x*(a3.x-a1.x)*a2.y+a1.x*a2.x*(a1.x-a2.x)*a3.y)/this.denom(a1,a2,a3)
        }
        this.quadequation=function(a1,a2,a3,x,y){
            return (this.aQuad(a1,a2,a3)*(this.realdist(x,y))**2)+(this.bQuad(a1,a2,a3)*(this.realdist(x,y)*(abs(this.unzero(this.angle,0))/this.unzero(this.angle,0))))+this.cQuad(a1,a2,a3);
        
        }        
        this.flatequation=function(x,y){
            return this.quadequation(new coordinate(0,this.z_origin),new coordinate(cos(this.findangle(0,this.z_origin,this.dist1,this.z1)-this.incline)*this.absdist(0,this.z_origin,this.dist1,this.z1),(sin(this.findangle(0,this.z_origin,this.dist1,this.z1)-this.incline)*this.absdist(0,this.z_origin,this.dist1,this.z1))+this.z_origin), new coordinate(abs(this.absdist(0,this.z_origin,this.dist2,this.z2)),this.z_origin),x,y);
        }
        this.unzero=function(x,y){
            if(x==y){
                return 1
            }else{
                return x;
            }
        }
        this.tiltangle=function(x,y){
            return 180+this.findangle(this.x1,this.y1,this.weirdpoint(this.x1,this.y1).x,this.weirdpoint(this.x1,this.y1).y)
        }
        this.incdist=function(pointdist){
           return cos(this.findangle(0,this.z_origin,pointdist,this.flatequation(this.calcX(pointdist),this.calcY(pointdist)))+this.incline)*this.absdist(0,this.z_origin,pointdist,this.flatequation(this.calcX(pointdist),this.calcY(pointdist)))
        }
        this.incheight=function(pointdist){
            return sin(this.findangle(0,this.z_origin,pointdist,this.flatequation(this.calcX(pointdist),this.calcY(pointdist)))+this.incline)*this.absdist(0,this.z_origin,pointdist,this.flatequation(this.calcX(pointdist),this.calcY(pointdist)))
         }
        this.tiltpoint=function(x,y,z,angle1){
            return(new coordinate(cos(this.tiltangle(x,y))*(this.verticaldistancetilt(x,y,z)*cos(this.realtiltangle(x,y,z,angle1)))+this.weirdpoint(x,y).x,sin(this.tiltangle(x,y))*(this.verticaldistancetilt(x,y,z)*cos(this.realtiltangle(x,y,z,angle1)))+this.weirdpoint(x,y).y,(this.verticaldistancetilt(x,y,z)*sin(this.realtiltangle(x,y,z,angle1)))+this.z_origin+(tan(this.incline*this.mult)*this.realdist(this.weirdpoint(x,y).x,this.weirdpoint(x,y).y))))
            //return new coordinate(cos(this.tiltangle)(this.verticaldistancetilt(x,y,z)*cos(this.realtiltangle(x,y,z,angle1)))+weirdpoint(x,y).x,sin(this.tiltangle)(this.verticaldistancetilt(x,y,z)*cos(this.realtiltangle(x,y,z,angle1)))+weirdpoint(x,y).y,this.verticaldistancetilt(x,y,z)*sin(this.realtiltangle(x,y,z,angle1))+this.z_origin+tan(this.incline*this.mult)*this.realdist(this.weirdpoint(this.x,this.y).x,this.weirdpoint(this.x,this.y).y))
        }
        this.verticaldistancetilt=function(x,y,z){
            return this.absdist(0,this.z_origin+tan(this.incline*this.mult)*this.realdist(this.weirdpoint(x,y).x,this.weirdpoint(x,y).y),this.distancetilt(x,y),z)
        }
        this.distancetilt=function(x,y){
            return this.absdist(x,y,this.weirdpoint(x,y).x,this.weirdpoint(x,y).y);
        }
        
        this.findangle=function(px1,py1,px2,py2){
            if(px2-px1==0){
                if(py2>=py1){
                    return 90;
                }else{
                    return -90;
                }
            }else{
                return this.arctan(px1,py1,px2,py2);
            }
        }
        this.arctan=function(px1,py1,px2,py2){
            if(px2<px1 &&py2<py1){
                return atan((py2-py1)/(px2-px1))-180
            }else if(px2<px1){
                return atan((py2-py1)/(px2-px1))+180
            }else{
                return atan((py2-py1)/(px2-px1))
            }
        }
        this.realdist=function(x,y){
            var answer= sqrt(((x-this.origin_x)**2)+((y-this.origin_y)**2))
            if(y-this.origin_y<0){
                answer*=-1
            }
            return answer;
        }
        this.weirdpoint=function(x,y){
            return new coordinate((this.transformxy(0,this.transformxy(x-this.origin_x,y-this.origin_y,90-this.angle,0).y,-(90-this.angle),0)).x+this.origin_x,(this.transformxy(0,this.transformxy(x-this.origin_x,y-this.origin_y,90-this.angle,0).y,-(90-this.angle),0)).y+this.origin_y,0)
        }
        this.transformxy=function(x,y,angle1,z){
            return new coordinate(cos(this.realangle(x,y,angle1,z))*this.absdist(0,z,x,y),sin(this.realangle(x,y,angle1,z))*this.absdist(0,z,x,y),0)
        }
        this.realtiltangle=function(x,y,z,angle1){
            return this.findangle(0,this.z_origin+tan(this.incline*this.mult)*this.realdist(this.weirdpoint(x,y).x,this.weirdpoint(x,y).y),this.distancetilt(x,y),z)+angle1
        }
        this.realangle=function(x,y,angle1,z){
            return (this.findangle(0,z,x,y)+angle1)
        }
        this.absdist=function(px1,py1,px2,py2){
            return sqrt(((px2-px1)**2)+((py2-py1)**2))
        }
        this.calcX=function(distance){
            return (cos(this.angle)*distance)+this.origin_x;
        }
        this.calcY=function(distance){
            return (sin(this.angle)*distance)+this.origin_y;
        }
        this.initialize();
    }
    function Shot(r){
        this.row=r
        this.x=rows[this.row].getString("LOC_X")/50*courtWidth;
        this.y=rows[this.row].getString("LOC_Y")/100*courtLength;
        this.height=1
        this.radius=1.5
        this.made=rows[this.row].getString("SHOT_MADE")
        this.time=int(rows[this.row].getString("MINS_LEFT"))*60+int(rows[this.row].getString("SECS_LEFT"))
        if(rows[this.row].getString("HOME_TEAM")=="GSW"){
            this.gsw="HOME"
            this.notGSW="AWAY"
        }else{
            this.gsw="AWAY"
            this.notGSW="HOME"
        }
        if(this.gsw=="AWAY"){
            this.pointsFor=rows[this.row].getString("Points Away")
            this.pointsAgainst=rows[this.row].getString("Points Home")
        }else{
            this.pointsAgainst=rows[this.row].getString("Points Away")
            this.pointsFor=rows[this.row].getString("Points Home")
        }
        if(this.made=="TRUE"){
            this.pointsFor-=3;
            this.height+=1;
        }
        this.drawHeight=this.height;

        this.cameraLength=(cameraPos[1]-(-this.height*2))/sin(cameraDir[1]);
        // x is the vertical distance from the center of the court
        //y is the horizontal distance from the right sideline
        this.getTimeLeft=function(mins,time){
            if(mins){
                return floor(time/60)
            }else{
                return time % 60
            }
        }
        this.distanceFromCrosshair=function(){
            //cameraPos[0]+cos(cameraDir[0])*(cos(cameraDir[1])*cameraScope)
            //cameraPos[1]-sin(cameraDir[1])*cameraScope
            //cameraPos[2]-sin(cameraDir[0])*(cos(cameraDir[1])*cameraScope)
            //cameraPos[1]-sin(cameraDir[1])*cameraLength=(this.y+this.height/2)
            this.cameraLength=(cameraPos[1]-(-this.height*2))/sin(cameraDir[1])
            if(curry.action=="none"){
                return(distBetweenPts(cameraPos[0]+cos(cameraDir[0])*(cos(cameraDir[1])*this.cameraLength),cameraPos[2]-sin(cameraDir[0])*(cos(cameraDir[1])*this.cameraLength),courtLength/2-this.y,-this.x))
            }else{
                return 100
            }
        }
        this.r=function(string){
            return rows[this.row].getString(string); 
        }
        this.withinFilters=function(){
            if(dropdowns.length==9){
                if(dropdowns[0].inSelection(0)||(this.made=="TRUE"&&dropdowns[0].inSelection(1))||(this.made=="FALSE"&&dropdowns[0].inSelection(2))){
                    if(dropdowns[1].inSelection(0)||dropdowns[1].inSelection(getIndex(dropdowns[1].options,this.r("ZONE_NAME")))){
                        if(dropdowns[2].inSelection(0)||(dropdowns[2].inSelection(1)&&int(this.r("SHOT_DISTANCE"))>int(dropdowns[2].textBoxes[0].value))){
                            if(dropdowns[3].inSelection(0)||(dropdowns[3].inSelection(1)&&this.r("QUARTER")=="1")||(dropdowns[3].inSelection(2)&&this.r("QUARTER")=="2")||
                            (dropdowns[3].inSelection(4)&&this.r("QUARTER")=="3")||(dropdowns[3].inSelection(5)&&this.r("QUARTER")=="4")||(dropdowns[3].inSelection(7)&&int(this.r("QUARTER"))>4)||
                            (dropdowns[3].inSelection(3)&&(this.r("QUARTER")=="1"||this.r("QUARTER")=="2"))||(dropdowns[3].inSelection(6)&&(this.r("QUARTER")=="3"||this.r("QUARTER")=="4"))){
                                if(dropdowns[4].inSelection(0)||(dropdowns[4].inSelection(2)&&int(this.r("MINS_LEFT"))*60+int(this.r("SECS_LEFT"))==0)||(dropdowns[4].inSelection(1)&&int(this.r("MINS_LEFT"))*60+int(this.r("SECS_LEFT"))<int(dropdowns[4].textBoxes[0].value)*60+int(dropdowns[4].textBoxes[1].value))){
                                    if(dropdowns[5].inSelection(0)||(dropdowns[5].inSelection(2)&&abs(this.pointsFor-this.pointsAgainst)<=3)||(dropdowns[5].inSelection(1)&&abs(this.pointsFor-this.pointsAgainst)<int(dropdowns[5].textBoxes[0].value))){
                                        if(dropdowns[6].inSelection(0)||dropdowns[6].inSelection(getIndex(shotTypes,this.r("ACTION_TYPE")))){
                                            if(dropdowns[7].inSelection(0)||(this.gsw=="HOME"&&dropdowns[7].inSelection(1))||(this.gsw=="AWAY"&&dropdowns[7].inSelection(2))){
                                                if(dropdowns[8].inSelection(0)||dropdowns[8].inSelection(getIndex(teamsSelection,this.r(this.notGSW+"_TEAM")))){
                                                    return true;
                                                }else{
                                                    return false;
                                                }
                                            }else{
                                                return false
                                            }
                                        }else{
                                            return false;
                                        }
                                    }else{
                                        return false;
                                    }
                                }else{
                                    return false;
                                }
                            }else{
                                return false;
                            }
                        }else{
                            return false;
                        }
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }else{
                return true
            }
        }
        this.draw=function(overPoints){
            if(this.made=="TRUE"){
                if(this.distanceFromCrosshair()<=this.radius+2){
                    stroke(221, 245, 2)
                    //stroke(114,243,74)
                    strokeWeight(1)
                    this.drawHeight=this.height+2;
                    //shotsUsed.push(this.row);
                }else{
                    if(overPoints){
                        //fill("green")
                        stroke(114,243,74,50)
                    }else{
                        //fill("green")
                        stroke(114,243,74)
                    }
                    this.drawHeight=this.height;
                }
            }else{
                if(this.distanceFromCrosshair()<=this.radius+2){
                    stroke(247, 119, 119)
                    //stroke(169,35,23)
                    strokeWeight(1)
                    this.drawHeight=this.height+2;
                    //shotsUsed.push(this.row);
                }else{
                    if(overPoints){
                        //fill("red")
                        stroke(169,35,23,50)
                    }else{
                        //fill("red")
                        stroke(169,35,23)
                    }
                    this.drawHeight=this.height;
                }
            }
            translate(-(this.y),-this.drawHeight/2,-this.x)
            cylinder(this.radius,this.drawHeight)
            translate(this.y,this.drawHeight/2,this.x)
        }
    }
    function getIndex(list,item){
        for(let i=0;i<list.length;i++){
            if(item==list[i]){
                return i;
            }
        }
        return false;
    }
    function loadShots(){
        for(let r=0;r<rows.length;r++){
            shots.push(new Shot(r))
        }
    }
    function drawShotMap(){
        shotsSelected=[]
        //shotsUsed=[]
        crosshairOverPoints=false;
        for(let shot=0;shot<shots.length;shot++){
            if(shots[shot].withinFilters()){
                if(shots[shot].distanceFromCrosshair()<=shots[shot].radius+2){
                    crosshairOverPoints=true;
                    shotsSelected.push(shots[shot].row);
                }
            }
        }
        translate(courtLength/2,0,0)
        for(let s=0;s<shots.length;s++){
            if(shots[s].withinFilters()&&(curry.action=="none"||shotAnimating==s)){
                shots[s].draw(crosshairOverPoints)
            }
        }
        //console.log(shotsSelected,shotsUsed)
        translate(-courtLength/2,0,0)
    }
    if(frame==0){
        curry=new Body(0,-50,0,8,31.25)
        ball=new basketball(courtLength/2-5,-50,0,2.25)
        calc=new parabola(new coordinate(0,0,0),new coordinate(0,0,0),new coordinate(0,0,0))
        loadShots();
    }
    setUpMap()
    //curry.createBIGBACKBody(curry.shootingForm.positions[2])

    if(curry.action=="none"){
        curry.createBIGBACKBody(curry.shootingForm.positions[4])
        curry.hasBall=true
    }else{
        if(curry.action=="loading"||curry.action=="idling"||curry.action=="shooting"||curry.action=="releasing"||curry.action=="descending"||curry.action=="idle"){
            curryAction=curry.shootingForm
        }
        if(!curryAction.actionGoing){
            curryAction.actionStart=millis()
            curryAction.currentAction=millis()
            curryAction.actionGoing=true;
        }else{
            //total ball shooting length (milliseconds): 1000+250+350+(1000*ball.path.dist2/100)+100*(curry.bank)+500=
            //2100+(1000*distBetweenPts(-shots[shotAnimating].x,courtLength/2-shots[shotAnimating].y,0,courtLength/2)/100)+100*(curry.bank)
            //console.log(gameClock)
            if(gameClock!==false&&(curry.action=="loading"||curry.action=="idling"||curry.action=="shooting")){
                gameClock=(shots[shotAnimating].time+(2100+(1000*distBetweenPts(-shots[shotAnimating].x,courtLength/2-shots[shotAnimating].y,0,courtLength/2)/100)+100*(curry.bank))/1000)-((millis()-gameClockStart)/1000)
                if(gameClock<shots[shotAnimating].time){
                    gameClock=shots[shotAnimating].time
                    if(curry.madeShot){
                        clockStopped=true;
                    }
                }else if(gameClock>shots[shotAnimating].time){
                    clockStopped=false;
                }
            }
            if(curry.action=="loading"){
                if(!clockStarted){
                    gameClock=shots[shotAnimating].time+(2100+(distBetweenPts(-shots[shotAnimating].x,courtLength/2-shots[shotAnimating].y,0,courtLength/2)/100)+100*(curry.bank))/1000
                    gameClockStart=millis()
                    clockStarted=true;
                    clockStopped=false;
                }
                curry.createBIGBACKBody(curryAction.positionTransition(curry,curryAction.positions[4],curryAction.positions[4],1000,true))
            }else if(curry.action=="idling"){
                curry.createBIGBACKBody(curryAction.positionTransition(curry,curryAction.positions[4],curryAction.positions[0],250,true))
            }else if(curry.action=="shooting"){
                curry.createBIGBACKBody(curryAction.positionTransition(curry,curryAction.positions[0],curryAction.positions[1],350,true))
                curry.jumpHeight=-10*(curryAction.currentAction-curryAction.actionStart)/350
                if(curry.fade){
                    curry.x+=sin(curry.bodyAngles[0])/2
                    curry.z-=cos(curry.bodyAngles[0])/2
                }
            }else if(curry.action=="releasing"){
                curry.createBIGBACKBody(curryAction.positionTransition(curry,curryAction.positions[1],curryAction.positions[2],70,false))
                curry.jumpHeight=-10-(3*(curryAction.currentAction-curryAction.actionStart)/70)
                if(curry.fade){
                    curry.x+=sin(curry.bodyAngles[0])/2
                    curry.z-=cos(curry.bodyAngles[0])/2
                }
            }else if(curry.action=="descending"){
                curry.createBIGBACKBody(curryAction.positionTransition(curry,curryAction.positions[2],curryAction.positions[3],420,false))
                curry.jumpHeight=-13*(1-(curryAction.currentAction-curryAction.actionStart)/420)
                if(curry.fade){
                    curry.x+=sin(curry.bodyAngles[0]-90)/2
                    curry.z+=cos(curry.bodyAngles[0]-90)/2
                }
            }else if(curry.action=="idle"){
                curry.createBIGBACKBody(curry.shootingForm.positions[3])
                if(bounceNum>6){
                    curryAction.actionStopped=true
                    curry.x=0;
                    curry.z=0;
                    if(camera!=="false"){
                        cameraPos=[-160,-150,0]
                        cameraDir=[0,-26.2]
                    }
                }
            }
            if(curry.action=="releasing"||curry.action=="descending"||curry.action=="idle"){
                gameClock=(shots[shotAnimating].time+(2100+(1000*distBetweenPts(-shots[shotAnimating].x,courtLength/2-shots[shotAnimating].y,0,courtLength/2)/100)+100*(curry.bank))/1000)-((millis()-gameClockStart)/1000)
                if(gameClock<shots[shotAnimating].time){
                    clockStopped=true;
                    if(curry.madeShot){
                        gameClock=shots[shotAnimating].time
                    }
                }else if(gameClock>shots[shotAnimating].time){
                    clockStopped=false;
                }
                if(ball.dist<ball.path.dist2){
                    ballDownStart=millis()
                    //total time is (distBetweenPts(-shots[shotAnimating].x,courtLength/2-shots[shotAnimating].y,0,courtLength/2)/100) millis 
                    ball.dist=(ballDownStart-ballRelease)/(1000*distBetweenPts(-shots[shotAnimating].x,courtLength/2-shots[shotAnimating].y,0,courtLength/2)/100)*ball.path.dist2;
                    ball.x=calc.adaptFromParab(ball.path.finalquadequation(ball.dist)).x
                    ball.y=calc.adaptFromParab(ball.path.finalquadequation(ball.dist)).y
                    ball.z=calc.adaptFromParab(ball.path.finalquadequation(ball.dist)).z
                    ballDownCurrent=millis()
                    inHoopX=ball.x
                    inHoopY=ball.y
                    inHoopZ=ball.z
                    ball.xRotation+=random()*10
                    ball.yRotation+=random()*10
                    ball.zRotation+=random()*10
                    if(curry.bank){
                        banking=true;
                    }
                    if(ball.dist+25>ball.path.dist2&&curry.madeShot==true){
                        if(!soundPlayed){
                            swish.setVolume(0.6)
                            swish.play()
                            soundPlayed=true;
                        }
                    }else if(ball.dist+15>ball.path.dist2&&!curry.madeShot){
                        if(!soundPlayed){
                            brick.setVolume(1.5)
                            brick.play()
                            soundPlayed=true;
                        }
                    }else{
                        soundPlayed=false;
                    }
                }else{
                    if(curry.bank&&banking){
                        if(ballDownCurrent-ballDownStart<100){
                            ballDownCurrent=millis()
                            ball.x=inHoopX+((courtLength/2-4+sin(angleOut)*distOut)-inHoopX)*(ballDownCurrent-ballDownStart)/100
                            ball.z=inHoopZ+(cos(angleOut)*distOut-inHoopZ)*(ballDownCurrent-ballDownStart)/100
                            ball.y=-55+5*(ballDownCurrent-ballDownStart)/100
                            //(courtLength/2-4+sin(angleOut)*distOut,-50,cos(angleOut)*distOut)
                        }else{
                            ballDownStart=millis()
                            ballDownCurrent=millis()
                            inHoopX=ball.x
                            inHoopY=ball.y
                            inHoopZ=ball.z
                            banking=false;
                        }
                    }else{
                        if(ballDownCurrent-ballDownStart<500){
                            ballDownCurrent=millis()
                            if(curry.madeShot==true){
                                ball.x=inHoopX+(courtLength/2-4-inHoopX)*(ballDownCurrent-ballDownStart)/500
                                ball.z=inHoopZ+(0-inHoopZ)*(ballDownCurrent-ballDownStart)/500
                                ball.y=-50+(50-ball.radius-1)*(ballDownCurrent-ballDownStart)/500
                            }else{
                                ball.x=inHoopX+(sin(angleOut)*20)*(ballDownCurrent-ballDownStart)/500
                                ball.z=inHoopZ+(cos(angleOut)*20)*(ballDownCurrent-ballDownStart)/500
                                ball.y=-50+(50-ball.radius-1)*(ballDownCurrent-ballDownStart)/500
                            }
                            ball.xRotation+=random()
                            ball.yRotation+=random()
                            ball.zRotation+=random()
                        }else{
                            ballDownCurrent=millis()
                            bounceNum=floor((ballDownCurrent-ballDownStart-500)/300)
                            bounceHeight=5*((9/10)**floor(bounceNum/2))
                            if(bounceNum==0){
                                bounceNum=0.01
                            }
                            if(bounceNum/2!=round(bounceNum/2)){
                                ball.y=-ball.radius-1-(((ballDownCurrent-ballDownStart-500) % 300)/300*bounceHeight)
                            }else{
                                ball.y=-ball.radius-1-bounceHeight+(((ballDownCurrent-ballDownStart-500) % 300)/300*bounceHeight)
                                ball.xRotation+=random()*bounceHeight
                                ball.yRotation+=random()*bounceHeight
                                ball.zRotation+=random()*bounceHeight
                            }
                        }
                    }    
                }
            }
            curryAction.currentAction=millis()
            if(curryAction.actionStopped==true){
                if(curry.action=="loading"){
                    curry.action="idling"
                }else if(curry.action=="idling"){
                     curry.action="shooting"
                }else if(curry.action=="shooting"){
                    curry.action="releasing"
                }else if(curry.action=="releasing"){
                    curry.action="descending"
                }else if(curry.action=="descending"){
                    curry.action="idle"
                }else if(curry.action=="idle"){
                    shotAnimating=false;
                    clockStarted=false;
                    curry.action="none"
                    bounceNum=0;
                    ball.dist=0;
                    ball.path=false;
                }
                curryAction.actionGoing=false
                curryAction.actionStopped=false
            }
        }
    }
    curry.normalizeY(curry.jumpHeight)
    curry.drawBody()
    drawShotMap()
    if(curry.hasBall){
        ball.snapToHand(curry,2)
    }
    ball.draw(false,curry)
    if(curry.action!="none"&&cameraType!==false){
        if(cameraType!="side"){
            cameraDir[0]=curry.bodyAngles[0]
            cameraDir[1]=-12
            if(curry.action=="loading"||curry.action=="idling"||curry.action=="shooting"||curry.action=="releasing"||cameraType=="fixed"){
                cameraPos[0]=curry.x+(sin(curry.bodyAngles[0]-90)*300)
                cameraPos[2]=curry.z+(cos(curry.bodyAngles[0]-90)*300)
            }else{
                if(distBetweenPts(ball.x,ball.z,courtLength/2,0)>80){
                    cameraDir[1]=-30+distBetweenPts(ball.x,ball.z,courtLength/2,0)*0.05
                    cameraPos[0]=ball.x+(sin(curry.bodyAngles[0]-90)*(150-distBetweenPts(ball.x,ball.z,courtLength/2,0)*0.05))
                    cameraPos[2]=ball.z+(cos(curry.bodyAngles[0]-90)*(150-distBetweenPts(ball.x,ball.z,courtLength/2,0)*0.05))
                }else{
                    cameraDir[1]=-50
                    cameraPos[0]=ball.x+(sin(curry.bodyAngles[0]-90)*70)
                    cameraPos[2]=ball.z+(cos(curry.bodyAngles[0]-90)*70)
                }
            }
        }else{ 
            if(curry.z>=1){
                cameraDir[0]=85
                cameraDir[1]=-23
                cameraPos=[60, -150, 340]
            }else{
                cameraDir=[-85,-23]
                cameraPos=[60, -150, -340]
            }
        }
    }
    if(keyIsDown(UP_ARROW)){
        //cameraDir[1]+=1;
        cameraPos[0]+=cos(cameraDir[0])*moveSpeed;
        cameraPos[2]-=sin(cameraDir[0])*moveSpeed;
    }
    if(keyIsDown(DOWN_ARROW)){
        //cameraDir[1]-=1;
        cameraPos[0]-=cos(cameraDir[0])*moveSpeed;
        cameraPos[2]+=sin(cameraDir[0])*moveSpeed;
    }
    if(keyIsDown(LEFT_ARROW)){
        //cameraDir[0]+=1;
        cameraPos[0]+=cos(cameraDir[0]+90)*moveSpeed;
        cameraPos[2]-=sin(cameraDir[0]+90)*moveSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
        //cameraDir[0]-=1;
        cameraPos[0]+=cos(cameraDir[0]-90)*moveSpeed;
        cameraPos[2]-=sin(cameraDir[0]-90)*moveSpeed;
    }
    if(keyIsDown(87)){
        cameraPos[0]+=cos(cameraDir[0])*moveSpeed;
        cameraPos[2]-=sin(cameraDir[0])*moveSpeed;
    }
    if(keyIsDown(83)){
        cameraPos[0]-=cos(cameraDir[0])*moveSpeed;
        cameraPos[2]+=sin(cameraDir[0])*moveSpeed;
    }
    if(keyIsDown(65)){
        cameraPos[0]+=cos(cameraDir[0]+90)*moveSpeed;
        cameraPos[2]-=sin(cameraDir[0]+90)*moveSpeed;
    }
    if(keyIsDown(68)){
        cameraPos[0]+=cos(cameraDir[0]-90)*moveSpeed;
        cameraPos[2]-=sin(cameraDir[0]-90)*moveSpeed;
    }
    if(shotClicked==true){
       // bigx-=0.25;
       curry.action="loading"
       curry.z=-shots[shotAnimating].x
       curry.x=courtLength/2-shots[shotAnimating].y
       if(rows[shotAnimating].getString("LOC_X")>24.75||rows[shotAnimating].getString("LOC_X")<-24.75){
        curry.z+=cos(-atan((0-curry.z)/(courtLength/2-curry.x))-90)*0.5
        curry.x+=sin(-atan((0-curry.z)/(courtLength/2-curry.x))-90)*0.5
       }else if (rows[shotAnimating].getString("LOC_X")>24||rows[shotAnimating].getString("LOC_X")<-24){
        curry.z+=cos(-atan((0-curry.z)/(courtLength/2-curry.x))-90)*1.5
        curry.x+=sin(-atan((0-curry.z)/(courtLength/2-curry.x))-90)*1.5
       }else{
        curry.z+=cos(-atan((0-curry.z)/(courtLength/2-curry.x))-90)*10
        curry.x+=sin(-atan((0-curry.z)/(courtLength/2-curry.x))-90)*10
       }
       if(rows[shotAnimating].getString("ACTION_TYPE")=="Driving Bank shot"||rows[shotAnimating].getString("ACTION_TYPE")=="Jump Bank Shot"||
       rows[shotAnimating].getString("ACTION_TYPE")=="Pullup Bank shot"||rows[shotAnimating].getString("ACTION_TYPE")=="Turnaround Bank shot"){
            curry.bank=true;
       }else{
            curry.bank=false;
       }
       if(rows[shotAnimating].getString("ACTION_TYPE")=="Fadeaway Jump Shot"){
            curry.fade=true;
       }else{
            curry.fade=false;
       }
        curry.madeShot=(shots[shotAnimating].made=="TRUE")
    }
    if(keyIsDown(67)){
        //bigy-=0.25;
        //curry.x+=1;
        //curry.z+=1;
    }
    
    if(curry.action!="none"){
        cameraTypeElement.disabled=true;
    }else{
        cameraTypeElement.disabled=false;
    }
    if(curry.action!="loading"&&curry.action!="idling"&&curry.action!="shooting"&&curry.action!="releasing"&&curry.action!="idle"||cameraType===false){
        if(mouseIsPressed&&mouseInBounds()&&!cameraSelectionChanged){
            scrollBarY=0;
            if(mousePos[0][0]==-1){
                mousePos[0][0]=mouseX
                mousePos[1][0]=mouseX
                mousePos[0][1]=mouseY
                mousePos[1][1]=mouseY
            }else{
                mousePos[1][0]=mouseX
                mousePos[1][1]=mouseY
                cameraDir[0]+=(mousePos[1][0]-mousePos[0][0])/5
                cameraDir[1]+=(mousePos[1][1]-mousePos[0][1])/5
                mousePos[0][0]=mouseX
                mousePos[0][1]=mouseY
            }
        }else{
            mousePos[0][0]=-1
        }
    }
    if(cameraDir[1]<-80){
        cameraDir[1]=-80
    }
    if(curry.action=="none"||cameraType===false){
        if(cameraPos[2]<-340){
            cameraPos[2]=-340
        }
        if(cameraPos[2]>340){
            cameraPos[2]=340
        }
        if(cameraPos[0]<-450){
            cameraPos[0]=-450
        }
        if(cameraPos[0]>415){
            cameraPos[0]=415
        }
    }
    //cameraDir[0]+=1;
    if(dataPlaying==false){
        cameraPos[1]=-150
    }else{
        cameraPos[1]=-80
    }
    frame+=1;
    if(gameClock<0){
        gameClock=0;
    }
}