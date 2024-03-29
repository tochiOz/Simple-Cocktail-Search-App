//inint app
class UI {

  printMessage(mesasage, className) {

    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div class="alert alert-dismissible text-center my-2 ${className}">
        <button type="button" class="close" data-dismiss="alert"></button>
        ${mesasage}
      </div>
    `;

    //print on the page
    const reference = document.querySelector('#search-form');
    const parentNode = reference.parentElement;
    parentNode.insertBefore(errorDiv, reference);

    //make sure to remive it
    setTimeout(() => {
      document.querySelector('.alert').remove()
    }, 3000)
  }

  //displaying the various ingredints based on thier names
  displayIngredientsHTML(drinks) {

    //display the result div
    const resultDIv = document.querySelector('.results-wrapper');
    resultDIv.style.display = 'block';

    //inserting the results in the div
    const drinResults = document.querySelector('#results');

    drinks.forEach(drink => {
      // return console.log(drink)
      drinResults.innerHTML += `
        <div class="col-md-6">
          <div class="card my-3">
            <button type="button" data-id="${drink.idDrink}" class="favorite-btn btn btn-outline-danger">
              +
            </button>
            <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                        
            <div class="card-body">
              <h2 class="text-center card-title">${drink.strDrink}</h2>
              <a data-target="#recipe" class="btn btn-success get-recipe" href="#" data-toggle="modal" data-id="${drink.idDrink}">
                Get Recipe
              </a>
            </div>
          </div>
        </div >
      `;
    })
    this.isFavorite();
  }

  //displaying cocktails based on ingredients on the ingredients page
  displayDrinksHTML(drinks) {

    //display the result div
    const resultDIv = document.querySelector('.results-wrapper');
    resultDIv.style.display = 'block';

    //inserting the results in the div
    const drinkResults = document.querySelector('#results');

    drinks.forEach(drink => {
      drinkResults.innerHTML += `
      
        <div class="col-md-6">
          <div class="card my-3">
            <button type="button" data-id="${drink.idDrink}" class="favorite-btn btn btn-outline-danger">
              +
            </button>
            <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                        
            <div class="card-body">
                <h2 class="text-center card-title">${drink.strDrink}</h2>
                <p class="card-text font-weight-bold">Instructions:</p>
                
                <p class="card-text">
                  ${drink.strInstructions}
                </p>

                <p class="card-text">
                  <ul class="list-group text-center ">
                    <li class="list-group-item alert alert-success">Ingredients</li>
                    ${this.displayINgredients(drink)}
                  </ul>
                </p>
                
                <p class="card-text font-weight-bold">Extra Information:</p>
                
                <p class="card-text">
                 <span class="badge badge-danger badge-pill">
                  ${drink.strAlcoholic}
                 </span>

                 <span class="badge badge-warning badge-pill">
                  ${drink.strCategory}
                 </span>

                </p>

            </div>
          </div>
        </div>

      `;
    })
    this.isFavorite();
  }

  //a function declared to display the numbers of ingredients in each of the cocktail on the screen
  displayINgredients(drink) {

    let ingredients = [];
    for (let i = 1; i < 16; i++) {
      const el = {};
      if (drink[`strIngredient${i}`] !== '') {
        el.ingredient = drink[`strIngredient${i}`];
        el.measure = drink[`strMeasure${i}`];
        ingredients.push(el);
      }
    };
    // return console.log(ingredients)

    let ingredientTemplate = '';

    ingredients.forEach(ingredient => {
      ingredientTemplate += `
        <li class="list-group-item">${ingredient.ingredient} - ${ingredient.measure}</li>
      `;
    });

    return ingredientTemplate;

  }

  //this clears the initial display on the result div for incoming messages/cocktail display
  clearHTML() {
    const result = document.querySelector('#results');
    result.innerHTML();
  }

  //Displaying single recipe based on the various ingredients displayed in the page
  displaySingleRecipe(recipe) {

    //get the variables
    const modalTitle = document.querySelector('.modal-title'),
      modalDescription = document.querySelector('.modal-body .description-text'),
      modalIngredient = document.querySelector('.modal-body .ingredient-list .list-group');

    //set the values
    modalTitle.innerHTML = recipe.strDrink;
    modalDescription.innerHTML = recipe.strInstructions;

    //display the imgredients
    let IngredientList = this.displayINgredients(recipe);
    modalIngredient.innerHTML = IngredientList;

  }

  //displaying category
  displayCategory() {

    //querying the api
    cockTailApi.getCategories()
      .then(categories => {

        const catsList = categories.categories.drinks;
        
        //read the select tag again
        const select = document.querySelector('.search-category');
        const firstOPtion = document.createElement('option');
        firstOPtion.value = '';
        firstOPtion.textContent = '- Select -';
        select.appendChild(firstOPtion);

        //creating the option to load the categories
        catsList.forEach(cat => {

          const option = document.createElement('option');
          option.textContent = cat.strCategory
          option.value = cat.strCategory.split(' ').join('_')

          select.appendChild(option)
        })
      })
  }

  loadFavorites(drinks) {

    const favour = document.querySelector('#favorites tbody');
    drinks.forEach(drink => {
       
      //create a table row
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>
          <img src="${drink.img}" alt="${drink.name}" width=100>
        </td>

         <td>
          ${drink.name}
        </td>

         <td>
          <a href="#" data-toggle="modal" data-target="#recipe" data-id="${drink.id}" class="btn btn-success get-recipe">
            View
          </a>
        </td>

         <td>
            <a href="#" data-id="${drink.id}" class="btn btn-danger remove-recipe">
            Remove
          </a>
        </td>
      `;

      favour.appendChild(tr);
     })
  }

  removeFavorites(favour) {

    //remove the element from the DOM
    favour.remove();
  }

  //add is favorite class to loaded cocktails if they exist
  isFavorite() {
    const drinks = cockdb.getFromDb();

    drinks.forEach(drink => {

      //destructure the id
      let { id } = drink;

      //select the favorite
      let favoriteDrink = document.querySelector(`[data-id="${id}"]`);
      if (favoriteDrink) {
        favoriteDrink.classList.add('is-favorite');
        favoriteDrink.textContent = '-';
      }
    })
  }

}