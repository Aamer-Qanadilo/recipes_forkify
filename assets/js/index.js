var connection = new XMLHttpRequest();
var recipes = [];
var items = document.querySelectorAll(".nav-item");

getData("pizza");

items.forEach(item => {
    item.addEventListener("click", event => {
        getData(event.target.text.toLowerCase());
        const elementTopDistance = window.pageYOffset + document.querySelector(".recipes-header").getBoundingClientRect().top;
        window.scrollTo(0, elementTopDistance);
    });
});

window.onscroll = () => {
    let arrowUp = document.createElement('div');
    arrowUp.classList.add('arrow-up',"position-fixed", 'bottom-0', 'end-0', 'm-5');
    arrowUp.innerHTML = '<i class="fa-solid fa-circle-arrow-up fs-3"></i>';
    arrowUp.onclick = () => {
        window.scrollTo(0, 0);
    }

    let oldArrowUp = document.querySelector('.arrow-up');

    if(window.scrollY !== 0) {
        if(oldArrowUp === null) {
            document.body.appendChild(arrowUp);
        }
    } else {
        oldArrowUp.style.visibility = "hidden";
        document.body.removeChild(oldArrowUp);
    }

}

async function getData(item){
    let responseData = await (await fetch(`https://forkify-api.herokuapp.com/api/search?q=${item}`)).json();
    recipes = responseData["recipes"];
    console.log(recipes);
    displayData();
}

function displayData(){
    var data = "";

    for(let i=0 ; i<recipes.length ; i++){
        data += `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 m-1 p-1 item">
                        <div class="card-img-top card-img" style="background-image: url('${recipes[i].image_url}')"></div>
                        <div class="card-body d-flex flex-column justify-content-end text-center">
                            <h5 class="card-title">${recipes[i].title}</h5>
                            <div onClick="showRecipeInfo('${recipes[i].recipe_id}')" class="btn btn-primary">More Info</div>
                        </div>
                    </div>
                </div>

        `;
    }
    if(data.length !== 0){
        document.querySelector('.recipes').innerHTML = data;
    } else {
        data += `
                <p>No Data to Show!</p>
        `;
        document.querySelector('.recipes').innerHTML = data;
    }
}

async function showRecipeInfo(id){
    let responseData = await (await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${id}`)).json();
    let recipe = responseData["recipe"];
    popupScreen(recipe);
}

function popupScreen(recipe){
    let section = document.createElement('div');
    
    section.classList.add('popup-section','position-fixed','start-0','w-100','h-100');

    let popupHTML= `
            <div class="position-absolute w-100 h-100 bg-black bg-opacity-75" onClick="closePopupScreen()"></div>
            <div class="position-absolute top-0 end-0 text-white m-3"><i class="fa-solid fa-xmark popup-xmark fs-2" onClick="closePopupScreen()"></i></div>
            <div class="popup-section-body bg-light position-absolute text-white d-flex flex-column">
                <h3 class="fs-4 text-center text-secondary text-styles py-3 border-bottom">${recipe.title}</h3>
                <div class="d-flex flex-row align-items-center">
                    <div class="col-6 d-none d-md-flex flex-column">
                        <div class="w-100 popup-img" style="background-image: url('${recipe.image_url}')"></div>
                        <a href="${recipe.source_url}" target="_blank" class="btn btn-secondary w-100">Visit Website</a>
                    </div>
                    <div class="popup-content col-6">
                        <ul class="list-group list-group-flush mb-5">
                            ${recipe.ingredients.map(ingredient => `<li class="list-group-item">${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    section.innerHTML = popupHTML;
    document.body.appendChild(section);
}

function closePopupScreen(){
    let section = document.querySelector('.popup-section');
    if(section === null) return;
    section.style.top = '-100%';
    section.style.visibility = "hidden";
    setTimeout(() => {
        document.body.removeChild(section);
    }, 600);
}