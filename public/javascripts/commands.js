import {alert, confirm, createUserPopup} from "./popups.js";

const socket = io();
const list = document.querySelector(".list");

let current = {dish: null, ingredient: [], sauce: [], drink: null, dessert: null};
let radios = {dish: null, drink: null, dessert: null};
let db = {dish: {}, ingredient: {}, sauce: {}, drink: {}, dessert: {}};


function addCmd(command) {
    list.insertAdjacentHTML("beforeend", `<div class="com" id="cmd${command.number}">
    <button class="give">Give</button>
    <h1>${command.number}</h1>
    <div class="spec">
        <h2>${command.sandwich}</h2>
        <h3>${command.client}</h3>
        <p>${command.dish}</p>
        <p>${command.ingredients}</p>
        <p>${command.sauces}</p>
        <p>${command.drink}</p>
        <p>${command.dessert}</p>
        <button class="cancel">Cancel</button>
        <button class="error">Error</button>
    </div>
</div>`);
    let e = document.querySelector(`.list #cmd${command.number}`);
    e.addEventListener( "click" ,ev => {
        ev.stopPropagation();
        e.classList.toggle("show-spec");
    });
    e.querySelector(".give").addEventListener("click", ev => {
        ev.stopPropagation();
        socket.emit("give command", command.number);
    });
    e.querySelector(".cancel").addEventListener("click", ev => {
        ev.stopPropagation();
        socket.emit("clear command", command.number);
    });
    e.querySelector(".error").addEventListener("click", ev => {
        ev.stopPropagation();
        socket.emit("error command", command.number);
    });
    if (command.error)
        error(e)
    else if (command.give)
        give(e)
    else if (command.done)
        done(e)
    else if (command.WIP)
        WIP(e, command.sandwich)
    document.querySelector("#resume>h1").innerHTML = `Command ${command.number+1}`;
}

let add = {};
add.dish = function (d) {
    db.dish[d.id] = d;
    document.querySelector("#dish ul").insertAdjacentHTML("beforeend", `<li><input type="radio" name="dish" id="dish${d.id}"><label for="dish${d.id}">${d.name}</label></li>`);
    let e = document.querySelector(`input[id=dish${d.id}]`);
    e.addEventListener("click", () => {
        radioCheck(e);
        document.querySelectorAll("input[name=ingredient],input[name=sauce]").forEach( el => {
            if (el.checked)
                el.click();
        });
        document.querySelectorAll("input[name=ingredient],input[name=sauce]").forEach( el => {
            el.disabled = !(e.checked && !(db.dish[e.id.replace(e.name, "")]["max" + el.name.charAt(0).toUpperCase() + el.name.slice(1)+"s"] === 0));
        });
    })
}

for (let i of ["ingredient", "sauce"])
    add[i] = function (e) {
        db[i][e.id] = e;
        document.querySelector(`#${i} ul`).insertAdjacentHTML("beforeend", `<li><input type="checkbox" disabled=true name="${i}" id="${i}${e.id}"><label for="ingredient${e.id}">${e.name}</label></li>`);
        document.querySelector(`input[id=${i}${e.id}]`).addEventListener("click", ev => {
            checkCheck(ev.target);
        })
    }

for (let i of ["drink", "dessert"])
    add[i] = function (e) {
        db.drink[e.id] = e;
        document.querySelector(`#${i} ul`).insertAdjacentHTML("beforeend", `<li><input type="radio" name="drink" id="${i}${e.id}"><label for="drink${e.id}">${e.name}</label></li>`);
        document.querySelector(`input[id=${i}${e.id}]`).addEventListener("click", ev => {
            radioCheck(ev.target)
        })
    }

function radioCheck (e) {
    if (e.checked) {
        let curr, name;
        if (e.id.replace(e.name, "") === radios[e.name]) {
            e.checked = false;
            radios[e.name] = null;
            curr = null;
            name = null;
        } else {
            radios[e.name] = e.id.replace(e.name, "");
            curr = e.id.replace(e.name, "");
            name = document.querySelector(`label[for=${e.id}]`).innerHTML;
        }
        current[e.name] = curr;
        price();
        document.getElementById("p-"+e.name).innerHTML = name;
    }
}

function checkCheck(e) {
    if (e.checked)
        current[e.name].push(e.id.replace(e.name, ""));
    else
        current[e.name].splice(current[e.name].indexOf(e.id.replace(e.name, "")), 1);
    document.querySelectorAll(`input[name=${e.name}]`).forEach( e => {
        if (!e.checked)
            e.disabled = current[e.name].length === db.dish[current.dish]["max"+e.name.charAt(0).toUpperCase() + e.name.slice(1)+"s"];
    });
    price();
    let names = [];
    current[e.name].forEach(el=>names.push(document.querySelector(`label[for=${e.name}${el}]`).innerHTML));
    document.getElementById("p-"+e.name).innerHTML = names.join(" - ");
}

function clear(e) {
    for (let i of ["done", "give", "warning", "WIP", "show-spec"])
        e.classList.remove(i);
    list.prepend(e);
}

function WIP(e, name) {
    e.classList.remove("show-spec");
    e.classList.add("WIP");
    e.querySelector("h2").innerHTML = name;
}

function done(e) {
    e.classList.remove("show-spec");
    e.classList.add("done");
}

function give(e) {
    e.classList.remove("show-spec");
    e.classList.add("give");
    list.appendChild(e);
}

function error(e) {
    e.classList.remove("show-spec");
    e.classList.add("warning");
    list.appendChild(e);
}

function price() {
    socket.emit("price", current);
}

async function addUser() {
    let firstName, lastName;
    do {
        [firstName, lastName] = await createUserPopup(current.client);
    } while (firstName === "" || lastName === "");
    if (firstName && lastName)
        socket.emit("add user", {username: current.client, firstName: firstName, lastName: lastName});
    else
        await alert("User creation aborted");
}

function addCommand() {
    current.pc = null;
    socket.emit("add command", current);
    clearSelections();
}

function clearSelections() {
    current = {dish: null, ingredient: [], sauce: [], drink: null, dessert: null, price: {}};
    document.querySelectorAll("input[name=dish],input[name=drink],input[name=dessert]").forEach( e => {
        e.checked = false;
    });
    document.querySelectorAll("input[name=ingredient],input[name=sauce]").forEach( e => {
        e.checked = false;
        e.disabled = true;
    });
    document.querySelectorAll("#resume p").forEach( e => {
        e.innerHTML = ""
    });
    let user = document.getElementById("user");
    user.value = "";
    user.style.color = "";
    document.getElementById("user_list").innerHTML = "";
    document.querySelector("#resume h2").innerHTML = "0€";
}

socket.on("connected", () => {
    for (let i of ["dish", "ingredient", "sauce", "drink", "dessert", "command"])
        socket.emit("list " + i);
});

socket.on("list command", data => {
    let child = list.lastElementChild;
    while (child) {
        list.removeChild(child);
        child = list.lastElementChild;
    }
    for (let c of data)
        addCmd(c);
});

socket.on("list user", data => {
    let user_list = document.getElementById("user_list");
    user_list.innerHTML = "";
    for (let u of data)
        user_list.insertAdjacentHTML("beforeend", `<option value="${u}">`);

    let user = document.getElementById("user");
    if (data.indexOf(user.value) === -1)
        user.style.color = "red";
    else
        user.style.color = "";
});

socket.on("new command", data => {
    addCmd(data);
});

socket.on("clear command", data => {
    clear(document.querySelector(`.list #cmd${data}`))
});

socket.on("WIP command", data => {
    WIP(document.querySelector(`.list #cmd${data.number}`), data.sandwich)
});

socket.on("done command", data => {
    done(document.querySelector(`.list #cmd${data}`))
});

socket.on("give command", data => {
    give(document.querySelector(`.list #cmd${data}`))
});

socket.on("error command", data => {
    error(document.querySelector(`.list #cmd${data}`))
});

socket.on("add user", data => {
    if (data === current.client)
        addCommand();
});

for (let i of ["dish", "ingredient", "sauce", "drink", "dessert"]) {
    let el = document.querySelector(`#${i} ul`);
    function remove(e) {
        el.querySelector(`#${i}${e}`).parentElement.remove();
        delete db[i][e];
    }
    socket.on("list " + i, data => {
        let child = el.lastElementChild;
        while (child) {
            el.removeChild(child);
            child = el.lastElementChild;
        }
        for (let d of data)
            if (d.available)
                add[i](d);
    });
    socket.on("add " + i, data => {
        if (data.available)
            add[i](data);
    });
    socket.on("set " + i, data => {
        if (data.available && db[i][data.id] === undefined)
            add[i](data);
        else if (!data.available && db[i][data.id] !== undefined)
            remove(data.id);
        else
            db[i][data.id] = data;
    });
    socket.on("remove " + i, data => {
        if (db[i][data])
            remove(data);
    });
}

socket.on("price", data => {
    document.querySelector("#resume h2").innerHTML = data+"€";
})

socket.on("fail add user", async () => {
    await alert("User creation fail !");
    await addUser();
});

socket.on("internal error", async () => {
    await alert("An error occurred !");
})

document.querySelector(".validation").addEventListener("click", async ev => {
    ev.stopPropagation();
    if (!current.dish && !current.ingredient.length && !current.sauce.length && !current.drink && !current.dessert)
        await alert("Empty command !");
    else if (current.client && user.style.color === "red")
        await addUser();
    else
        addCommand();
});

document.getElementById("user").addEventListener("keyup", ev => {
    let input = ev.target;
    let min_characters = 0;
    if (input.value.length < min_characters)
        return;
    socket.emit("list user", input.value);
    current.client = input.value;
});

document.getElementById("logout").addEventListener("click", async () => {
    if (await confirm("Do you really want to log out ?"))
        window.location.href = "logout";
});
