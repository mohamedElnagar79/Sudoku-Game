window.addEventListener("load",function(){
  let loginBtn = document.querySelector("input[value=Login]");
  let userName = document.querySelector("#playerName");
  let boxTopSection = document.querySelectorAll(".box-top");
  let selectedImg = document.querySelector(".gamecards");
  let gamePageSec = document.querySelector(".gamePage");
  let idobj = document.createElement("span");
  let sec;
  let startGame = document.querySelector(".startbtn");
  let timerText = document.querySelector(".timer");
  let containGameBoxes = document.querySelector(".game-space");
  let containbigBoxes = document.querySelector(".big-game-space");
  let boxTopSection2 = document.querySelectorAll(".box2-top");
  let gallerySection = document.querySelector(".galleryPage");
  let formSection = document.querySelector(".formPage");
  let gallerySectionLevel2 = document.querySelector(".galleryPageLevel2");
  let level1Btn = gallerySection.querySelectorAll("button");
  let level2Btn = gallerySectionLevel2.querySelectorAll("button");
  let resultArray = [];
  let colLength;
  loginBtn.addEventListener("click",getAndSetPLayerName);
  // on click at button login
  function getAndSetPLayerName () {
    let userNameObj= document.querySelector("#nameInput");
    let levelSelectd = document.querySelector("select option:checked").value;
    userName.innerText=userNameObj.value;
    localStorage.setItem("levelSelected",levelSelectd);
    formSection.style.display="none";
    if(levelSelectd == "1"){
      gallerySection.style.display="block";
      sec= 60;
      colLength=3; //length of game col area
      // create  level groups
      for (let group of boxTopSection){
        for(let i=1;i<=4;i++){
         let containImgObj = document.createElement("div");
         let imgObj = document.createElement("img")
         imgObj.src= `/assets/images/${group.id}/${i}.jpg `;
         imgObj.id=i;
         idobj = document.createElement("span");
         idobj.innerText=i;
         containImgObj.append(imgObj);
         containImgObj.append(idobj);
         group.append(containImgObj)
       }
     } 
    }
    else if (levelSelectd == "2") {
     gallerySectionLevel2.style.display = "block";
     sec=80;
     colLength =8;//length of game col area
     // create level 2 groups
     for(let group of boxTopSection2){
       for(let i=1;i<=9;i++){
         let containImgObj = document.createElement("div")
         let imgObj = document.createElement("img")
         imgObj.src= `/assets/images/${group.id}/${i}.jpg `;
         imgObj.id=i;
         idobj = document.createElement("span");
         idobj.innerText=i;
         containImgObj.append(imgObj);
         containImgObj.append(idobj);
         group.append(containImgObj);
        }
      }
    }
 }
  // on click at  level 1 group btns
   for(let i=0 ;i<level1Btn.length;i++){
      level1Btn[i].addEventListener("click",function(){
         let x=  this.parentElement.parentElement.firstElementChild;
         gallerySection.style.display="none";
         gamePageSec.style.display="block";
         selectedImg.append(x);
       })
   }//  end of loop
    // level 2 group btn
   for(let i=0;i<level2Btn.length;i++){
     level2Btn[i].addEventListener("click",function(){
       let x=  this.parentElement.parentElement.firstElementChild;
       gallerySectionLevel2.style.display="none";
       gamePageSec.style.display="block";
       selectedImg.append(x);
     })
    }
  
 function countTimeDown() { // timer 
        function count() {
          sec--;
          timerText.innerHTML =
            "0:" + (sec < 10 ? "0" : "") + String(sec);
          if (sec > 0) {
            setTimeout(count, 1000);
          }else {
              timerText.innerHTML = "";
              let imagesObj = containGameBoxes.querySelectorAll("img");
              for(let i=0;i<imagesObj.length;i++){
                 resultArray.push(imagesObj[i].id);
               }
               console.log("result ",resultArray);
               console.log("sol Arr ",localStorage.solArray)
               if(resultArray==localStorage.solArray){
                  alert("sucess");
                  location.reload();
               }else{
                 alert("loser");
                 location.reload();
               } 
          }
        }
        count();
  }
  

  // api 4*4 async function
  
  async function getRandomImges(level){
    let imgArray = [];
    let solArray=[];
    let response = await fetch(`https://sudoku-api.deta.dev/?type=${level}`);
    let randomIMg = await response.json();
    for(let item in randomIMg.board){
       imgArray.push(randomIMg.board[item]);
    }
    for (let item in randomIMg.solution){
         solArray.push(randomIMg.solution[item]);
    }
    localStorage.setItem("solArray",solArray);
    // create game space boxes
    for (let row=0;row<level;row++){
       for (let col=0;col<level;col++){
          let boxGame = document.createElement("div");
          boxGame.classList.add("game");
          boxGame.id = row.toString() + ""+ col.toString();
          // console.log(boxGame.id);
          if (level=="4"){
            containGameBoxes.append(boxGame);
          }else if (level =="9"){
               containbigBoxes.append(boxGame);
          }
       }
    } 
    //  function to convert abi array num to images
   function convertNumberToImg(Imgobjindex,index){
      let randImg = document.createElement("img");
      randImg.src= selectedImg.children[0].children[Imgobjindex-1].children[0].src;
      randImg.id= selectedImg.children[0].children[Imgobjindex-1].children[0].id;
      randImg.classList.add("responsive-img");
      if(localStorage.levelSelected == "1"){
          containGameBoxes.children[index].append(randImg);
      }else if(localStorage.levelSelected == "2"){
        containbigBoxes.children[index].append(randImg);
      }
    }
    // add images to game boxes
    for(let i in imgArray){
      if (imgArray[i]=="."){
         if(localStorage.levelSelected == "1"){
             containGameBoxes.children[i].innerText="";
        }else if(localStorage.levelSelected == "2"){
             containbigBoxes.children[i].innerText="";
        }
      }else convertNumberToImg(imgArray[i],i)
    }
  }

  // end of async function 4*4
  // ******* on click start game *************** // 
  startGame.addEventListener("click",function(){
   containGameBoxes.innerHTML="";
   if(localStorage.levelSelected == "1"){
     getRandomImges(4);
   }
   else if(localStorage.levelSelected == "2"){
    getRandomImges(9);
   }
   countTimeDown();
  },{"once":"true"});

      //  to get selected images to box game space
      function getIMg(i){
        let gameImg = document.createElement("img");
            gameImg.classList.add("responsive-img");
            gameImg.src=selectedImg.children[0].children[i].children[0].src
            gameImg.id= selectedImg.children[0].children[i].children[0].id;
            currentElement.append(gameImg);
      }
  // move in game box with keyboard and change value
  let col = 0;
  let row =0;
  let currentElement = document.createElement("div");
  this.document.body.addEventListener("keydown",function(e){
    if (e.key == "ArrowRight") {
        if (col < colLength) {
          col++;
          currentElement.style.border = "2px solid #000";
          currentElement = document.getElementById(row + "" + col);
          currentElement.style.border = "2px solid blue";
        } 
    }
    else if (e.key == "ArrowLeft"){
        if (col >0){
          col--;
          currentElement.style.border = "2px solid #000";
          currentElement = document.getElementById(row + "" +col);
          currentElement.style.border = "2px solid blue";
        }
    }
    else if (e.key == "ArrowDown"){
      if (row<colLength){
        row++;
        currentElement.style.border = "2px solid #000";
        currentElement = document.getElementById(row + "" +col);
        currentElement.style.border = "2px solid blue";
      }
    }
    else if (e.key == "ArrowUp"){
      if (row>0){
        row--;
        currentElement.style.border = "2px solid #000";
        currentElement = document.getElementById(row + "" +col);
        currentElement.style.border = "2px solid blue";
      }
    }
    else if (e.key =="1"){
      if (currentElement.innerHTML==""){
         getIMg(0);
      }
      
    }
    else if (e.key =="2"){
      if(currentElement.innerHTML=="") {
         getIMg(1);   
      }
    }
    else if (e.key =="3"){
      if(currentElement.innerHTML=="") {
          getIMg(2);
      }
    }
    else if (e.key =="4"){
      if(currentElement.innerHTML=="") {
        getIMg(3);
      }
    }
    else if (e.key =="5"){
      if(currentElement.innerHTML=="" &&localStorage.levelSelected == "2") {
        getIMg(4);
      }
    }
    else if (e.key =="6"){
      if(currentElement.innerHTML==""&&localStorage.levelSelected == "2") {
        getIMg(5);
      }
    }
    else if (e.key =="7"){
      if(currentElement.innerHTML==""&&localStorage.levelSelected == "2") {
        getIMg(6);
      }
    }
    else if (e.key =="8"){
      if(currentElement.innerHTML==""&&localStorage.levelSelected == "2") {
        getIMg(7);
      }
    }
    else if (e.key =="9"){
      if(currentElement.innerHTML==""&&localStorage.levelSelected == "2") {
        getIMg(8);
      }
    }
    else if(e.key == "Delete"){
         currentElement.innerHTML="";
    }
    else if (e.key == "Enter") {
      let imagesObj  
      if(localStorage.levelSelected == "2"){
        imagesObj = containbigBoxes.querySelectorAll("img");
      }
      else if (localStorage.levelSelected == "1"){
        imagesObj= containGameBoxes.querySelectorAll("img");
      }
      if (imagesObj.length>7){
         for(let i=0;i<imagesObj.length;i++){
            resultArray.push(imagesObj[i].id);
          }
          console.log(resultArray);
          if(resultArray==localStorage.solArray){
              alert("sucess");
              location.reload();
            }else {
                alert("loser");
                location.reload();
            }
      }else {
        e.preventDefault();
      }
    }
  });
})