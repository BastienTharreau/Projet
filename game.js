//Quand toute les fenêtre est charger, la fonction suivante sera executé
window.onload = function() {

    // Récupère le canvas et le contexte
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");

    //Var pour les animation
    var lastframe = 0;

    //Position dans le tableau
    var postab = {
        x:0,
        y:0
    }

    //Bubbles
    var bubbles = {
        x: 0,          // X position
        y: 0,          // Y position
        width: 40,     // Largeur
        height: 40,    // Hauteur
        color: 0       //Couleur : 0-> rouge, 1-> vert, 2-> bleu, 3-> jaune, 4-> rose, 5-> bleu ciel, 6-> blanc.

    };

    //Level
    var level= {
        nbcols:15,   //Nombre de colonnes
        nbrows:5,   //Nombre de lignes
    };

    //Tableau contenant le nombre et la couleur de chaque bubble
    var lvl = new Array(level.nbrows);
    for (var i = 0; i < level.nbcols; i++)
    {
    lvl[i] = new Array(level.nbcols);
    }
    
    //Player
    var player= {   
        x:canvas.width/2,       // x pos du player
        y:canvas.height-65,     // y pos du player    
        nextcolor:0,            //couleur du prochain bubble
    };

    //Bulles du player
    var playerBubbles = {
        x: player.x-20,             
        y: player.y-20,   
        width: 40,
        height: 40,
        angle:0,            //angle du tir
        direction:0,        //direction en du tir
        color: 0
    };

    //Définie le statue de la partie:   // 0 = en attente de tirer // 1 = en train de tirer  // 2 = gagner  // 3 = perdu
    var gameStat=0;

    //Pour afficher si il y'a défaite/victoire
    var Stat="";

    //Tableau qui contient tout les couleurs restantes
    var allcolor=[1,1,1,1,1,1];

    //Une fois à 0, ajoute une ligne de bubbles supp
    var remainingshoot=5;

    // Initialise le jeu
    function init() 
    {
        // Ajoute les élements nécéssaires liés à la souris :
        canvas.addEventListener("mousemove", onMouseMove);  //Lorsqu'elle bouge
        canvas.addEventListener("mousedown", onMouseDown);  //Lorsque l'on clic

        //Génère un lvl
        generateLevel();
        // Entre dans la boucle principal
        main(0);
    }
 
    // Boucle principale
    function main(tframe) {
        // Demande une maj de l'animation
        window.requestAnimationFrame(main);
        update(tframe);
        render();
        
        
    }
 
    // Maj les stats de la game
    function update(tframe){
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;
        checkLoose();
        checkWin();
        checkColor();
        shootBubbles(dt);
        
    }


    // Rendu de la partie
    function render() {
        // Dessine une frame
        drawFrame();

        // Affiche le niveau
        drawLevel();

        //Dessine l'angle de la souris
        renderMouseAngle();

        // Dessine le player
        drawPlayer();

    }
 
    function drawFrame() {

        // Dessine une bordure
        context.fillStyle = "#d0d0d0";
        context.fillRect(0, 0, canvas.width, canvas.height);

        //Dessine le bg
        context.fillStyle = "#808080";
        context.fillRect(1, 1, canvas.width-2, canvas.height-2);
   
        // Dessine un pied de page
        context.fillStyle = "#505050";
        context.fillRect(0, canvas.height-65, canvas.width, 65);

        // Dessine un entête
        context.fillStyle = "#303030";
        context.fillRect(0, 0, canvas.width, 65);
 
        // Dessine un titre
        context.fillStyle = "#ffffff";
        context.font = "24px Verdana";
        context.fillText("Bubble Shooter  "+Stat, 200, 40);

        //Next color:
        context.fillStyle = "#ffffff";
        context.font = "20px Verdana";
        context.fillText("Next color:", 13, canvas.height-28);

        //Coup restant:
        context.fillStyle = "#ffffff";
        context.font = "20px Verdana";
        context.fillText("Coup restant: "+ remainingshoot, canvas.width-200, canvas.height-28);

        
    }
 
    function drawBubbles(x,y,color){
        //(image, sx, sy, swidth, sweight, dx, dy, dwidth, dweight)
        context.drawImage(document.getElementById('sprite'),color*40,0,bubbles.width,bubbles.height,x,y,bubbles.width,bubbles.height);
    }

        //Fonction permettant de draw les bubbles du niveau
        function drawLevel(){
            var bx;
            var by;
            var bcolor;
            for(var i=0; i<11;i++)        //Pour chaque ligne
            {
                by=66+40*i;                  //Définie le y du bubble
                for(var j=0; j<level.nbcols;j++)    //Pour chaque colonne
                {           
                    bcolor=lvl[i][j];     //Définie la couleur du bubble
                    if(i%2==0){                     //Si la ligne est pair:
                        bx=(j*40);     //Définie le x du bubble
                    }  
                    else {                          //Sinon: (la ligne est impair)
                        bx=(j*40+20);  //CDéfinie le x du bubble et le décale de 20px suplémentaire          
                    }      
                    drawBubbles(bx,by,bcolor);           //Dessine le bubble
                }
            }
        }
    
        function generateLevel(){
    
    
            //Pour chaque ligne
            for (var i=0;i<level.nbrows;i++){
                //Pour chaque colonnes
                for (var j=0;j<level.nbcols;j++){  
                    color=Math.floor(Math.random() * (5 - 0 + 1));  //Choisi une couleur aléatoire
                    lvl[i][j]=color;                         //Assigne la couleur du bubble 
                }
            }
    
            //Rempli le reste avec du vide
            for (var i=level.nbrows;i<11;i++){
                for (var j=0;j<level.nbcols;j++){  
                    lvl[i][j]=7;                        
                }
            }
        
    
            playerBubbles.color=Math.floor(Math.random() * (5 - 0 + 1));       //Choisi une couleur aléatoire pour le player
            player.nextcolor=Math.floor(Math.random() * (5 - 0 + 1));          //Choisi une couleur aléatoire pour la prochaine bubble
        }   


    function drawPlayer(){
        //Dessine un cercle au niveau du player
        context.beginPath();
        context.fillStyle="#505050"
        context.arc(player.x, player.y, 30, 0, 2 * Math.PI);
        context.fill();

        //Dessine le bubble du prochain joueur
        drawBubbles(canvas.width/2-180,canvas.height-65/2-20,player.nextcolor);
        //Dessine le bubble du joueur
        drawBubbles(playerBubbles.x,playerBubbles.y,playerBubbles.color);
    }




 
    // Get the mouse position
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }


    // Convertie des radians en degrés
    function radToDeg(angle) 
    {
        return angle * (180 / Math.PI);
    }

    // Convertie des degrés en radians
    function degToRad(angle) 
    {
        return angle * (Math.PI / 180);
    }
 
    // Lorsque la souris est en mouvement
    function onMouseMove(e) {
        // Récupère la position de la souris
        var pos = getMousePos(canvas, e);
    
        // Calcul l'angle de la souris par rapport au player (résultat compris entre -PI et PI, on convertis donc en degrés)
        var mouseangle = radToDeg(Math.atan2((player.y) - pos.y, pos.x - (player.x)));
    
        // Le résultat précédent est compris entre -180 et 180 degré, on le convertis de facon a obtenir un résulat entre 0 et 360 degrés
        if (mouseangle < 0) {
            mouseangle = 180 + (180 + mouseangle);
        }
    
        // Empeche l'angle de dépasser 8 et 172 degrés
        var lbound = 8;
        var ubound = 172;
        if (mouseangle > 90 && mouseangle < 270) {
            // Gauche
            if (mouseangle > ubound) {
                mouseangle = ubound;
            }
        } else {
            // Droite
            if (mouseangle < lbound || mouseangle >= 270) {
                mouseangle = lbound;
            }
        }
    
        player.angle = mouseangle;
    }



    // Rendu de l'angle de la souris
    function renderMouseAngle() 
    {
        var centerx = player.x;
        var centery = player.y ;
    
        // Dessine l'angle 
        context.lineWidth = 5;
        context.strokeStyle = "#505050";
        context.beginPath();
        context.moveTo(centerx, centery);
        context.lineTo(centerx + 1.5*40 * Math.cos(degToRad(player.angle)),
                    centery - 1.5*40 * Math.sin(degToRad(player.angle)));
        context.stroke();
    }

    function setShootBubbles(angle){
        //Met la partie en mode "en train de tirer"
        gameStat=1;

        //Sauvegarde l'angle lors du clic 
        playerBubbles.angle=angle;

        //Définie la direction
        //Si on tire a droite
        if(degToRad(playerBubbles.angle)>=90){
            playerBubbles.direction=-1;
        }
        //Si on tire a gauche
        if(degToRad(playerBubbles.angle)<=90){
            playerBubbles.direction=1;
        }

    }
 
    function shootBubbles(dt){
        //Si prêt a tirer
        if(gameStat==1){


            //Regarde si collisions
            checkCollisions();

            //Si il y'a eu collisons
            if(gameStat==0){
               
                //Place le nouvaux bubbles dans le tableau du niveau
                placeBubble(postab.x,postab.y);
                //Regarde si un groupe de bulles est formé
                checkGrpBubbles(postab.x,postab.y);
                //Si au moins 3 bulles sont regroupé, les enlèves
                removeBubbles();
                //Change la couleur du player, le repositionne  et choisi une nouvelle couleur pour la prochaine
                playerBubbles.x=player.x-20;
                playerBubbles.y=player.y-20;
                playerBubbles.color=player.nextcolor;
                var nextcolor;
                do{
                    nextcolor=Math.floor(Math.random() * (5 - 0 + 1));
                }while(allcolor[nextcolor]==0);

                player.nextcolor=nextcolor;
                if(remainingshoot==0){
                    remainingshoot=5;
                    addBubbles();
                }
                removeFlyingBubbles1();
                removeFlyingBubbles2();

                
                
            }
            //Si aucune collisions
            if(gameStat==1){
            //Déplace le x
            playerBubbles.x += dt * playerBubbles.direction * 1000 * Math.cos(degToRad(playerBubbles.angle));
            //Déplace le y
            playerBubbles.y += dt * -1 * 1000 * Math.sin(degToRad(playerBubbles.angle));
            }
        }
    }
      


    function checkCollisions(){
        //Calcul la position en x du bubbles
        postab.x=Math.round((playerBubbles.x)/40);

        //Calcul la positions en y du bubbles
        postab.y=Math.round((playerBubbles.y-65)/40);


        //Regarde si il y'a collisions sur les mur
        if(playerBubbles.x>=(canvas.width-40) || playerBubbles.x<=0 ){
            //Change la trajectoire
            playerBubbles.direction*=-1;
        }
        
        //Regarde si il y'a collisions avec d'autres bubbles
        var x=postab.x;
        var y=postab.y;

        if(lvl[y][x+1]<=6){ //Droite
            gameStat=0;
        }
        if(lvl[y][x-1]<=6){ //Gauche
            gameStat=0;
        }

        //Si la ligne est paire
        else if((y+1)%2==0){
            //Haut gauche
            if(lvl[y-1][x]<=6){ 
                gameStat=0;
            }
            //Haut droite
            if(lvl[y-1][x+1]<=6){
                gameStat=0;
            }
        }
        
        //Si la ligne est impaire   (mais pas 0)
        else if((y+1)%2!=0 && y!=0){
            //Haut gauche
            if(lvl[y-1][x-1]<=6){ 
                gameStat=0;
            }
            //Haut droite
            if(lvl[y-1][x]<=6){
                gameStat=0;
            }
        }

        //Regarde si il y'a collisions avec le plafond
        if(playerBubbles.y<=66){
            gameStat=0;
        }
    }

    function placeBubble(x,y){
        //Place le bubbles dans le level
        lvl[y][x]=playerBubbles.color;
    }
    

     // Lors du clic
     function onMouseDown(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);
        
        if(gameStat==0){
            setShootBubbles(player.angle);
        }
    }

    function checkLoose(){
        for(var i=0;i<14;i++){
            if (lvl[11][i]<=6){
                gameStat=3;
                Stat="Défaite !"
            }
        }
    }

    function checkWin(){
        var test=0;
        for(var i=0;i<11;i++){
            for(var j=0;j<level.nbcols;j++){
                if(lvl[j][i]<=6){
                    test++;
                }
            }
        }
        if(test==0){
            gameStat=2;
            Stat="Victoire !"
        }
    }   


    function checkGrpBubbles(x,y){
        //Gauche
        if(lvl[y][x-1]==playerBubbles.color){
            lvl[y][x-1]=6;
            checkGrpBubbles(x-1,y)
        }
        //Droite
        if(lvl[y][x+1]==playerBubbles.color){
            lvl[y][x+1]=6;
            checkGrpBubbles(x+1,y)
        }
        //Si la ligne est paire
        if((y+1)%2==0){
            //Haut gauche
            if(lvl[y-1][x]==playerBubbles.color){
                lvl[y-1][x]=6;
                checkGrpBubbles(x,y-1)
            }
            //Haut droite
            if(lvl[y-1][x+1]==playerBubbles.color){
                lvl[y-1][x+1]=6;
                checkGrpBubbles(x+1,y-1)
            }
            //Bas gauche
            if(lvl[y+1][x]==playerBubbles.color){
                lvl[y+1][x]=6;
                checkGrpBubbles(x,y+1)
            }
            //Bas droite
            if(lvl[y+1][x+1]==playerBubbles.color){
                lvl[y+1][x+1]=6;
                checkGrpBubbles(x+1,y+1)
            }    
        }
        //Si la ligne est impaire mais n'est pas 0
        if((y+1)%2!=0 && y!=0){
            //Haut gauche
            if(lvl[y-1][x-1]==playerBubbles.color){
                lvl[y-1][x-1]=6;
                checkGrpBubbles(x-1,y-1)
            }
            //Haut droite
            if(lvl[y-1][x]==playerBubbles.color){
                lvl[y-1][x]=6;
                checkGrpBubbles(x,y-1)
            }
            //Bas gauche
            if(lvl[y+1][x-1]==playerBubbles.color){
                lvl[y+1][x-1]=6;
                checkGrpBubbles(x-1,y+1)
            }
            //Bas droite
            if(lvl[y+1][x]==playerBubbles.color){
                lvl[y+1][x]=6;
                checkGrpBubbles(x,y+1)
            }
        }

    }

    function removeBubbles(){
        var test=0;
        for (var i=0;i<11;i++){
            for (var j=0;j<level.nbcols;j++){
                if(lvl[i][j]==6){
                    test++;
                }
            }
        }
        if(test>=3){
            for (var i=0;i<11;i++){
                for (var j=0;j<level.nbcols;j++){
                    if(lvl[i][j]==6){
                        lvl[i][j]=7;
                    }
                }
            }
        }
        else{
            for (var i=0;i<11;i++){
                for (var j=0;j<level.nbcols;j++){
                    if(lvl[i][j]==6){
                        lvl[i][j]=playerBubbles.color;
                    }
                }
            }
            remainingshoot--;
        }
    }


    function removeFlyingBubbles1(){
        for(var i=1;i<11;i++){
            for(var j=0;j<level.nbcols;j++){
                var test=0;
                //Gauche
                if(lvl[i][j-1]<=6){
                    test++;
                }
                //Droite
                if(lvl[i][j+1]<=6){
                    test++;
                }
                //Si la ligne est paire
                if((i+1)%2==0){
                    //Haut gauche
                    if(lvl[i-1][j]<=6){
                        test++;
                    }
                    //Haut droite
                    if(lvl[i-1][j+1]<=6){
                        test++;
                    }     
                }
                else{
                    //Haut gauche
                    if(lvl[i-1][j-1]<=6){
                        test++;
                    }
                    //Haut droite
                    if(lvl[i-1][j]<=6){
                        test++;
                    }
                }

                if (test==0){
                    lvl[i][j]=7;
                }
            }
        }
    }

    function removeFlyingBubbles2(){
        var test=0;
        var lastrows=11;
        for(var i=11;i>0;i--){
            test=0;
            for(var j=0;j<level.nbcols;j++){
                if(lvl[i][j]<=6){
                    test++;
                }
            }
            if(test==0){
                lastrows=i;
            }
        }

        for(var i=lastrows;i<11;i++){
            for(var j=0;j<level.nbcols;j++){
                lvl[i][j]=7;
            }
        }
    }

    function addBubbles(){
        for(var i=11;i>0;i--){
            for(var j=0;j<level.nbcols;j++){
                lvl[i][j]=lvl[i-1][j];
            }
        }
        var color=0;
        for(var i=0;i<level.nbcols;i++){
            do{
            color=Math.floor(Math.random() * (5 - 0 + 1));
            }while(allcolor[color]==0);

            lvl[0][i]=color;
        }
    }

    function checkColor(){
        allcolor=[0,0,0,0,0,0];
        var color;
        for(var i=0;i<11;i++){
            for(var j=0;j<level.nbcols;j++){
                color=lvl[i][j];
                allcolor[color]++;
            }
        }
    }

    // Lance la partie
    init();
};



