class FluentRestaurants{

  constructor(jsonData) {
    this.data = jsonData;
  }

  //fromState(stateStr: string): FluentRestaurants
  fromState(stateStr){
    let result = [];
    //filters array of jsonData to produce an array of restaurant objects in state given by stateStr
    result = this.data.filter(function(restaurant){ 
      let obj = lib220.getProperty(restaurant, 'state'); 
      if (obj.found === true){
        return (obj.value === stateStr);
      }
    });
    //If there are no restaurants in states equal to stateStr return an empty object
    if (result.length === 0){
      return {};
    }
    else{
      return new FluentRestaurants(result);
    }
  }

  //ratingLeq(rating: number): FluentRestaurants
  ratingLeq(rating){
    let result = [];
    //filters array of jsonData to produce an array of restaurant objects with star rating less than or equal to rating parameter 
    result = this.data.filter(function(restaurant){ 
      let obj = lib220.getProperty(restaurant, 'stars'); 
      if (obj.found === true){
        return (obj.value <= rating);
      }
    });
    //If there are no restaurants with stars less than or equal to rating return an empty object
    if (result.length === 0){
      return {};
    }
    else{
      return new FluentRestaurants(result);
    }
  }
    //ratingGeq(rating: number): FluentRestaurants
    ratingGeq(rating){
    let result = [];
    //filters array of jsonData to produce an array of restaurant objects with star rating greater than or equal to rating parameter 
    result = this.data.filter(function(restaurant){ 
      let obj = lib220.getProperty(restaurant, 'stars'); 
      if (obj.found === true){
          return (obj.value >= rating);
      }
    });
    //If there are no restaurants with stars greater than or equal to rating return an empty object
    if (result.length === 0){
      return {};
    }
    else{
      return new FluentRestaurants(result);
    }
  }

    //reviewsGeq(review: number): FluentRestaurants
    reviewsGeq(review){
    let result = [];
    //filters array of jsonData to produce an array of restaurant objects with number of reviews greater than or equal to review parameter 
    result = this.data.filter(function(restaurant){ 
      let obj = lib220.getProperty(restaurant, 'review_count'); 
      if (obj.found === true){
        return (obj.value >= review);
      }
    });
    //If there are no restaurants with reviews greater than or equal to review return an empty object
    if (result.length === 0){
      return {};
    }
    else{
      return new FluentRestaurants(result);
    }
  }

  //category(categoryStr: string): FluentRestaurants
  category(categoryStr){
    let result = [];
    //filters array of jsonData to produce an array of restaurant objects that have the provided category given by categoryStr 
    result = this.data.filter(function(restaurant){ 
      let obj = lib220.getProperty(restaurant, 'categories'); 
      if (obj.found === true){
        for(let i = 0; i < obj.value.length; ++i){
          if (obj.value[i] === categoryStr){
            return true;
          }
        }
      }
    });
    //If there are no restaurant objects that have the provided category given by categoryStr return empty object
    if (result.length === 0){
      return {};
    }
    else{
      return new FluentRestaurants(result);
    }
  }

  //hasAmbience(ambienceStr: string): FluentRestaurants 
  hasAmbience(ambienceStr){
    let result = [];
    //filters array of jsonData to produce an array of restaurant objects that have the provided ambience given by ambienceStr 
    result = this.data.filter(function(restaurant){ 
      //Ambience key may found in a restaurants attributes key
      let obj = lib220.getProperty(restaurant, 'attributes'); 
      if (obj.found === true){
        let amb = lib220.getProperty(obj.value, 'Ambience');
        if (amb.found === true){
          let ambience = lib220.getProperty(amb.value, ambienceStr)
          //Need to make sure the provided ambience is true in order to insert it into the filtered array
          return (ambience.found && ambience.value);
        }
      }
    });
    //If there are no restaurant objects that have the provided ambience given by ambienceStr return empty object
    if (result.length === 0){
      return {};
    }
    else{
      return new FluentRestaurants(result);  
    } 
  }

  
  //bestPlace(): Restaurant | {}
  bestPlace(){
    let ratingG = 0; //Holds the largest rating value as we progress through the restaurant object array
    //For loop that goes through the restaurant objects array to find the largest rating value of all the restaurants
    for (let i = 0; i < this.data.length; ++i){
      let rating = (lib220.getProperty(this.data[i], 'stars'));
      if (rating.found){
        if (rating.value > ratingG){
          ratingG = rating.value;
        }
      }
    }
    //Creates a new restaurant object array with all the restaurants with ratings equal to the largest rating value
    let ratings = this.ratingGeq(ratingG);
    if (ratings === {}){
      return {};
    }
    //If there is only one restaurant with a rating equal to the largest rating value, return this restaurant as this is the restaurant with the highest rating
    if (ratings.data.length === 1){
      return ratings.data[0];
    }

    let reviewG = 0; //Holds the largest review value as we progress through the restaurant object array
    //For loop that goes through the restaurant objects array to find the largest review value of all the restaurants
    for (let i = 0; i < ratings.data.length; ++i){
      let reviews = (lib220.getProperty(ratings.data[i], 'review_count'));
      if (reviews.found){
        if (reviews.value > reviewG){
          reviewG = reviews.value;
        }
      }
    }

    //Creates a new restaurant object array with all the restaurants with ratings equal to the largest rating value (from our ratings array made above) 
    //and reviews equal to the largest review value
    let reviews = ratings.reviewsGeq(reviewG);
    if (reviews === {}){
      return {};
    }

    //If there is only one restaurant with a rating equal to the largest rating value, and review equal to the largest review value, return this restaurant
    if (ratings.data.length === 1){
      return reviews.data[0];
    }
    //If there’s a tie with the most reviews, pick the first restaurant with the highest rating and reviews
    else{
      return reviews.data[0];
    }
  } 

}

let data = lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json');
let f = new FluentRestaurants(data);
console.log(f.ratingLeq(5)
 .ratingGeq(3)
 .category('Restaurants')
 .hasAmbience('casual')
 .fromState('NV')
 .bestPlace().name);
  
 console.log(f.ratingLeq(4)
 .ratingGeq(2)
 .category('Restaurants')
 .hasAmbience('romantic')
 .fromState('AZ')
 .bestPlace().name);


const testData = [
 {
 name: "Applebee's",
 state: "NC",
 stars: 4,
 review_count: 6,
 },
 {
 name: "China Garden",
 state: "NC",
 stars: 4,
 review_count: 10,
 },
 {
 name: "Beach Ventures Roofing",
 state: "AZ",
 stars: 3,
 review_count: 30,
 },
 {
 name: "Alpaul Automobile Wash",
 state: "NC",
 stars: 3,
 review_count: 30,
 }
]
test('fromState filters correctly', function() {
 let tObj = new FluentRestaurants(testData);
 let list = tObj.fromState('NC').data;
 assert(list.length === 3);
 assert(list[0].name === "Applebee's");
 assert(list[1].name === "China Garden");
 assert(list[2].name === "Alpaul Automobile Wash");
});
test('bestPlace tie-breaking', function() {
 let tObj = new FluentRestaurants(testData);
 let place = tObj.fromState('NC').bestPlace();
 assert(place.name === 'China Garden');
});