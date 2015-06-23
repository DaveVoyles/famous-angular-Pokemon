#  famous-angular-Pokemon
### Author(s): Dave Voyles | [@DaveVoyles](http://www.twitter.com/DaveVoyles)
### URL: [www.DaveVoyles.com][1]

Sample project for using Famo.us + Angular to create a mobile application
----------
### Objective

I love high performance JavaScript, and have faith that others will finally come around and understand its true potential someday too. Famo.us allows you to maintain a silky smooth 60 Frames Per Second while having fluid animations on screen. Famo.us does this by utilizing the CSS3 primitive -webkit-transform: matrix3d, which lets the framework compute the composite matrix and skip the browser’s renderer. No plug-in, no download, no hack. By appending this to each DIV, developers can render the composite matrix and go straight to the GPU.

By the end of this project you will be able to:

- Understand how Angular works within the context of a Famo.us application
- Harness the true power of JavaScript and the good parts of HTML5

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

### How it works

#### Hitting the database
I pull all of the information from the [PokeAPI](http://pokeapi.co/), which has a well documented API, but it's missing images for each of the pokemon. For the images, I just pull the name of the currently chosen pokemon and appending it to the end of this URL: *http://img.pokemondb.net/artwork/*. For example:[http://img.pokemondb.net/artwork/venusaur.jpg](http://img.pokemondb.net/artwork/venusaur.jpg) will lead you to an image of Vanosaur. Nifty, right? Sadly, they do not have an API available. 

Each time the user presses the **Next** button, a random number is generated between a min / max value that I've defined (say, 1-20), and it pulls a pokemon from the database which matches that number. Here's what it looks like:

*http://pokeapi.co/api/v1/pokemon/1/* returns a JSON object for Bulbasaur. [You can play wit htheir API here.](http://pokeapi.co/)

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
  $scope.types           = { name: "Grass" }        ;
  
  var firstType     = data.types[0].name;
  ```


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
