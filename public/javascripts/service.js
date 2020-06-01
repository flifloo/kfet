import {alert, createUserPopup} from "./popups.js";

let socket = io();
let users = {};
let usersAdd = [];

async function addUser(username) {
    let firstName, lastName;
    do {
        [firstName, lastName] = await createUserPopup(username);
    } while (firstName === "" || lastName === "");
    if (firstName && lastName)
        socket.emit("add user", {username: username, firstName: firstName, lastName: lastName});
    else
        await alert("User creation aborted for " + username);
}

async function next() {
    if (usersAdd.length)
        await addUser(usersAdd.pop());
    else
        socket.emit("set service", users);
    console.log(users)
}

function hinter(ev) {
    let input = ev.target;
    let min_characters = 0;
    if (input.value.length < min_characters)
        return;
    socket.emit("list user", input.value);
}

socket.on("connected", () => {
    socket.emit("list service");
});

socket.on("list service", data => {
    for (let s in data)
        document.getElementById(s).value = data[s];
});

socket.on("list user", data => {
    let user_list = document.getElementById("user_list");
    user_list.innerHTML = "";
    for (let u of data) {
        user_list.insertAdjacentHTML("beforeend", `<option value="${u}">`);
    }

    document.querySelectorAll("input[type='text']:focus").forEach(e => {
        if (data.indexOf(e.value) === -1)
            e.style.color = "red";
        else {
            e.style.color = "";
        }
    });
});

socket.on("add user", async () => {
    await next();
});

socket.on("set service", () => {
    window.close();
});

socket.on("fail add user", async data => {
    await alert("User creation fail !");
    if (data && data.username)
        await addUser(data);
});

socket.on("internal error", async () => {
    await alert("An error occurred !");
});

document.querySelectorAll("input[type='text']").forEach(e => {
    e.addEventListener("keyup", ev => {hinter(ev)})
});

document.querySelector("button").addEventListener("click", async () => {
    document.querySelectorAll("input[type='text']").forEach(e=> {
        if (e.value && e.style.color)
            usersAdd.push(e.value);
        users[e.id] = e.value;
    });
    await next();
});
