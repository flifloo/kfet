const socket = io();
const dish = document.querySelector("#dish ul");
const ingredient = document.querySelector("#ingredient ul");
const sauce = document.querySelector("#sauce ul");
const drink = document.querySelector("#drink ul");
const dessert = document.querySelector("#dessert ul");


if (window.location.href.endsWith("#popup"))
    window.location.href = window.location.href.replace("#popup", "#");


function popup(ob, el) {
    document.querySelector("body").insertAdjacentHTML("afterbegin", `<div id="popup">
    <h1>Edition of ${ob.name}</h1>
    <div id="edit">
        <div>
            <label for="available">Available: </label>
            <input id="available" type="checkbox">
        </div>
        <div>
            <label for="price">Price: </label>
            <input id="price" type="number" min="0" step="any" value="${ob.price}">
        </div>
    </div>
    <div id="validation">
        <div class="container-contact2-form-btn">
            <div class="wrap-contact2-form-btn">
                <div class="contact2-form-bgbtn"></div>
                <a href="#" style=""><button id="cancel" class="contact2-form-btn">Cancel</button></a>
            </div>
        </div>
        <div class="container-contact2-form-btn">
            <div class="wrap-contact2-form-btn">
                <div class="contact2-form-bgbtn"></div>
                <a href="#"><button id="apply" class="contact2-form-btn">Apply</button></a>
            </div>
        </div>
    </div>
</div>`);
    let e = document.getElementById("popup");
    if (ob.available)
        e.querySelector("#available").click()
    if (ob.maxIngredients !== undefined)
        e.querySelector("#edit div:last-of-type").insertAdjacentHTML("afterend", `<div><label for="maxIngredients">Max ingredients: </label><input id="maxIngredients" type="number" min="0" value="${ob.maxIngredients}"></div>`);
    if (ob.maxSauces !== undefined)
        e.querySelector("#edit div:last-of-type").insertAdjacentHTML("afterend", `<div><label for="maxSauces">Max sauces: </label><input id="maxSauces" type="number" min="0" value="${ob.maxSauces}"></div>`);

    e.querySelector("#cancel").addEventListener("click", () => {
        e.remove();
    });
    e.querySelector("#apply").addEventListener("click", () => {
        socket.emit("set " + el.id.replace(ob.id, ""), {
            id: ob.id,
            available: e.querySelector("#available").checked,
            price: parseFloat(e.querySelector("#price").value),
            maxIngredients: ob.maxIngredients === undefined ? undefined : parseInt(e.querySelector("#maxIngredients").value),
            maxSauces: ob.maxSauces === undefined ? undefined : parseInt(e.querySelector("#maxSauces").value),
        });
        e.remove();
    });

    if (window.location.href.endsWith("#"))
        window.location.href = window.location.href + "popup";
    else if (!window.location.href.endsWith("#popup"))
        window.location.href = window.location.href + "#popup";
    else
        window.location.href = window.location.href.replace("#popup", "#");
}

function addDish(d) {
    dish.insertAdjacentHTML("beforeend", `<li><a id="dish${d.id}">${d.name}</a></li>`);
    let e = document.getElementById(`dish${d.id}`);
    e.addEventListener("click", () => {
        popup(d, e);
    });
}

function addIngredient(i) {
    ingredient.insertAdjacentHTML("beforeend", `<li><a id="ingredient${i.id}">${i.name}</a></li>`);
    let e = document.getElementById(`ingredient${i.id}`);
    e.addEventListener("click", () => {
        popup(i, e);
    });
}

function addSauce(s) {
    sauce.insertAdjacentHTML("beforeend", `<li><a id="sauce${s.id}">${s.name}</a></li>`);
    let e = document.getElementById(`sauce${s.id}`);
    e.addEventListener("click", () => {
        popup(s, e);
    });
}

function addDrink(d) {
    drink.insertAdjacentHTML("beforeend", `<li><a id="drink${d.id}">${d.name}</a></li>`);
    let e = document.getElementById(`drink${d.id}`);
    e.addEventListener("click", () => {
        popup(d, e);
    });
}

function addDessert(d) {
    dessert.insertAdjacentHTML("beforeend", `<li><a id="dessert${d.id}">${d.name}</a></li>`);
    let e = document.getElementById(`dessert${d.id}`);
    e.addEventListener("click", () => {
        popup(d, e);
    });
}

socket.on("connected", () => {
    socket.emit("list dish");
    socket.emit("list ingredient");
    socket.emit("list sauce");
    socket.emit("list drink");
    socket.emit("list dessert");
});

socket.on("list dish", data => {
    let child = dish.lastElementChild;
    while (child) {
        dish.removeChild(child);
        child = dish.lastElementChild;
    }
    for (let d of data)
        addDish(d);
});

socket.on("list ingredient", data => {
    let child = ingredient.lastElementChild;
    while (child) {
        ingredient.removeChild(child);
        child = ingredient.lastElementChild;
    }
    for (let i of data)
        addIngredient(i);
});

socket.on("list sauce", data => {
    let child = sauce.lastElementChild;
    while (child) {
        sauce.removeChild(child);
        child = sauce.lastElementChild;
    }
    for (let s of data)
        addSauce(s);
});

socket.on("list drink", data => {
    let child = drink.lastElementChild;
    while (child) {
        drink.removeChild(child);
        child = drink.lastElementChild;
    }
    for (let d of data)
        addDrink(d);
});

socket.on("list dessert", data => {
    let child = dessert.lastElementChild;
    while (child) {
        dessert.removeChild(child);
        child = dessert.lastElementChild;
    }
    for (let d of data)
        addDessert(d);
});

socket.on("internal error", () => {
    alert("An error occurred !");
})
