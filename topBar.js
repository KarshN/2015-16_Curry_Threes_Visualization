var dropdowns=[];
var shotTypes=["Any","Driving Bank shot","Fadeaway Jump Shot","Jump Bank Shot","Jump Shot","Pullup Bank shot","Pullup Jump shot","Running Jump Shot","Running Pull-Up Jump Shot","Step Back Jump shot","Turnaround Bank shot","Turnaround Jump Shot"];
var teamsSelection=["Any","PHI", "MIL", "CHI", "CLE", "BOS", "LAC", "MEM", "ATL", "MIA", "CHA", "UTA", "SAC", "NYK", "LAL", "ORL", "DAL", "BKN", "DEN", "IND", "NOP", "DET", "TOR", "HOU", "SAS", "PHX", "OKC", "MIN", "POR", "WAS"];
var primaryColors = [
    { "team": "ATL", "primary_color": "#E03A3E", "secondary_color": "#F4C300", "full_name": "Atlanta Hawks" },
    { "team": "BOS", "primary_color": "#007A33", "secondary_color": "#BA9650", "full_name": "Boston Celtics" },
    { "team": "BKN", "primary_color": "#000000", "secondary_color": "#FFFFFF", "full_name": "Brooklyn Nets" },
    { "team": "CHA", "primary_color": "#1D1160", "secondary_color": "#00B5E2", "full_name": "Charlotte Hornets" },
    { "team": "CHI", "primary_color": "#CE1141", "secondary_color": "#000000", "full_name": "Chicago Bulls" },
    { "team": "CLE", "primary_color": "#6A1E1D", "secondary_color": "#041E42", "full_name": "Cleveland Cavaliers" },
    { "team": "DAL", "primary_color": "#00538C", "secondary_color": "#B8C4D2", "full_name": "Dallas Mavericks" },
    { "team": "DEN", "primary_color": "#0E76A8", "secondary_color": "#FEC524", "full_name": "Denver Nuggets" },
    { "team": "DET", "primary_color": "#1D42BA", "secondary_color": "#C8102E", "full_name": "Detroit Pistons" },
    { "team": "GSW", "primary_color": "#006BB6", "secondary_color": "#FDB927", "full_name": "Golden State Warriors" },
    { "team": "HOU", "primary_color": "#CE1141", "secondary_color": "#000000", "full_name": "Houston Rockets" },
    { "team": "IND", "primary_color": "#FFC400", "secondary_color": "#002D62", "full_name": "Indiana Pacers" },
    { "team": "LAC", "primary_color": "#1D428A", "secondary_color": "#C8102E", "full_name": "Los Angeles Clippers" },
    { "team": "LAL", "primary_color": "#552583", "secondary_color": "#FDB927", "full_name": "Los Angeles Lakers" },
    { "team": "MEM", "primary_color": "#5D76A9", "secondary_color": "#A7A9BE", "full_name": "Memphis Grizzlies" },
    { "team": "MIA", "primary_color": "#98002E", "secondary_color": "#F9A01B", "full_name": "Miami Heat" },
    { "team": "MIL", "primary_color": "#00471B", "secondary_color": "#EEE1C6", "full_name": "Milwaukee Bucks" },
    { "team": "MIN", "primary_color": "#005083", "secondary_color": "#236B8E", "full_name": "Minnesota Timberwolves" },
    { "team": "NOP", "primary_color": "#004B87", "secondary_color": "#F1C300", "full_name": "New Orleans Pelicans" },
    { "team": "NYK", "primary_color": "#F58426", "secondary_color": "#006BB6", "full_name": "New York Knicks" },
    { "team": "OKC", "primary_color": "#007AC1", "secondary_color": "#EF6A00", "full_name": "Oklahoma City Thunder" },
    { "team": "ORL", "primary_color": "#0077C0", "secondary_color": "#F0B500", "full_name": "Orlando Magic" },
    { "team": "PHI", "primary_color": "#006BB6", "secondary_color": "#ED174C", "full_name": "Philadelphia 76ers" },
    { "team": "PHX", "primary_color": "#1D1160", "secondary_color": "#E56020", "full_name": "Phoenix Suns" },
    { "team": "POR", "primary_color": "#E03A3E", "secondary_color": "#000000", "full_name": "Portland Trail Blazers" },
    { "team": "SAC", "primary_color": "#5A2D6D", "secondary_color": "#63707D", "full_name": "Sacramento Kings" },
    { "team": "SAS", "primary_color": "#000000", "secondary_color": "#B4B7B9", "full_name": "San Antonio Spurs" },
    { "team": "TOR", "primary_color": "#C8102E", "secondary_color": "#000000", "full_name": "Toronto Raptors" },
    { "team": "UTA", "primary_color": "#002B5C", "secondary_color": "#F4B731", "full_name": "Utah Jazz" },
    { "team": "WAS", "primary_color": "#002B5C", "secondary_color": "#E31837", "full_name": "Washington Wizards" }
];
var weekdays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
function topBar(e){
    let rightArrow,restart,dropsymbol,checkmark;
    e.preload=function() {
        rightArrow=e.loadImage("rightArrow.png")
        restart=e.loadImage("restart.png")
        dropsymbol=e.loadImage("down.png")
        checkmark=e.loadImage("checkmark.png")
    }
    var topBarCanvas=document.getElementById("topBar")
    var stageNum=1;
    var sizeFactor=1
    var stageAdvanced=false;
    var textFrame=0;
    var textDone=false;
    let homeMinus=0;
    let awayMinus=0;
    e.setup=function() {
        e.createCanvas(900, 100,topBarCanvas);
        e.angleMode(DEGREES)
        e.rectMode(CORNER)
    }
    function limitText(string,characters,lastString){
        let returnText="";
        for(let i=0;i<characters;i++){
            if(i<string.length){
                returnText=returnText+string[i]
            }else{
                if(lastString){
                    textDone=true;
                    sizeFactor=1.25;
                }
            }
        }
        return returnText
    }
    e.draw=function(){
        function dropdown(defaultSelection,options,checkMultiple,x,y,width,height,fontSize,margin,id){
            //for multiple selections, first selection + x more
            //for ones with multiple allowed to be checked, the first one should be "all", and it can be the only one checked
            //this part of the code is a lil dense so imma just put a few comments here and there
            this.selection=defaultSelection;
            this.options=options;
            this.checkMultiple=checkMultiple;
            this.mouseClicked=false;
            this.x=x;
            this.y=y;
            this.width=width;
            this.height=height;
            this.fontSize=fontSize;
            this.margin=margin
            this.expanded=false;
            this.scrollY=0;
            this.scrollBarY=0;
            this.scrollBarHeight=0;
            this.extraX=0;
            this.mouseP=[-1,-1];
            this.clickedBar=false;
            this.clickedBoxes=[];
            this.id=id;
            this.textBoxes=[]
            for(let n=0;n<this.options.length;n++){
                this.clickedBoxes.push(false)
            }
            this.update=function(){
                //expands if clicked
                if(mouseIsPressed&&!this.textBoxActivated()&&e.mouseX-15>=this.x&&e.mouseX-15<=this.x+this.width&&e.mouseY>=this.y&&e.mouseY<=this.y+this.height){
                    console.log("clicked"+this.id)
                    if(!this.mouseClicked){
                        this.expanded=!this.expanded;
                        this.mouseClicked=true;
                    }
                }else{
                    if(!mouseIsPressed){
                        this.mouseClicked=false;
                    }
                    for(let d=0;d<dropdowns.length;d++){
                        if(dropdowns[d].expanded&&dropdowns[d]!=this){
                            this.expanded=false;
                        }
                    }
                }

                //scrolls the dropdown menu when scroll bar is dragged
                if(this.expanded&&mouseIsPressed&&((e.mouseX-15>=this.x+this.width*9/10&&e.mouseX-15<=this.x+this.width&&e.mouseY>=this.y+this.height+this.scrollBarY&&e.mouseY<=this.y+this.height+this.scrollBarY+this.scrollBarHeight)||this.clickedBar)){
                    if(!this.clickedBar&&mouseIsPressed){
                        this.clickedBar=true;
                    }
                    if(this.mouseP[0]==-1){
                        this.mouseP[0]=e.mouseY
                        this.mouseP[1]=e.mouseY
                    }else{
                        this.mouseP[1]=e.mouseY
                        //cameraDir[0]+=(mousePos[1][0]-mousePos[0][0])/5
                        //cameraDir[1]+=(mousePos[1][1]-mousePos[0][1])/5
                        this.scrollBarY+=(this.mouseP[1]-this.mouseP[0])
                        if(this.scrollBarY<=0){
                            this.scrollBarY=0
                        }
                        if(this.scrollBarY>=(90-(this.y+this.height))-this.scrollBarHeight){
                            this.scrollBarY=(90-(this.y+this.height))-this.scrollBarHeight
                        }
                        this.mouseP[0]=e.mouseY
                    }
                }else{
                    this.clickedBar=false;
                    this.mouseP[0]=-1
                }
                if(this.options.length*this.height>90-(this.y+this.height)){
                    this.scrollY=((this.options.length*this.height)-(90-(this.y+this.height)))*(this.scrollBarY/((90-(this.y+this.height))-this.scrollBarHeight))
                    this.scrollBarHeight=(90-(this.y+this.height))/(this.options.length*this.height/(90-(this.y+this.height)))
                }
            }
            this.inSelection=function(number){
                for(let s=0;s<this.selection.length;s++){
                    if(number===this.selection[s]){
                        return true;
                    }
                }
                return false;
            }
            this.selectionNum=function(number){
                for(let s=0;s<this.selection.length;s++){
                    if(number===this.selection[s]){
                        return s;
                    }
                }
                return false;
            }
            this.textWithBoxes=function(clickable,string,x,y,fontSize){
                var stringsBetweenBox=[]
                var boxValues=[]
                var progression=[]
                var hittingBox=false;
                var estLength=x;
                var boxIndex=false;
                if(string[0]=="["){
                    stringsBetweenBox=[]
                    progression.push([1,0])
                }else{
                    stringsBetweenBox=[""]
                    progression.push([0,0])
                }
                for(let i=0;i<string.length;i++){
                    if(string[i]=="["){
                        hittingBox=true;
                        stringsBetweenBox.push("")
                        boxValues.push("")
                        progression.push([1,boxValues.length-1])
                    }else if(string[i-1]=="]"){
                        hittingBox=false;
                        progression.push([0,stringsBetweenBox.length-1])
                    }
                    if(!hittingBox){
                        stringsBetweenBox[stringsBetweenBox.length-1]=stringsBetweenBox[stringsBetweenBox.length-1]+string[i]
                    }else if(string[i]!=="["&&string[i]!=="]"){
                        boxValues[boxValues.length-1]=boxValues[boxValues.length-1]+string[i]
                    }
                }

                for(let p=0;p<progression.length;p++){
                    if(progression[p][0]==0){
                        //string with value stringsBetweenBox[progression[p][1]]
                        e.textStyle(NORMAL)
                        e.textSize(fontSize)
                        e.noStroke()
                        e.fill("black")
                        e.text(stringsBetweenBox[progression[p][1]],estLength,y)
                        estLength+=stringsBetweenBox[progression[p][1]].length*0.55*(fontSize);
                    }else{
                        //box with value boxValues[progression[p][1]]
                        e.textStyle(NORMAL)
                        e.textSize(fontSize)
                        e.fill(128,128,128,200)
                        e.noStroke()
                        if(clickable===false){
                            e.text(boxValues[progression[p][1]],estLength+(1.5*fontSize/15),y)
                            e.noFill()
                            e.stroke("black")
                            e.rect(estLength,y-fontSize+(2*fontSize/15),fontSize+(4*fontSize/15),fontSize+(2*fontSize/15),4)
                        }else{
                            if(this.findTextBox(estLength,y-fontSize+(2*fontSize/15))===false){
                                if(this.id=="Time Left"){
                                    if(this.textBoxes.length==0){
                                        this.textBoxes.push(new textBox(estLength,y-fontSize+(2*fontSize/15),fontSize+(4*fontSize/15),fontSize+(2*fontSize/15),boxValues[progression[p][1]],0,12))
                                    }else{
                                        this.textBoxes.push(new textBox(estLength,y-fontSize+(2*fontSize/15),fontSize+(4*fontSize/15),fontSize+(2*fontSize/15),boxValues[progression[p][1]],0,59))
                                    }
                                }else{
                                    if(this.id=="Score Margin"){
                                        this.textBoxes.push(new textBox(estLength,y-fontSize+(2*fontSize/15),fontSize+(4*fontSize/15),fontSize+(2*fontSize/15),boxValues[progression[p][1]],1,100))
                                    }else{
                                        this.textBoxes.push(new textBox(estLength,y-fontSize+(2*fontSize/15),fontSize+(4*fontSize/15),fontSize+(2*fontSize/15),boxValues[progression[p][1]],21,100))
                                    }
                                }
                            }else{
                                boxIndex=this.findTextBox(estLength,y-fontSize+(2*fontSize/15));
                                if(this.id=="Distance"){
                                    this.options[1]="over["+this.textBoxes[0].value+"] ft";
                                }else if(this.id=="Time Left"){
                                    this.options[1]="under["+this.textBoxes[0].value+"]:["+this.textBoxes[1].value+"]";
                                }else if(this.id=="Score Margin"){
                                    this.options[1]="under["+this.textBoxes[0].value+"]";
                                }
                            }
                            boxIndex=this.findTextBox(estLength,y-fontSize+(2*fontSize/15));
                            e.text(this.textBoxes[boxIndex].newValue,estLength+(1.5*fontSize/15),y)
                            this.textBoxes[boxIndex].update(this)

                            e.noFill()
                            if(!this.textBoxes[boxIndex].beingClicked){
                                e.stroke("black")
                            }else{
                                e.stroke("blue")
                            }
                            e.rect(estLength,y-fontSize+(2*fontSize/15),fontSize+(4*fontSize/15),fontSize+(2*fontSize/15),4)
                        }
                        estLength+=fontSize+(5*fontSize/15)
                    }
                }
                return [boxValues,stringsBetweenBox,progression];
            }
            this.findTextBox=function(x,y){
                for(let t=0;t<this.textBoxes.length;t++){
                    if(x==this.textBoxes[t].x&&y==this.textBoxes[t].y){
                        return t;
                    }
                }
                return false;
            }
            this.containsCharacter=function(string,character){
                for(let s=0;s<string.length;s++){
                    if(character==string[s]){
                        return true;
                    }
                }
                return false;
            }
            this.textBoxActivated=function(){
                for(let t=0;t<this.textBoxes.length;t++){
                    if(e.mouseY>=this.textBoxes[t].y&&e.mouseY<=this.textBoxes[t].y+this.textBoxes[t].height&&e.mouseX-15>=this.textBoxes[t].x&&e.mouseX-15<=this.textBoxes[t].x+this.textBoxes[t].width){
                        return true;
                    }
                }
                return false;
            }
            this.draw=function(){
                this.update();
                if(this.expanded==true){
                    //scroll bar
                    if(this.options.length*this.height>90-(this.y+this.height)){
                        e.fill(128,128,128,50)
                        e.stroke(128,128,128,255)
                        e.rect(this.x+this.width*9/10,this.y+this.height,this.width/10,90-(this.y+this.height)) 
                        if((e.mouseX-15>=this.x+this.width*9/10&&e.mouseX-15<=this.x+this.width&&e.mouseY>=this.y+this.height+this.scrollBarY&&e.mouseY<=this.y+this.height+this.scrollBarY+this.scrollBarHeight)||this.clickedBar){
                            e.fill(128,128,128,255)
                        }else{
                            e.fill(128,128,128,200)
                        }
                        e.rect(this.x+this.width*9/10,this.y+this.height+this.scrollBarY,this.width/10,this.scrollBarHeight,3)
                        this.extraX=0;
                    }else{
                        this.extraX=this.width/10
                    }
                    //menu items
                    for(let o=1;o<this.options.length+1;o++){
                        if(!this.inSelection(o-1)){
                            e.fill("white");
                            e.stroke("black");
                        }else{
                            e.fill(128,128,128,100);
                            e.stroke(128,128,128,255);
                        }
                        if((this.y+this.height*o-this.scrollY<=90&&this.y+this.height*o-this.scrollY>=this.y)||this.options.length*this.height<=90-(this.y+this.height)){
                            e.rect(this.x,this.y+this.height*o-this.scrollY,this.width*9/10+this.extraX,this.height);
                            e.fill("black")
                            e.noStroke()
                            e.textSize(this.fontSize)
                            if(!this.containsCharacter(this.options[o-1],"[")){
                                e.text(this.options[o-1],this.x+this.margin,this.y+this.height*(o+1)-this.scrollY-this.height/6)
                            }else{
                                this.textWithBoxes(false,this.options[o-1],this.x+this.margin,this.y+this.height*(o+1)-this.scrollY-this.height/6,this.fontSize);
                            }
                            if(this.inSelection(o-1)){
                                e.image(checkmark,this.x+this.width+(this.extraX-this.width/10)-1.1*this.width/7,this.y+this.height*o-this.scrollY+this.height/2-this.width/14,this.width/7,this.width/7)
                            }

                            if(mouseIsPressed&&!this.clickedBoxes[o-1]&&e.mouseX-15>=this.x&&e.mouseX-15<=this.x+this.width*9/10+this.extraX&&e.mouseY>=this.y+this.height*o-this.scrollY&&e.mouseY<=this.y+this.height*o-this.scrollY+this.height&&e.mouseY>this.y+this.height){
                                if(this.checkMultiple){
                                    //clicked on the "all box"
                                    if(o-1==0){
                                        this.selection=[0]
                                    }else{
                                        if(this.inSelection(0)){
                                            this.selection.splice(this.selectionNum(0),1)
                                        }

                                        //clicked on a selected box
                                            //more than one item
                                            //else doesn't work
                                        if(this.inSelection(o-1)){
                                            if(this.selection.length>1){
                                                this.selection.splice(this.selectionNum(o-1),1)
                                            }
                                        }else{
                                            this.selection.push(o-1)
                                        }
                                    }
                                    
                                }else{
                                    this.selection[0]=o-1
                                }
                                this.clickedBoxes[o-1]=true;
                            }else if(!mouseIsPressed){
                                this.clickedBoxes[o-1]=false;
                            }

                        }
                    }

                    //blue and yellow overlays
                    e.noStroke()
                    e.fill(246,198,76)
                    e.rect(this.x-1,90,this.width+1,10)
                    e.fill(38,91,170)
                    e.rect(this.x-1,90,this.width+1,5)
                }

                e.fill("white");
                e.stroke("black");
                e.rect(this.x,this.y,this.width,this.height);
                e.noStroke();
                e.fill("black")
                if(this.selection.length==1){
                    e.textSize(this.fontSize)
                    if(this.options[this.selection[0]]=="Any"){
                        e.textSize(13)
                    }
                    if(!this.containsCharacter(this.options[this.selection[0]],"[")){
                        e.text(this.options[this.selection[0]],this.x+this.margin,this.y+this.height*5/6)
                    }else{
                        this.textWithBoxes(true,this.options[this.selection[0]],this.x+this.margin,this.y+this.height*5/6,this.fontSize)
                    }
                }else{
                    e.textSize(6*(this.width/40))
                    e.text(this.selection.length+" selected",this.x+this.margin/3,this.y+this.height*5/6)
                }
                e.image(dropsymbol,this.x+this.width-1.5*this.width/10,this.y+this.height/2-this.width/20,this.width/10,this.width/10)
            }
        }
        function textBox(x,y,width,height,defaultValue,minValue,maxValue){
            this.x=x;
            this.y=y;
            this.width=width;
            this.height=height;
            this.value=defaultValue;
            this.newValue=this.value;
            this.chs=defaultValue.length;
            this.maxValue=maxValue;
            this.minValue=minValue;
            this.mouseClicked=false;
            this.keyClicked=false;
            this.beingClicked=false;
            this.whenClicked=millis();
            this.update=function(parent){
                if(parent.id=="Time Left"&&parent.textBoxes.length>1){
                    if(int(parent.textBoxes[1].value)>0&&int(parent.textBoxes[0].value)==12){
                        parent.textBoxes[0].value="12"
                        parent.textBoxes[1].value="00"
                    }
                }
                if(mouseIsPressed&&!this.mouseClicked&&e.mouseY>=this.y&&e.mouseY<=this.y+this.height&&e.mouseX-15>=this.x&&e.mouseX-15<=this.x+this.width){
                    this.beingClicked=!this.beingClicked
                    if(!this.beingClicked&&this.newValue.length<this.chs){
                        this.newValue=this.value;
                    }else{
                        this.value=this.newValue;
                    }
                    if(this.beingClicked){
                        this.newValue=""
                    }
                    this.mouseClicked=true;
                }else if(!mouseIsPressed){
                    this.mouseClicked=false;
                }
                if(!this.beingClicked){
                    this.whenClicked=millis();
                    this.newValue=this.value;
                }else{
                    if(keyIsPressed&&!this.keyClicked&&keyCode>=48&&keyCode<=59){
                        this.keyClicked=true;
                        if(this.newValue.length<this.chs){
                            this.newValue=this.newValue+str(key)
                        }else{
                            this.beingClicked=false;
                            this.value=this.newValue;
                        }
                    }else if(!keyIsPressed){
                        this.keyClicked=false;
                    }
                    if(this.newValue.length>=this.chs){
                        if(int(this.newValue)>=this.minValue&&int(this.newValue)<=this.maxValue&&!(parent.id=="Time Left"&&int(this.newValue)>0&&int(parent.textBoxes[0].value)==12)){
                            this.beingClicked=false;
                            this.value=this.newValue;
                        }else{
                            if(parent.id=="Time Left"){
                                if(parent.textBoxes[1]==this){
                                    this.beingClicked=false;
                                    this.newValue=this.value;
                                }else if(int(this.newValue)>=this.minValue&&int(this.newValue)<=this.maxValue){
                                    this.beingClicked=false;
                                    this.value=this.newValue;
                                }else{
                                    this.beingClicked=false;
                                    this.newValue=this.value;
                                }
                            }else{
                                this.beingClicked=false;
                                this.newValue=this.value;
                            }
                        }
                    }
                }
            }
        }
        function findTeamIndex(teamAbbr){
            for(let i=0;i<primaryColors.length;i++){
                if(teamAbbr==primaryColors[i].team){
                    return i
                }
            }
            return false
        }
        function toMinsAndSecs(num){
            let minsAndSecs=[str(floor(num/60)),str(floor(num%60))]
            if(minsAndSecs[0].length==1){
                minsAndSecs[0]="0"+minsAndSecs[0]
            }
            if(minsAndSecs[1].length==1){
                minsAndSecs[1]="0"+minsAndSecs[1]
            }
            return minsAndSecs
        }
        if(frameCount==0){
            dropdowns=[new dropdown([0],["Any","Make","Miss"],false,81,30,40,15,12,5,"Result"),
            new dropdown([0],["Any","Left Side","Left Side Center","Right Side","Right Side Center","Center","Back Court"],true,131,30,93,15,10,5,"Location"),
            new dropdown([0],["Any","over[23] ft"],false,231,30,56,17,11,2.5,"Distance"),
            new dropdown([0],["Full Game","1st Qtr", "2nd Qtr", "1st Half", "3rd Qtr", "4th Qtr", "2nd Half","Overtime"],false,294,30,60,15,11,2.5,"Period"),
            new dropdown([0],["Any","under[06]:[00]","At the Buzzer"],false,359,30,80,17,11,2.5,"Time Left"),
            new dropdown([0],["Any","under[10]","One Score"],false,447,30,75,18,12,2.5,"Score Margin"),
            //some of the stuff I had to capitalized so cant directly set equal
            new dropdown([0],["Any","Driving Bank Shot","Fadeaway Jump Shot","Jump Bank Shot","Jump Shot","Pullup Bank Shot","Pullup Jump Shot","Running Jump Shot","Running Pullup Jump Shot","Step Back Jump Shot","Turnaround Bank Shot","Turnaround Jump Shot"],true,530,30,100,18,7.5,2.5,"Shot Type"),
            new dropdown([0],["Any","Home","Away"],false,638,30,70,18,13,2.5,"Stadium"),
            new dropdown([0],["Any","76ers", "Bucks", "Bulls", "Cavaliers", "Celtics", "Clippers", "Grizzlies", "Hawks", "Heat", "Hornets", "Jazz", "Kings", "Knicks", "Lakers", "Magic", "Mavericks", "Nets", "Nuggets", "Pacers", "Pelicans", "Pistons", "Raptors", "Rockets", "Spurs", "Suns", "Thunder", "Timberwolves", "Trail Blazers", "Wizards"],true,721,30,100,18,13,2.5,"Team Against")
            ]
        }
        if(curry){
            if(!textDone||stageNum==8||mouseIsPressed||curry.action!="none"){
                if(curry.action=="none"){
                    e.background("gray")
                    e.noStroke()
                    e.fill(246,198,76)
                    e.rect(0,0,900,100)
                    e.fill(38,91,170)
                    e.rect(5,5,890,90)
                    e.fill("white")
                    e.rect(10,10,880,80)
                    e.fill("black")
                    e.textFont("Trebuchet MS")
                    e.textSize(20)
                    //e.text(stageNum,15,15)
                    textFrame+=1;
                    if(stageNum==1){
                        e.text(limitText("Below is every 3 point shot taken by Stephen Curry in the 2015-16 regular season.",textFrame,true),65,55)
                    }else if(stageNum==2){
                        e.text(limitText("Curry's 2015-16 season was the best of his career. He was so good that he became the",textFrame,false),65,35)
                        e.text(limitText("first player in NBA history to win the Most Valuable Player award unanimously.",textFrame-84,true),65,65)
                    }else if(stageNum==3){
                        e.text(limitText("Feel free to interact with this map. Use the arrow keys or WASD to move around and drag",textFrame,false,),65,35)
                        e.text(limitText("with your mouse to look around.",textFrame-87,true),65,65)
                    }else if(stageNum==4){
                        e.text(limitText("As you may have guessed, the green spots are the shots that were made, and the red ones",textFrame,false),65,35)
                        e.text(limitText("are the shots that were missed.",textFrame-87,true),65,65)
                    }else if(stageNum==5){
                        e.text(limitText("Align your crosshair with a spot on the map to view Steph's shots from that location.",textFrame,false),65,35)
                        e.text(limitText("Select a shot from the menu on the right to visualize it.",textFrame-85,true),65,65)
                    }else if(stageNum==6){
                        e.text(limitText("You may want to angle your view down to select shots more precisely.",textFrame,true),65,55)
                    }else if(stageNum==7){
                        e.text(limitText("Once you move to the next slide, you will be able to filter which shots you see, since",textFrame,false),65,35)
                        e.text(limitText("this map of 884 shots may be too intimidating for you.",textFrame-86,true),65,65)
                    }else if(stageNum==8){
                        e.text(limitText("Filters:",textFrame,true),20,55)
                        if(textDone===true){
                            e.fill("white")
                            e.stroke("black")
                            e.rect(27,65,45,15,5)
                            e.fill("black")
                            e.noStroke()
                            e.textSize(12)
                            e.text("Reset",34,76)
                            if(mouseIsPressed&&e.mouseX>=27&&e.mouseX<=27+45&&e.mouseY>=65&&e.mouseX<=80){
                                for(let d=0;d<dropdowns.length;d++){
                                    dropdowns[d].selection=[0]
                                }
                            }
                            e.translate(15,0)
                            e.fill("black")
                            e.noStroke()
                            e.textSize(15)
                            e.textStyle(BOLD)
                            e.rect(77,10,1,80)
                            e.text("Result",80,25)
                            e.rect(125,10,1,80)
                            e.text("Shot location",129,25)
                            e.rect(227,10,1,80)
                            e.text("Distance",230,25)
                            e.rect(291,10,1,80)
                            e.text("Period",300,25)
                            e.rect(357,10,1,80)
                            e.text("Time Left",363,25)
                            e.rect(443,10,1,80)
                            e.textSize(13)
                            e.text("Score Margin",447,25)
                            e.textSize(15)
                            e.rect(527,10,1,80)
                            e.text("Shot Type",542,25)
                            e.rect(633,10,1,80)
                            e.text("Stadium",642,25)
                            e.rect(715,10,1,80)
                            e.text("Team Against",723,25)
                            e.rect(827,10,1,80)
                            e.textStyle(NORMAL)
                            for(let d=0;d<dropdowns.length;d++){
                                dropdowns[d].draw()
                            }
                            e.translate(-15,0)
                            //c before parentheses if it is a check as many as you like
                            //* for special cases

                            //shot result c(make,miss)
                            //shot location (any, all zones)
                            //shot distance (any,[22] or greater)
                            //shot time (full game, 1st qtr, 2nd qtr, 1st half, 3rd qtr, 4th qtr, 2nd half)
                            //time left (any, (two boxes (minutes, seconds), [minutes+":"+seconds+"or less"]), buzzer beater)
                            //score margin (any, under (20) [input number], one score game)
                            //shot type c(Driving Bank shot,Fadeaway Jump Shot,Jump Bank Shot,Jump Shot,Pullup Bank shot,Pullup Jump shot,Running Jump Shot,Running Pull-Up Jump Shot,Step Back Jump shot,Turnaround Bank shot,Turnaround Jump Shot)
                            //arena c(home, away)
                            //*team against (add team logos) c("76ers", "Bucks", "Bulls", "Cavaliers", "Celtics", "Clippers", "Grizzlies", "Hawks", "Heat", "Hornets", "Jazz", "Kings", "Knicks", "Lakers", "Magic", "Mavericks", "Nets", "Nuggets", "Pacers", "Pelicans", "Pistons", "Raptors", "Rockets", "Spurs", "Suns", "Thunder", "Timberwolves", "Trail Blazers", "Warriors", "Wizards")
                            //abbreviations of those teams ["PHI", "MIL", "CHI", "CLE", "BOS", "LAC", "MEM", "ATL", "MIA", "CHA", "UTA", "SAC", "NYK", "LAL", "ORL", "DAL", "BKN", "DEN", "IND", "NOP", "DET", "TOR", "HOU", "SAS", "PHX", "OKC", "MIN", "POR", "GSW", "WAS"]
                        }
                    }
                    if(!textDone){
                        sizeFactor=0;
                    }else{
                        sizeFactor=1.25;
                    }
                    if(stageNum!=8){
                        e.image(rightArrow,845,58.125,20*sizeFactor,15*sizeFactor)
                        if(mouseIsPressed&&textDone&&e.mouseY>58.125&&e.mouseY<58.125+15*sizeFactor&&e.mouseX>845&&e.mouseX<845+20*sizeFactor&&!stageAdvanced){
                            stageNum+=1;
                            textFrame=0;
                            stageAdvanced=true;
                            textDone=false;
                        }else if(!mouseIsPressed){
                            stageAdvanced=false;
                        }
                    }else{
                        e.image(restart,855,58.125,20*1.25-5,15*1.25)
                        if(mouseIsPressed&&textDone&&e.mouseY>58.125&&e.mouseY<58.125+15*1.25&&e.mouseX>845&&e.mouseX<845+20*1.25&&!stageAdvanced){
                            stageNum=1;
                            textFrame=0;
                            stageAdvanced=true;
                            textDone=false;
                        }else if(!mouseIsPressed){
                            stageAdvanced=false;
                        }
                    }
                }else{
                    e.background("white")
                    e.noStroke()
                    e.fill("white")
                    e.rect(0,40,900,60)
                    e.fill(primaryColors[findTeamIndex(rows[shotAnimating].getString("AWAY_TEAM"))].secondary_color)
                    e.rect(0,40,385,60)
                    e.fill(primaryColors[findTeamIndex(rows[shotAnimating].getString("AWAY_TEAM"))].primary_color)
                    e.rect(5,45,375,50)
                    e.fill(primaryColors[findTeamIndex(rows[shotAnimating].getString("HOME_TEAM"))].secondary_color)
                    e.rect(385,40,385,60)
                    e.fill(primaryColors[findTeamIndex(rows[shotAnimating].getString("HOME_TEAM"))].primary_color)
                    e.rect(390,45,375,50)
                    e.fill("white")
                    e.textSize(25)
                    e.textFont("Copperplate")
                    e.textStyle(NORMAL)
                    e.text(primaryColors[findTeamIndex(rows[shotAnimating].getString("AWAY_TEAM"))].full_name,48-primaryColors[findTeamIndex(rows[shotAnimating].getString("AWAY_TEAM"))].full_name.length*2,75)
                    e.text(primaryColors[findTeamIndex(rows[shotAnimating].getString("HOME_TEAM"))].full_name,433-primaryColors[findTeamIndex(rows[shotAnimating].getString("AWAY_TEAM"))].full_name.length*2,75)
                    //e.text("Portland Trail Blazers",50-22*2,75)
                    e.textSize(35)
                    e.textStyle(BOLD)
                    e.textFont("Optima")
                    //e.text("90",335,80)
                    //e.text("102",295+(4-"125".length)*15,77.5)
                    if(rows[shotAnimating].getString("SHOT_MADE")=="TRUE"){
                        if(rows[shotAnimating].getString("HOME_TEAM")=="GSW"){
                            homeMinus=!clockStopped*3
                            awayMinus=0
                        }else{
                            homeMinus=0
                            awayMinus=!clockStopped*3
                        }
                    }else{
                        homeMinus=0
                        awayMinus=0
                    }
                    if(rows[shotAnimating].getString("Points Away")!="?"){
                        e.text(str(int(rows[shotAnimating].getString("Points Away"))-awayMinus),307.5+(4-str(int(rows[shotAnimating].getString("Points Away"))-awayMinus).length)*15,77.5)
                        e.text(str(int(rows[shotAnimating].getString("Points Home"))-homeMinus),307.5+385+(4-str(int(rows[shotAnimating].getString("Points Home"))-homeMinus).length)*15,77.5)
                    }else{
                        e.text((rows[shotAnimating].getString("Points Away")),307.5+(4-(rows[shotAnimating].getString("Points Away")).length)*15,77.5)
                        e.text((rows[shotAnimating].getString("Points Home")),307.5+385+(4-(rows[shotAnimating].getString("Points Home")).length)*15,77.5)
                    }
                    e.fill("red")
                    e.textSize(18)
                    if(rows[shotAnimating].getString("QUARTER")=="1"){
                        e.text("1st Quarter",787.5,62.5)
                    }else if(rows[shotAnimating].getString("QUARTER")=="2"){
                        e.text("2nd Quarter",787.5,62.5)
                    }else if(rows[shotAnimating].getString("QUARTER")=="3"){
                        e.text("3rd Quarter",787.5,62.5)
                    }else if(rows[shotAnimating].getString("QUARTER")=="4"){
                        e.text("4th Quarter",787.5,62.5)
                    }else if(int(rows[shotAnimating].getString("QUARTER"))>4){
                        e.text("Overtime "+str(int(rows[shotAnimating].getString("QUARTER"))-4),787.5,62.5)
                    }
                    e.fill("black")
                    let minsAndSecs=toMinsAndSecs(gameClock)
                    e.text(minsAndSecs[0]+":"+minsAndSecs[1],799,87.5)
                    e.fill(128,128,128)
                    e.rect(0,25,900,15)
                    e.fill("white")
                    e.textStyle(NORMAL)
                    e.textSize(14)
                    e.noStroke()
                    let gameDay=new Date(rows[shotAnimating].getString("GAME_DATE"))
                    e.text("NBA "+weekdays[gameDay.getDay()]+" Game - "+rows[shotAnimating].getString("GAME_DATE"),30,38)
                }
            }
        }
    }
    e.mouseWheel=function(event){
        for(let d=0;d<dropdowns.length;d++){
            if(dropdowns[d].expanded){
                if(dropdowns[d].y+dropdowns[d].height+dropdowns[d].options.length*dropdowns[d].height>=90){
                    if(e.mouseX-15>=dropdowns[d].x&&e.mouseX-15<=dropdowns[d].x+dropdowns[d].width&&e.mouseY>=dropdowns[d].y+dropdowns[d].height&&e.mouseY<=90){
                        dropdowns[d].scrollBarY+=event.delta/(dropdowns[d].options.length*0.75)
                    }
                }
                if(dropdowns[d].scrollBarY<=0){
                    dropdowns[d].scrollBarY=0
                }
                if(dropdowns[d].scrollBarY>=(90-(dropdowns[d].y+dropdowns[d].height))-dropdowns[d].scrollBarHeight){
                    dropdowns[d].scrollBarY=(90-(dropdowns[d].y+dropdowns[d].height))-dropdowns[d].scrollBarHeight
                }
            }
        }
    }
}
new p5(topBar)
