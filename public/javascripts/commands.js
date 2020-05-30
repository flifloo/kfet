const socket = io();
const dish = document.querySelector("#dish ul");
const ingredient = document.querySelector("#ingredient ul");
const sauce = document.querySelector("#sauce ul");
const drink = document.querySelector("#drink ul");
const dessert = document.querySelector("#dessert ul");
const list = document.querySelector(".list");

let current = {dish: null, ingredient: [], sauce: [], drink: null, dessert: null, price: {}};
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

function addDish(d) {
    dish.insertAdjacentHTML("beforeend", `<li><input type="radio" name="dish" id="dish${d.id}"><label for="dish${d.id}">${d.name}</label></li>`);
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

function addIngredient(i) {
    ingredient.insertAdjacentHTML("beforeend", `<li><input type="checkbox" disabled=true name="ingredient" id="ingredient${i.id}"><label for="ingredient${i.id}">${i.name}</label></li>`);
    let e = document.querySelector(`input[id=ingredient${i.id}]`);
    e.addEventListener("click", () => {
        checkCheck(e)
    })
}

function addSauce(s) {
    sauce.insertAdjacentHTML("beforeend", `<li><input type="checkbox" disabled=true name="sauce" id="sauce${s.id}"><label for="sauce${s.id}">${s.name}</label></li>`);
    let e = document.querySelector(`input[id=sauce${s.id}]`);
    e.addEventListener("click", () => {
        checkCheck(e)
    })
}

function addDrink(d) {
    drink.insertAdjacentHTML("beforeend", `<li><input type="radio" name="drink" id="drink${d.id}"><label for="drink${d.id}">${d.name}</label></li>`);
    let e = document.querySelector(`input[id=drink${d.id}]`);
    e.addEventListener("click", () => {
        radioCheck(e)
    })
}

function addDessert(d) {
    dessert.insertAdjacentHTML("beforeend", `<li><input type="radio" name="dessert" id="dessert${d.id}"><label for="dessert${d.id}">${d.name}</label></li>`);
    let e = document.querySelector(`input[id=dessert${d.id}]`);
    e.addEventListener("click", () => {
        radioCheck(e)
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
        if (curr)
            current.price[e.name] = db[e.name][curr.replace(e.name, "")].price;
        else
            current.price[e.name] = 0;
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
    current.price[e.name] = 0;
    for (let i of current[e.name]) {
        current.price[e.name] += db[e.name][i].price
    }
    price();
    let names = [];
    current[e.name].forEach(el=>names.push(document.querySelector(`label[for=${e.name}${el}]`).innerHTML));
    document.getElementById("p-"+e.name).innerHTML = names.join(" - ");
}

function clear(e) {
    e.classList.remove("done");
    e.classList.remove("give");
    e.classList.remove("warning");
    e.classList.remove("WIP");
    e.classList.remove("show-spec");
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
    let p = 0;
    for (let i in current.price) {
        p += current.price[i]
    }
    p = p.toFixed(2);
    document.querySelector("#resume h2").innerHTML = p+"€";
    return p;
}

function addUser() {
    let firstName, lastName;
    do {
        firstName = prompt("First name");
    } while (firstName === "");
    if (firstName) {
        do {
            lastName = prompt("Last name");
        } while (lastName === "");
        if (lastName)
            socket.emit("add user", {username: current.client, firstName: firstName, lastName: lastName});
    }
    if (!firstName|| !lastName) {
        alert("User creation aborted");
    }
}

function addCommand() {
    current.pc = null;
    current.price = price();
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
    socket.emit("list dish");
    socket.emit("list ingredient");
    socket.emit("list sauce");
    socket.emit("list drink");
    socket.emit("list dessert");
    socket.emit("list command");
});

socket.on("list command", data => {
    let child = list.lastElementChild;
    while (child) {
        list.removeChild(child);
        child = list.lastElementChild;
    }
    for (let c of data) {
        addCmd(c);
    }
});

socket.on("list dish", data => {
    let child = dish.lastElementChild;
    while (child) {
        dish.removeChild(child);
        child = dish.lastElementChild;
    }
    for (let d of data) {
        addDish(d);
        db.dish[d.id] = d;
    }
});

socket.on("list ingredient", data => {
    let child = ingredient.lastElementChild;
    while (child) {
        ingredient.removeChild(child);
        child = ingredient.lastElementChild;
    }
    for (let i of data) {
        addIngredient(i);
        db.ingredient[i.id] = i;
    }
});

socket.on("list sauce", data => {
    let child = sauce.lastElementChild;
    while (child) {
        sauce.removeChild(child);
        child = sauce.lastElementChild;
    }
    for (let s of data) {
        addSauce(s);
        db.sauce[s.id] = s;
    }
});

socket.on("list drink", data => {
    let child = drink.lastElementChild;
    while (child) {
        drink.removeChild(child);
        child = drink.lastElementChild;
    }
    for (let d of data) {
        addDrink(d);
        db.drink[d.id] = d;
    }
});

socket.on("list dessert", data => {
    let child = dessert.lastElementChild;
    while (child) {
        dessert.removeChild(child);
        child = dessert.lastElementChild;
    }
    for (let d of data) {
        addDessert(d);
        db.dessert[d.id] = d;
    }
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

socket.on("WIPed command", data => {
    WIP(document.querySelector(`.list #cmd${data.id}`), data.sandwich)
});

socket.on("finish command", data => {
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

socket.on("fail add user", () => {
    alert("User creation fail !");
    addUser();
});

socket.on("internal error", () => {
    alert("An error occurred !");
})

document.querySelector(".validation").addEventListener("click", ev => {
    ev.stopPropagation();
    if (!current.dish && !current.ingredient.length && !current.sauce.length && !current.drink && !current.dessert)
        alert("Empty command !");
    else if (user.style.color === "red")
        addUser();
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
