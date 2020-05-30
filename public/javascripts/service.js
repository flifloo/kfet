let socket = io();
let users = {};
let usersAdd = [];

function addUser(username) {
    let firstName, lastName;
    do {
        firstName = prompt("First name for " + username);
    } while (firstName === "");
    if (firstName) {
        do {
            lastName = prompt("Last name for " + username);
        } while (lastName === "");
        if (lastName)
            socket.emit("add user", {username: username, firstName: firstName, lastName: lastName});
    }
    if (!firstName|| !lastName)
        alert("User creation aborted for " + username);
}

function next() {
    if (usersAdd.length)
        addUser(usersAdd.pop());
    else
        socket.emit("set service", users);
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
    for (let s in data) {
        document.getElementById(s).value = data[s]
    }
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

socket.on("add user", data => {
    alert("User creation fail !");
    addUser(data);
});

socket.on("set service", () => {
    console.log("close !")
    window.close();
})

socket.on("fail add user", data => {
    alert("User creation fail !");
    addUser(data);
});

socket.on("internal error", () => {
    alert("An error occurred !");
})

document.querySelectorAll("input[type='text']").forEach(e => {
    e.addEventListener("keyup", ev => {hinter(ev)})
});

document.querySelector("button").addEventListener("click", () => {
    document.querySelectorAll("input[type='text']").forEach(e=> {
        if (e.style.color)
            usersAdd.push(e.value);
        users[e.id] = e.value;
    });
    next();
});
