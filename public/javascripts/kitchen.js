import {alert} from "./popups.js";

const socket = io();
const WIP = document.getElementById("WIP");
const done = document.getElementById("done");
const waiting = document.getElementById("waiting");

let service = {};


function addCmd(c) {
    done.insertAdjacentHTML("beforeend", `<div id=cmd${c.number}>
    <h1>${c.number}</h1>
    <h2>${c.sandwich}</h2>
    <h3>${c.client}</h3>
    <p>${c.dish} | ${c.ingredient}</p>
    <p>${c.sauce}</p>
    <p>${c.drink}</p>
    <p>${c.dessert}</p>
</div>`);
    let e = document.getElementById(`cmd${c.number}`);
    if (c.error || c.give || c.done)
        finish(e)
    else if (c.WIP)
        WIPed(e, c.sandwich)
    else
        wait(e)
}

function WIPed(e, name) {
    e.querySelector("h2").innerHTML = name;
    let names = [name];
    WIP.querySelectorAll("h2").forEach(e => {
        names.push(e.innerHTML)
    });
    names.sort();
    if (names.indexOf(name) === 0)
        WIP.insertAdjacentHTML("afterbegin", e.outerHTML);
    else {
        WIP.children[names.indexOf(name)-1].insertAdjacentHTML("afterend", e.outerHTML);
    }

    WIP.querySelector(`#${e.id}`).addEventListener("click", () => {
        socket.emit("done command", parseInt(e.id.replace("cmd", "")));
    });
    e.remove();
}

function finish(e) {
    done.insertAdjacentHTML("afterbegin", e.outerHTML);
    e.remove();
}

function wait(e) {
    waiting.insertAdjacentHTML("afterbegin", e.outerHTML);
    e.remove();
}

function waiter() {
    let limit = Object.keys(service).filter(x=>x.startsWith("sandwich") && service[x]).length;
    if (WIP.children.length < limit) {
        let i;
        if (waiting.children.length < limit - WIP.children.length)
            i = waiting.children.length;
        else
            i = limit - WIP.children.length;
        socket.emit("WIP command", waiting.children[i-1].querySelector("h1").innerHTML);
    }
}

socket.on("connected", () => {
    socket.emit("list service");
});

socket.on("list command", data => {
    for (let e of [WIP, done, waiting]) {
        let child = e.lastElementChild;
        while (child) {
            e.removeChild(child);
            child = e.lastElementChild;
        }
    }
    for (let c of data) {
        addCmd(c);
    }
    waiter();
});

socket.on("list service", async data => {
    if (!data || Object.keys(data).length === 0)
        await alert("No service set !");
    else {
        service = data;
        socket.emit("list command");
    }
});

socket.on("set service", () => {
    socket.emit("list service");
})

socket.on("new command", data => {
    addCmd(data);
    waiter();
});

socket.on("clear command", data => {
    wait(document.getElementById((`cmd${data}`)));
    waiter();
});

socket.on("WIP command", data => {
    WIPed(document.getElementById((`cmd${data.number}`)), data.sandwich);
    waiter();
});

socket.on("done command", data => {
    finish(document.getElementById((`cmd${data}`)));
    waiter();
});

socket.on("give command", data => {
    finish(document.getElementById((`cmd${data}`)));
    waiter();
});

socket.on("error command", data => {
    finish(document.getElementById(`cmd${data}`));
    waiter();
});

socket.on("internal error", async () => {
    await alert("An error occurred !");
})

document.addEventListener("keyup", ev => {
    let keys = [["Digit1", "Numpad1"], ["Digit2", "Numpad2"], ["Digit3", "Numpad3"]];
    for (let i=0; i<keys.length; i++) {
        if (keys[i].indexOf(ev.code) >= 0)
            WIP.children[i].click()
    }
});
