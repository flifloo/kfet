import {alert, confirm} from "./popups.js";

const socket = io();

let db = {dish: {}, ingredient: {}, sauce: {}, drink: {}, dessert: {}};


function editPopup(ob, el) {
    document.querySelector("body").insertAdjacentHTML("afterbegin", `<div id="popup-container">
    <div id="popup">
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
        <div id="popup-validation">
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
    </div>
</div>`);
    let e = document.getElementById("popup-container");
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
}

async function createPopup(type) {
    document.querySelector("body").insertAdjacentHTML("afterbegin", `<div id="popup-container">
    <div id="popup">
        <h1>Create ${type}</h1>
        <div id="edit">
            <div>
                <label for="name">Name: </label>
                <input class="input2" id="name" type="text">
            </div>
            <div>
                <label for="available">Available: </label>
                <input id="available" type="checkbox" checked>
            </div>
            <div>
                <label for="price">Price: </label>
                <input id="price" type="number" min="0" step="any">
            </div>
        </div>
        <div id="popup-validation">
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
    </div>
</div>`);
    let e = document.getElementById("popup-container");
    if (type === "dish") {
        e.querySelector("#edit div:last-of-type").insertAdjacentHTML("afterend", `<div><label for="maxIngredients">Max ingredients: </label><input id="maxIngredients" type="number" min="0""></div>`);
        e.querySelector("#edit div:last-of-type").insertAdjacentHTML("afterend", `<div><label for="maxSauces">Max sauces: </label><input id="maxSauces" type="number" min="0"></div>`);
    }

    e.querySelector("#cancel").addEventListener("click", () => {
        e.remove();
    });
    e.querySelector("#apply").addEventListener("click", () => {
        socket.emit("add " + type, {
            name: e.querySelector("#name").value,
            available: e.querySelector("#available").checked,
            price: parseFloat(e.querySelector("#price").value),
            maxIngredients: type !== "dish" ? undefined : parseInt(e.querySelector("#maxIngredients").value),
            maxSauces: type !== "dish" ? undefined : parseInt(e.querySelector("#maxSauces").value),
        });
        e.remove();
    });
}

socket.on("connected", () => {
    for (let i of ["dish", "ingredient", "sauce", "drink", "dessert"])
        socket.emit("list " + i);
});

for (let i of ["dish", "ingredient", "sauce", "drink", "dessert"]) {
    let el = document.querySelector(`#${i} ul`);
    function add(e) {
        db[i][e.id] = e;
        el.insertAdjacentHTML("beforeend", `<li><a id="remove-${i}${e.id}">\u274C</a> <a id="${i}${e.id}">${e.name}</a></li>`);
        document.getElementById(`${i}${e.id}`).addEventListener("click", ev => {
            editPopup(db[i][e.id], ev.target);
        });
        document.getElementById(`remove-${i}${e.id}`).addEventListener("click", async () => {
            if (await confirm("Remove "+e.name+" ?"))
                socket.emit("remove " + i, e.id);
        });
    }
    socket.on("list " + i, data => {
        let child = el.lastElementChild;
        while (child) {
            el.removeChild(child);
            child = el.lastElementChild;
        }
        for (let d of data)
            add(d);
    });
    socket.on("add " + i, data => {
        if (data.available)
            add(data);
    });
    document.getElementById("add-" + i).addEventListener("click", async () => {
        await createPopup(i);
    });
    socket.on("fail add "+i, async data => {
        await alert("Fail to add " + i + " " + data.name)
    });
    socket.on("set " + i, data => {
        if (data.available && db[i][data.id] === undefined) {
            add(data);
        } else {
            db[i][data.id] = data;
        }
    });
    socket.on("remove " + i, data => {
        if (db[i][data]) {
            el.querySelector("#" + i + data).parentElement.remove();
            delete db[i][data]
        }
    });
}

socket.on("internal error", async () => {
    await alert("An error occurred !");
});
