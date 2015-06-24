#  famous-angular-Pokemon
### Author(s): Dave Voyles | [@DaveVoyles](http://www.twitter.com/DaveVoyles)
### URL: [www.DaveVoyles.com][1]

Sample project for using Famo.us + Angular to create a mobile application
----------
### Objective

*[View the project in your browser](http://famous-angular-pokemon.azurewebsites.net/app/#/)*

I love high performance JavaScript, and have faith that others will finally come around and understand its true potential someday too. Famo.us allows you to maintain a silky smooth 60 Frames Per Second while having fluid animations on screen. Famo.us does this by utilizing the CSS3 primitive -webkit-transform: matrix3d, which lets the framework compute the composite matrix and skip the browser’s renderer. No plug-in, no download, no hack. By appending this to each DIV, developers can render the composite matrix and go straight to the GPU. 

I go more in depth when discussing the ins-and-outs of Famo.us in an [earlier blog post.](http://www.davevoyles.com/creating-a-mobile-app-with-famo-us-and-manifoldjs/) Thanks again to [Zack Brown](https://twitter.com/zackaboo) for all of your assistance with this!

### By the end of this project you will be able to:

- Understand how Angular works within the context of a Famo.us application
- Harness the true power of JavaScript and the good parts of HTML5
- Create smooth animations 

My goal for this project to illustrate how easily you can create HTML5 / JS projects which work at near native speeds on mobile applications. 

### Features
 - The mobile applications runs on iOS and Android via Cordova
 - The Win 10 app runs natively on Win 10
 - This project can also be run as a standard website, although I have it scaled best for mobile devices

### Requirements
- PC or Mac
- Web server


### Setup
 1.  Download the source [from GitHub](https://github.com/DaveVoyles/famous-angular-Pokemon)
 2.  Download & install a web server [(I use MAMP on OS X, or the built-in IIS server with Visual Studio on Windows)] (https://www.mamp.info/en/)


### Opening the project
1. Start your web server
2. Navigate to **famous-angular-Pokemon/app/**


### Still to do:
I plan on wrapping this as a Cordova project, so I'll be sure to update this as I do.

---------
### How it works

#### Hitting the database
I pull all of the information from the [PokeAPI](http://pokeapi.co/), which has a well documented API, but it's missing images for each of the pokemon. For the images, I just pull the name of the currently chosen pokemon and appending it to the end of this URL: *http://img.pokemondb.net/artwork/*. For example:[http://img.pokemondb.net/artwork/venusaur.jpg](http://img.pokemondb.net/artwork/venusaur.jpg) will lead you to an image of Vanosaur. Nifty, right? Sadly, they do not have an API available. 

Each time the user presses the **Next** button, a random number is generated between a min / max value that I've defined (say, 1-20), and it pulls a pokemon from the database which matches that number. Here's what it looks like:

*http://pokeapi.co/api/v1/pokemon/1/* returns a JSON object for Bulbasaur. [You can play with their API here.](http://pokeapi.co/)

#### Looping through the data

I then loop through that JSON object and set the properties I find there to variables in Angular, using the $Scope object. 

Here's an example:

```javascript
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
  ```
  
You may notice that I also have a few other functions here, such as *capitalizeFirstLetter*, which does exactly that. I wanted the abilities and type (ex: poison, grass, flying) to have have the first letter capitalized, since it comes back from the database in all lowercase characters. 
  
  I also loop through the abilities and push them to an ability object, which looks like this:
  
  ```javascript
   $scope.abilities       = [
    { name: "Sleep"},
    { name: "Eat"  }
  ];
  ```
  
  The databse also returns multiple types for certain pokemon, such as Charizard, who is flying as well as fire. To keep things simple though, I only wanted to return one from the database. 
  
  ```javascript
  $scope.types      = { name: "Grass" }        ;
  
  var firstType     = data.types[0].name;
  ```
  
  
### Drawing it to the screen

Famo.us has two waves of drawing content to the screen, by creating "surfaces", which are the elements that contain your text, images, etc.:

1. JavaScript 
2. FA-Directives (HTML)

I didn't use JavaScript to draw the surfaces in this app, instead I chose to only use FA (Famous-Angular) Directives, such as:

```HTML
        <!-- Name-->
        <fa-modifier
            fa-origin    ="origin.center"
            fa-align     ="align.frontName"
            fa-size      ="size.frontName"
            fa-translate ="trans.topLayer">
            <fa-surface
                class    ="front-name-text">
                {{name}}
            </fa-surface>
        </fa-modifier>
```

The name above the Pokemon on the front screen.

You'll notice that the surface is wrapped by a **fa-modifier**. [You can read about those here](https://famo.us/integrations/angular/docs/unstable/api/directive/faModifier/) but they essentally adjust the properties of a surface, such as alignment, size, and origin. It took me a while to wrap my head around the difference between alignment and origin, so here's how I came to understand it:

**Origin**
The reference point on any surface. If I want to draw a rectangle and move it around the screen, I need to decide which point on that rectangle will be my starting point. The [Famo.us docs](https://famo.us/guides/layout) explain it well. The values are laid out as such:

```javascript
  $scope.origin          = {
                         // X    Y 
   topLeft:                [0,   0  ],
   topRight:               [1,   0  ],
   center:                 [0.5, 0.5],
   bottomLeft:             [0,   1  ],
   bottomRight:            [1,   1  ]
  };
  ```

**Alignment**
A surface's location on the screen. When you make changes to the alignment, it is using the origin as the reference point to start from. 


```javascript
  $scope.align          =  {
                          // X        Y 
    frontName:             [0.50,    0.10],
    frontImg:              [0.50,    0.40],
    backImg:               [0.5,     0.38],
    center:                [0.50,    0.50]
  };
  ```
### Where Angular finally comes in
Now here's where you can put all of your angular skills and databinding to work with the Angular implementation here. If you're already experienced with Angular, then it's not radically different here. 
  
  ```html
       <!-- Next button -->
        <fa-modifier
            fa-origin    ="origin.center"
            fa-align     ="align.nextBtn"
            fa-size      ="size.btn"
            fa-scale     ="scale.nextBtn.get()"
            fa-translate ="trans.topLayer">
            <fa-surface
                class    ="one-edge-shadow center-align next-btn"
                ng-click ="getPokemon(); nextBtnPressAnim(); frontImgAnim()">
                {{nextBtn}}
            </fa-surface>
        </fa-modifier>
```

This button appears on the first screen and simply pulls another pokemon frmo the database. All of the ng (angular) directives you are familar with are here, such as *ng-click.* I have multiple functions here (NOTICE: They are not comma separated). 

I am also binding the value of *$scope.nextBtn* to *{{nextBTn}}* in  HTML. 

To allow Famo.us and Angular to work together, we need to include $Famo.us at the top of our javascript file. Here's how you do it:

```javascript
angular.module('famousAngularStarter')
  .controller('PokemonCtrl', ['$scope', '$http', '$famous', function ($scope, $http, $famous) {
          
    /* Inject famo.us to DOM */
    var View           = $famous['famous/core/View'                 ];
    var Modifier       = $famous['famous/core/Modifier'             ];
    var Surface        = $famous['famous/core/Surface'              ];
    var Transform      = $famous['famous/core/Transform'            ];
    var Transitionable = $famous['famous/transitions/Transitionable'];
    var Timer          = $famous['famous/utilities/Timer'           ];
```
  
### Animations
What would a high performance app be without animations? Famo.us is packed with them, which makes it easy to get started. Here's one for animating the image on the front.

```javascript
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
  ```
  
  There are several curve types you can use here. [Check out the docs for more info.](https://famo.us/integrations/angular/docs/unstable/api/directive/faAnimation/) I'm also usinga callback function, *returnToOrigSize* to have the image grow and then shrink back to the original size. 


## Points of frustration
----------
I ran into a few issues a long the way.

- *FA-Directies have their properties set as strings*
```html
 fa-origin    ="origin.center"
```
If you have a spelling error, the app will just use the default values for that property. This snagged me several times, which is why you see I set all of my properties as an object, such as *align.frontName*, to make it easier to read. 


- *Adding classes*
In FA-Directives you add multiple classes as strings, and they are NOT comma separated.
```html
            <fa-surface
                class    ="one-edge-shadow center-align next-btn"
                ng-click ="infoBtnPressAnim(); flip()">
                {{infoBtnText}}
            </fa-surface>
```
If you try to add classes by creating surfaces in JavaScript, you pass in an array of strings:
```javascript
    var logo = new Surface({
        properties: {
             ...
        },
        classes: ['backfaceVisibility, class-two'] 
    });
```
It took me a while to understand that, as I only found the solution [in this thread.](https://github.com/Famous/famous-angular/issues/150)


- *Famo.us + Angular seems to be depreicated (for now)*
Midway through this project I saw that Famo.us was working on an improved version of the framework which includes [Mixed Mode.](http://famous.org/) Famous + Angular doesn't take advantage of these aditions (yet) at least. That doesn't mean FA is going anywhere, as it works perfectly fine, just that you won't get getting the latest features.  


----------
## Resources

- [Famo.us Slackchat ](http://famous.org/support/)
- [BizSpark, for free MSFT dev licenses and web hosting](http://davevoyles.azurewebsites.net/bizspark-free-software-cloud-services-o/)
- [E-mail me with questions](mailto:Dvoyles@microsoft.com "Dvoyles@microsoft.com")

----------

##Change Log
###v1.0.0
Initial build of the app


  [1]: http://www.daveVoyles.com "My website"
