var teamLogos;
var shotAnimating=false;
var shotClicked=false;
function sideBar(e){
    var shotsOrdered=[]
    e.preload=function() {
        teamLogos=e.loadImage("nbaTeamLogos.jpg")
    }
    var sideBarCanvas=document.getElementById("sideBarCanvas")
    var scrollBarHeight=505;
    var clickedBar=false;
    var extraX=0;
    var mouseP=[-1,-1];
    e.setup=function() {
        e.createCanvas(250, 600,sideBarCanvas);
        e.angleMode(e.DEGREES)
        e.rectMode(e.CORNER)
    }
    function orderList(list){
        var makes=[]
        var misses=[]
        for(let i=0;i<list.length;i++){
            if(rows[list[i]].getString("SHOT_MADE")=="TRUE"){
                makes.push(list[i]);
            }else{
                misses.push(list[i]);
            }
        }
        return(makes.concat(misses))
    }
    e.draw=function(){
        //e.background(38,91,170)
        shotsOrdered=orderList(shotsSelected);
        function getImageLogo(teamAbbr,side,s){
            let logos=[["LAL","MIL","DET","SAC","ORL","MEM","DEN","UTA","POR","TOR"],
            ["CHA","CLE","BKN","NOP","DAL","MIN","IND","SAS","PHI","GSW"],
            ["CHI","WAS","BOS","MIA","NYK","LAC","PHX","ATL","HOU","OKC"]];
            let teamIndex=[]
            for (let i=0;i<logos.length;i++){
                for(let j=0;j<logos[i].length;j++){
                    if(logos[i][j]==teamAbbr){
                        teamIndex=[i,j]
                    }
                }
            }
            if(side==1){
                e.image(teamLogos,15+extraX,117.5+110*s-scrollY,34.625,30,teamIndex[1]*165.6,teamIndex[0]*440/3,160,440/3,COVER)
            }else if(side==2){
                e.image(teamLogos,188.5+extraX,117.5+110*s-scrollY,34.625,30,teamIndex[1]*165.6,teamIndex[0]*440/3,160,440/3,COVER)
            }
        }
        e.fill("white")
        e.stroke("blue")
        e.strokeWeight(10)
        e.rect(5,5,240,590,20)
        e.strokeWeight(1)
        e.noStroke()
        if(shotsSelected.length>4){
            scrollBarHeight=505/(shotsSelected.length*110/505)
            if(mouseIsPressed&&((e.mouseX>=230&&e.mouseX<=240&&e.mouseY>=80+scrollBarY&&e.mouseY<=80+scrollBarY+scrollBarHeight)||clickedBar)){
                if(!clickedBar &&mouseIsPressed){
                    clickedBar=true;
                }
                if(mouseP[0]==-1){
                    mouseP[0]=e.mouseY
                    mouseP[1]=e.mouseY
                }else{
                    mouseP[1]=e.mouseY
                    //cameraDir[0]+=(mousePos[1][0]-mousePos[0][0])/5
                    //cameraDir[1]+=(mousePos[1][1]-mousePos[0][1])/5
                    scrollBarY+=(mouseP[1]-mouseP[0])
                    if(scrollBarY<=0){
                        scrollBarY=0
                    }
                    if(scrollBarY>=505-scrollBarHeight){
                        scrollBarY=505-scrollBarHeight
                    }
                    
                    mouseP[0]=e.mouseY
                }
            }else{
                clickedBar=false;
                mouseP[0]=-1
            }
            scrollY=((shotsSelected.length*110)-505)*(scrollBarY/(505-scrollBarHeight))
            //contentheight>500
            e.fill(128,128,128,50)
            e.stroke(128,128,128,255)
            e.rect(230,80,10,510) 
            if(e.mouseX>=230&&e.mouseX<=240&&e.mouseY>=80+scrollBarY&&e.mouseY<=80+scrollBarY+scrollBarHeight){
                e.fill(128,128,128,255)
            }else{
                e.fill(128,128,128,200)
            }
            e.rect(230,80+scrollBarY,10,scrollBarHeight,5)
            e.fill("blue")
            e.noStroke()
            e.rect(227.5,80,2.5,510)
        }
        if(shotsSelected.length>0){
            for(let s=0;s<shotsSelected.length;s++){
                if(110*s-scrollY<600&&110*s-scrollY>-110){
                    e.fill("white")
                    if(e.mouseX>14+extraX&&e.mouseX<14+extraX+209.5&&e.mouseY>90+110*s-scrollY&&e.mouseY<90+110*s-scrollY+100){
                        e.stroke("yellow")
                        if(mouseIsPressed&&!shotClicked){
                            if(shotAnimating===false){
                                shotAnimating=shotsOrdered[s]
                            }
                            shotClicked=true;
                        }else{
                            shotClicked=false;
                        }
                    }else{
                        e.stroke("black")
                    }
                    if(!mouseIsPressed){
                        shotClicked=false;
                    }
                    if(shotsSelected.length>4){
                        e.rect(14,90+110*s-scrollY,209.5,100,10)
                        extraX=0;
                    }else{
                        e.rect(20,90+110*s-scrollY,209.5,100,10)
                        extraX=6;
                    }
                    e.fill("black")
                    e.noStroke()
                    e.textSize(20)
                    e.textStyle(BOLD)
                    if(rows[shotsOrdered[s]].getString("SHOT_MADE")=="TRUE"){
                        e.fill(83,179,51)
                        e.text("MAKE",96.5+extraX,110+110*s-scrollY)
                    }else{
                        e.fill(227,49,34)
                        e.text("MISS",96.5+extraX,110+110*s-scrollY)
                    }
                    e.textStyle(NORMAL)
                    e.fill("black")
                    e.textSize(25)
                    //logos
                    getImageLogo(rows[shotsOrdered[s]].getString("AWAY_TEAM"),1,s)
                    getImageLogo(rows[shotsOrdered[s]].getString("HOME_TEAM"),2,s)
                    var homeTeamPoints=rows[shotsOrdered[s]].getString("Points Home")
                    var awayTeamPoints=rows[shotsOrdered[s]].getString("Points Away")
                    //minus 3
                    if(rows[shotsOrdered[s]].getString("SHOT_MADE")=="TRUE"){
                        if(rows[shotsOrdered[s]].getString("HOME_TEAM")=="GSW"){
                            if(homeTeamPoints!=="?"){
                                homeTeamPoints=int(homeTeamPoints)-3
                            }
                        }else{
                            if(awayTeamPoints!=="?"){
                                awayTeamPoints=int(awayTeamPoints)-3
                            }
                        }
                    }
                    if(str(awayTeamPoints).length==3){
                        e.text(awayTeamPoints,46.5+extraX,140+110*s-scrollY)
                    }else{
                        e.text(awayTeamPoints,52+extraX,140+110*s-scrollY)
                    }
                    if(str(homeTeamPoints).length==3){
                        e.text(homeTeamPoints,146.5+extraX,140+110*s-scrollY)
                    }else{
                        e.text(homeTeamPoints,152+extraX,140+110*s-scrollY)
                    }
                    //e.image(teamLogos,15+extraX,117.5,35.625,25.175,0*207,0*440/3,207,440/3)
                    //e.rect(16.5+extraX,117.5,30,30)
                    //e.rect(191.5+extraX,117.5,30,30)
                    e.textSize(20)
                    e.text("-",114+extraX,140+110*s-scrollY)
                    e.textSize(15)
                    e.text(rows[shotsOrdered[s]].getString("AWAY_TEAM"),56.5+extraX,157.5+110*s-scrollY)
                    e.text(rows[shotsOrdered[s]].getString("HOME_TEAM"),156.5+extraX,157.5+110*s-scrollY)
                    e.fill("red")
                    if(int(rows[shotsOrdered[s]].getString("QUARTER"))>4){
                        if(int(rows[shotsOrdered[s]].getString("QUARTER"))-4>1){
                            e.text(int(rows[shotsOrdered[s]].getString("QUARTER"))-4+"OT",88.5+extraX,177.5+110*s-scrollY)
                        }else{
                            e.text("OT",88.5+extraX,177.5+110*s-scrollY)
                        }
                    }else{
                        e.text("Q"+rows[shotsOrdered[s]].getString("QUARTER"),88.5+extraX,177.5+110*s-scrollY)
                    }
                    e.fill("black")
                    e.textSize(14)
                    if(rows[shotsOrdered[s]].getString("SECS_LEFT").length==1){
                        e.text(rows[shotsOrdered[s]].getString("MINS_LEFT")+":0"+rows[shotsOrdered[s]].getString("SECS_LEFT"),115+extraX,177+110*s-scrollY)
                    }else{
                        e.text(rows[shotsOrdered[s]].getString("MINS_LEFT")+":"+rows[shotsOrdered[s]].getString("SECS_LEFT"),115+extraX,177+110*s-scrollY)
                    }
                }
            }
        }else{
            e.fill("black")
            e.noStroke()
            e.textSize(20)
            e.text("No shots selected",20,110)
        }
        e.fill("blue")
        e.rect(0,75,250,5) 
        e.fill("white")
        e.noStroke()
        e.rect(5,5,250,72)
        e.fill("blue")
        e.textSize(30)
        e.textFont("Courier New")
        e.textStyle(BOLD)
        e.text("Shots Data",35,50)
        e.textStyle(NORMAL)
        e.noFill()
        e.stroke("blue")
        e.strokeWeight(10)
        e.rect(5,5,240,590,20)
        e.strokeWeight(1)
    }
    e.mouseWheel=function(event){
            if(e.mouseX>=0&&e.mouseX<=250){
            scrollBarY+=event.delta
            if(scrollBarY<=0){
                scrollBarY=0
            }
            if(scrollBarY>=505-scrollBarHeight){
                scrollBarY=505-scrollBarHeight
            }
        }
        return false;
    }
}
new p5(sideBar)
