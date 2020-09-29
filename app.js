const SEARCH = document.querySelector('#search__input');
const SEARCHBUTTON = document.querySelector('.search--btn');
const RANDOMBUTTON = document.querySelector('#random');
const MEALS = document.querySelector('#meals');
const RESULTS = document.querySelector('#result--heading');
const SINGLEMEAL = document.querySelector('#single--meal');


const handleSubmit = e => {
    e.preventDefault();
    SINGLEMEAL.innerHTML = ``;
    const mealName = SEARCH.value.trim();
    if (!mealName) {
        alert(`Please Enter A meal You wanna Search for`)
    } else {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
            .then(data => data.json())
            .then(meal => {
                RESULTS.innerHTML = `<h2>Search Results for '${mealName}':</h2 > `;
                if (meal.meals === null) {
                    RESULTS.innerHTML = `<p>There are no Search Results, Try again!</p>`
                } else {
                    MEALS.innerHTML = meal.meals.map(meal => `
                    <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <div class="meal-info" data-mealId="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                    </div>
                    </div>`).join('')
                }
            })
        SEARCH.value = '';
    }
}
const addMealToDOM = meal => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} -${meal[`strMeasure${i}`]}`)
        } else {
            break
        }
    }
    SINGLEMEAL.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
    <p>${meal.strInstructions}</p>
    <h2>Ingredients</h2>
    <ul>
    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
    </ul>
    </div>
    </div>`
}

const getMealByID = async mealID => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    const data = await res.json();
    const meal = data.meals[0];
    addMealToDOM(meal);
}


const handleMealClick = e => {
    RESULTS.innerHTML = ''
    const mealInfo = e.path.find(item => item.classList ? item.classList.contains("meal-info") : false)
    if (mealInfo) {
        const mealID = mealInfo.getAttribute("data-mealid");
        MEALS.textContent = '';
        getMealByID(mealID)
    }
}

const handleRandomMeal = async () => {
    MEALS.textContent = '';
    RESULTS.innerHTML = ''
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await res.json();
    const meal = data.meals[0]
    addMealToDOM(meal);
}

SEARCHBUTTON.addEventListener('click', handleSubmit)
MEALS.addEventListener('click', handleMealClick)
RANDOMBUTTON.addEventListener('click', handleRandomMeal)





