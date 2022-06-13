var connection = new XMLHttpRequest();
var recipes = [];
var items = document.querySelectorAll(".nav-item");

getData("pizza");

items.forEach(item => {
    item.addEventListener("click", event => {
        getData(event.target.text.toLowerCase());
    });
});

function getData(item){
    connection.open("get",`https://forkify-api.herokuapp.com/api/search?q=${item}`);
    connection.send();


    connection.addEventListener("readystatechange",function(){
        if(connection.readyState === 4){
            recipes = JSON.parse(connection.response)["recipes"];
            displayData();
        }
    });
}

function displayData(){
    var data = "";

    for(let i=0 ; i<recipes.length ; i++){
        data += `
                <div class="text-center w-25 col-2 p-4 m-5 border border-dark mb-5 shadow-lg bg-white" 
                     style="height: 350px;">
                    <img class="h-75 w-100" src="${recipes[i].image_url}"/>
                    <p class="m-1">${recipes[i].title}</p>
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