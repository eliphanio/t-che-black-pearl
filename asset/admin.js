// ===== DONNÉES =====
let people = JSON.parse(localStorage.getItem("people")) || [];
let tasks  = JSON.parse(localStorage.getItem("tasks")) || [];

// ===== SAUVEGARDE =====
function save() {
    localStorage.setItem("people", JSON.stringify(people));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== MEMBRES =====
function addMember() {
    const input = document.getElementById("memberInput");
    const name = input.value.trim();

    if (!name) return;
    if (people.includes(name)) {
        alert("Ce membre existe déjà.");
        return;
    }

    people.push(name);
    input.value = "";
    save();
    render();
}

function removeMember(index) {
    if (!confirm("Supprimer ce membre ?")) return;
    people.splice(index, 1);
    save();
    render();
}

// ===== TACHES =====
function addTask() {
    const input = document.getElementById("taskInput");
    const task = input.value.trim();

    if (!task) return;
    if (tasks.includes(task)) {
        alert("Cette tâche existe déjà.");
        return;
    }

    tasks.push(task);
    input.value = "";
    save();
    render();
}

function removeTask(index) {
    if (!confirm("Supprimer cette tâche ?")) return;
    tasks.splice(index, 1);
    save();
    render();
}

// ===== AFFICHAGE =====
function render() {
    const memberList = document.getElementById("memberList");
    const taskList   = document.getElementById("taskList");

    memberList.innerHTML = "";
    taskList.innerHTML = "";

    people.forEach((p, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${p}</span>
            <button class="danger" onclick="removeMember(${i})">Supprimer</button>
        `;
        memberList.appendChild(li);
    });

    tasks.forEach((t, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${t}</span>
            <button class="danger" onclick="removeTask(${i})">Supprimer</button>
        `;
        taskList.appendChild(li);
    });
}

// ===== INIT =====
render();
