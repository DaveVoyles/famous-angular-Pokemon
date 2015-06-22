'use strict';

angular.module('famousAngularStarter')
  .controller('PokemonCtrl', ['$scope', '$http', '$famous', function ($scope, $http, $famous) {
          
    /* Inject famo.us to DOM */
    var View           = $famous['famous/core/View'                 ];
    var Modifier       = $famous['famous/core/Modifier'             ];
    var Surface        = $famous['famous/core/Surface'              ];
    var Transform      = $famous['famous/core/Transform'            ];
    var Transitionable = $famous['famous/transitions/Transitionable'];
    var Timer          = $famous['famous/utilities/Timer'           ];


  /*******************************************
  * -------------- Variables -----------------
  *******************************************/
  $scope.sizeX           = window.innerWidth;
  $scope.sizeY           = window.innerHeight;
  $scope.dbURL           = "http://pokeapi.co/api/v1/pokemon/";
  $scope.imgDbURL        = "http://img.pokemondb.net/artwork/";
  $scope.leftMargin      =   0.1;
  $scope.offsetY         =  35;  // How far should each item in the list be from one another when drawn to screen on Y-axis?
  $scope.topLayerZ       =  20;  // For all UI items that should be at the very top layer (buttons, images, etc)
  $scope.textContSizeY   =  35;
  $scope.flipDelay       = 200;

  $scope.origin          = {
   topLeft:                [0,   0  ],
   topCenter:              [0,   0.5],
   topRight:               [1,   0  ],
   center:                 [0.5, 0.5],
   centerRight:            [1,   0.5],
   bottomCenter:           [0.5, 1  ],
   bottomRight:            [1,   1  ]
  };

  $scope.align          =  {
    frontName:             [0.50,                     0.10],
    frontImg:              [0.50,                     0.40],
    infoBtn:               [0.50,                     0.78],
    nextBtn:               [0.50,                     0.92],
    typeImg:               [$scope.leftMargin -0.05,  0.05],
    typeText:              [0.20,                     0.06],
    hitPoints:             [0.70,                     0.06],
    backName:              [$scope.leftMargin,        0.13],
    backImg:               [0.5,                      0.38],
    abilHeader:            [$scope.leftMargin,        0.61],
    abilText:              [$scope.leftMargin + 0.55, 0.74],
    backBtn:               [0.50,                     0.88],
    center:                [0.50,                     0.50]
  };
  
  $scope.size            = {
    frontName:             [150,  30],
    btn:                   [100,  50],
    hitPoints:             [ 80, $scope.textContSizeY],
    types:                 [ 80, $scope.textContSizeY],
    name:                  [150, $scope.textContSizeY],
    img:                   [250, 250],
    imgType:               [150, 150],
    abilities:             [260,  50]
  };

  $scope.opac            = {
    colorBg:               0.75,
    imgFront:              new Transitionable(0.3),
    nextBtn:               new Transitionable(1)
  };

  $scope.scale           = {
    imgFront:              new Transitionable([1.2, 1.2]),
    nextBtn:               new Transitionable([1.0, 1.0]),
    infoBtn:               new Transitionable([1.0, 1.0]),
    backBtn:               new Transitionable([1.0, 1.0]),
    colorBg:               [0.97,  0.97],
    imgBack:               [0.85,  0.87],
    imgType:               [0.2,   0.2],
    textureBg:             [0.975, 0.975]
  };

  $scope.trans           = {
    topLayer:              [0,0,$scope.topLayerZ],
    colorBg:               [0,0,6], // Keep this on top of texturedBG (Make it have a higher Z-value)
    textureBg:             [0,0,4]
  };

  $scope.bgColor         = "green-bg";
  $scope.bgColorPrev     = "";
  
  /* Strings / defaults for the main view */
  $scope.hp              = "HP:"                    ;
  $scope.nextBtn         = "Next"                   ;
  $scope.infoBtnText     = "More Info"              ;
  $scope.backBtn         = "Back"                   ;
  $scope.name            = "Bulbasaur"              ;
  $scope.imageUrl        = "images/Bulbasaur.png   ";
  $scope.imageTypePath   = "images/types/"          ;
  $scope.imageTypeUrl    = "images/types/Poison.png";
  $scope.bgImgUrl        = "images/metal.jpg"       ;
  $scope.hitPoints       = 50                       ;
  $scope.levelUpInt      = 17                       ;
  $scope.levelUpTo       = "Venosaur"               ;
  
  /*  Used to retrieve a random Pokemon from DB */
  $scope.pokemonNum      = 1                        ;
  $scope.minVal          = 1                        ;
  $scope.maxVal          = 40                       ;

  $scope.abilities       = [
    { name: "Sleep"},
    { name: "Eat"  }
  ];
  $scope.types           = { name: "Grass" }        ;



   /*******************************************
   * ------------- Animations -----------------
   *******************************************/

  /*
   * Only happens once, when app is first loaded.
   */
  $scope.frontImgEnterAnim = function() {
    $scope.opac. imgFront.set(1,            {duration: 1000, curve: "easeIn"});
    $scope.scale.imgFront.set([0.80, 0.80], {duration: 1000, curve: "easeIn"});
  };


  /*
   * @OnClick: Button appears depressed and shrinks in scale before returning to original scale
   */
  $scope.nextBtnPressAnim = function(){
    $scope.scale.nextBtn    .set([0.9, 0.9], {duration: 100, curve: "easeIn"},
      function returnToOrigSize () {
        $scope.scale.nextBtn.set([1.0, 1.0], {duration: 100, curve: "easeIn"})
      }
    )
  };


  /*
   * @OnClick: Button appears depressed and shrinks in scale before returning to original scale
   */
  $scope.infoBtnPressAnim = function(){
    $scope.scale.infoBtn      .set([0.9, 0.9], {duration: 100, curve: "easeIn"},
        function returnToOrigSize () {
          $scope.scale.infoBtn.set([1.0, 1.0], {duration: 100, curve: "easeIn"})
      }
    )
  };


  /*
   * @OnClick: Button appears depressed and shrinks in scale before returning to original scale
   */
  $scope.backBtnPressAnim = function(){
    $scope.scale.backBtn      .set([0.9, 0.9], {duration: 100, curve: "easeIn"},
        function returnToOrigSize () {
          $scope.scale.backBtn.set([1.0, 1.0], {duration: 100, curve: "easeIn"})
        }
    )
  };


  /*
   * @OnClick: Sets the opacity and scale for the front image when user clicks "Next" btn
   * 1) Turns opacity invisible quickly before returning to original opacity, revealing new Pokemon
   * 2) Turns scale down before quickly turning it back up to original size
   */
  $scope.frontImgAnim = function() {
    var hideDuration   =  200;
    var returnDuration = 1300;

    $scope.opac.imgFront.    set(0,           {duration: hideDuration,   curve: "easeIn"},
      function returnToOrigOpacity() {
        $scope.opac.imgFront.set(1,           {duration: returnDuration, curve: "easeIn"})
      }
    );
    $scope.scale.imgFront    .set([0.5, 0.5], {duration: hideDuration,   curve: "easeIn"},
      function returnToOrigSize() {
        $scope.scale.imgFront.set([0.8, 0.8], {duration: returnDuration, curve: "easeIn"})
      }
    )
  };


  /*
   * Handles flipping between the two pages (front / back).
   * Adds a brief delay between the time the button is pressed and when it flips so that
   * users can see the button being pressed
   */
  $scope.flip      = function(){
    Timer.setTimeout(function() {
      $famous.find("#flipper")[0].flip();
      },
    $scope.flipDelay);
  };


  /* Sets background color based on type of Pokemon
   * 1) Stores the previous background color, so we can remove it from the class list
   * 2) Grabs the first type from the list and sets color based on that
   * 3) Calls a function to find the surface to set add the new bg class to
   */
  var determineNewBgColor = function() {
    $scope.bgColorPrev = $scope.bgColor;

    switch ($scope.types.name){
      case "Grass":{
        $scope.bgColor = "green-bg"      ;
      } break;
      case "Poison": {
        $scope.bgColor = "green-bg"      ;
      } break;
      case "Fire": {
        $scope.bgColor = "red-bg"        ;
      } break;
      case "Normal": {
        $scope.bgColor = "grey-bg"       ;
      } break;
      case "Water": {
        $scope.bgColor = "blue-bg"       ;
      } break;
      case "Bug": {
        $scope.bgColor = "brown-bg"      ;
      } break;
      case "Flying": {
        $scope.bgColor = "dark-white-bg" ;
      } break;
      case "Ground": {
        $scope.bgColor = "dark-brown-bg" ;
      } break;
      case "Fairy": {
        $scope.bgColor = "pink-bg"       ;
      } break;
      case "Normal": {
        $scope.bgColor = 'grey-bg'       ;
      } break;
      default: {
        $scope.bgColor = "grey-bg"       ;
      } break;
    }

    setNewBgColor();
    $scope.imageTypeUrl = $scope.imageTypePath + $scope.types.name + ".png";
  };
  

  /*
   * 1) Finds the renderNode surfaces for front & back in the DOM
   * 2) Removes the previous bgColor class and adds the new one
   */
  var setNewBgColor = function() {
    var front = $famous.find("#colored-bg-front")[0].renderNode;
        front.removeClass($scope.bgColorPrev);
        front.addClass   ($scope.bgColor    );
    var back = $famous.find("#colored-bg-back"  )[0].renderNode;
        back.removeClass ($scope.bgColorPrev);
        back.addClass    ($scope.bgColor    );
  };



  /*
   * Returns a random num, which determines the next pokemon to pull from DB
   */
  var getRandomInt = function(min, max) {
    $scope.pokemonNum = Math.floor(Math.random() * (max - min)) + min;
  };
  
  
  /*
   * Grab Pokemon from the DB
   */
  $scope.getPokemon = function () {  
    
    // Generate a random num and use it for the next pokemon
    getRandomInt($scope.minVal, $scope.maxVal);
    
    // Retrieve data from DB and draw it to screen
    $http.get($scope.dbURL + $scope.pokemonNum + "/")
      .success(function(data) {
        $scope.name       = data.name;
        $scope.imageUrl   = $scope.imgDbURL + $scope.name.toLowerCase() + '.jpg';

        /* 1) Empty out the current array to store the new items in there
         * 2) Capitalize the first character for each ability from the database
         * 3) Store that ability in a new abilityObj & add it into the abilities array
         */
        $scope.abilities.length = 0;
        for (var i = 0; i < data.abilities.length; i++){
         var capitalizedString = capitalizeFirstLetter(data.abilities[i].name);
         var abilityObj        = {name: capitalizedString };
          $scope.abilities.push(abilityObj);
        }

        $scope.hitPoints  = data. hp;
        var firstType     = data.types[0].name;
        $scope.types.name = capitalizeFirstLetter(firstType);
        determineNewBgColor();
      })
      .error(function(status){
        console.log(status);
        $scope.name = "Couldn't get Pokemon from the DB";
      });
  };


    /*
     * Used on Type and each ability returned from Pokemon DB
     */
   var capitalizeFirstLetter = function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    /********************************   
     * Called as soon as page loads 
     *******************************/
//    $scope.getPokemon(); // Just commented out to save on the number of calls we make during DEBUG
    getRandomInt($scope.minVal, $scope.maxVal);
    $scope.frontImgEnterAnim();
//    determineNewBgColor();
//
}]);
