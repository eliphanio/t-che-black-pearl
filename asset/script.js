const people = ['Francky', 'Eli Phanio', 'Mpiaro', 'Johny', 'Jack', 'Juot'];
const tasks = ['Couloir', 'Cuisine', 'Veranda', 'Réfectoire', 'Escalier', 'Douche + WC + serpilere'];
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function generateSchedule(week) {
    const schedule = {};
    people.forEach(p => schedule[p] = []);

    const weekOffset = week === 'B' ? 1 : 0;

    days.forEach((_, dayIndex) => {
        const start = (dayIndex + weekOffset) % people.length;

        tasks.forEach((task, tIndex) => {
            const personIndex = (start + tIndex) % people.length;
            const person = people[personIndex];
            schedule[person].push(task);
        });

        // ajouter PAUSE si besoin
        people.forEach(p => {
            if (schedule[p].length <= dayIndex) schedule[p].push('PAUSE');
        });
    });

    return schedule;
}

function displaySchedule(week) {
    const schedule = generateSchedule(week);
    const tbody = document.getElementById(`schedule${week}`);
    tbody.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        const taskCell = document.createElement('td');
        taskCell.className = 'task-cell';
        taskCell.style.fontWeight = 'bold';
        taskCell.style.textAlign = 'left';
        taskCell.style.background = '#f8f9fa';
        taskCell.textContent = task;
        row.appendChild(taskCell);

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const cell = document.createElement('td');
            let personAssigned = '';
            for (let person of people) {
                if (schedule[person][dayIndex] === task) personAssigned = person;
            }
            cell.textContent = personAssigned;
            cell.style.fontWeight = '500';
            cell.style.color = '#333';
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    });

    const pauseRow = document.createElement('tr');
    const pauseCell = document.createElement('td');
    pauseCell.className = 'pause-cell';
    pauseCell.style.fontWeight = 'bold';
    pauseCell.style.textAlign = 'left';
    pauseCell.textContent = 'Pause';
    pauseRow.appendChild(pauseCell);

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const cell = document.createElement('td');
        cell.className = 'pause-cell';
        const peopleOnPause = people.filter(p => schedule[p][dayIndex] === 'PAUSE');
        cell.textContent = peopleOnPause.join(', ');
        cell.style.fontSize = '0.9em';
        pauseRow.appendChild(cell);
    }
    tbody.appendChild(pauseRow);
}

function displayDayCards(week) {
    const schedule = generateSchedule(week);
    const container = document.getElementById(`mobileCards${week}`);
    container.innerHTML = '';

    days.forEach((day, d) => {
        const card = document.createElement('div');
        card.className = 'day-card';
        card.innerHTML = `<h3>${day}</h3>`;
        const ul = document.createElement('ul');

        tasks.forEach(task => {
            let person = '';
            for (let p of people) if (schedule[p][d] === task) person = p;
            ul.innerHTML += `<li><strong>${task}</strong> : ${person}</li>`;
        });

        const paused = people.filter(p => schedule[p][d] === 'PAUSE');
        ul.innerHTML += `<li class="pause">Pause : ${paused.join(', ')}</li>`;
        card.appendChild(ul);
        container.appendChild(card);
    });
}

function createGroups(people) {
    const groups = [];
    let i = 0;
    while (i < people.length) {
        if (people.length - i === 3) {
            groups.push([people[i], people[i+1], people[i+2]]);
            break;
        }
        groups.push([people[i], people[i+1]]);
        i += 2;
    }
    return groups;
}

function displayBinomes() {
    const table = document.getElementById('binomeTable');
    table.innerHTML = '';
    const groups = createGroups(people);
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    groups.forEach((group,index) => {
        const th = document.createElement('th');
        th.textContent = `B${index+1}`;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const row = document.createElement('tr');
    groups.forEach(group => {
        const td = document.createElement('td');
        td.textContent = group.join(', ');
        row.appendChild(td);
    });
    tbody.appendChild(row);
    table.appendChild(tbody);
}

function displayBinomeCards() {
    const container = document.getElementById('mobileCardsBinome');
    container.innerHTML = '';

    const groups = createGroups(people);
    groups.forEach((group, index) => {
        const card = document.createElement('div');
        card.className = 'day-card';
        card.innerHTML = `<h3>B${index+1}</h3><p>${group.join(', ')}</p>`;
        container.appendChild(card);
    });
}


function showWeek(week) {
    // Tableaux desktop
    document.getElementById('weekA').style.display = week === 'A' ? 'block' : 'none';
    document.getElementById('weekB').style.display = week === 'B' ? 'block' : 'none';

    // Cartes mobile
    document.getElementById('mobileCardsA').classList.toggle('show', week === 'A');
    document.getElementById('mobileCardsB').classList.toggle('show', week === 'B');

    // boutons
    document.querySelectorAll('.week-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.week-btn[onclick="showWeek('${week}')"]`).classList.add('active');
}


function calculateStats() {
    const stats = {};
    people.forEach(person => {
        stats[person] = {
            tasksA: 0,
            pausesA: 0,
            tasksB: 0,
            pausesB: 0
        };
    });

    ['A', 'B'].forEach(week => {
        const schedule = generateSchedule(week);
        people.forEach(person => {
            schedule[person].forEach(task => {
                if (task === 'PAUSE') {
                    stats[person][`pauses${week}`]++;
                } else {
                    stats[person][`tasks${week}`]++;
                }
            });
        });
    });

    return stats;
}

function displayStats() {
    const stats = calculateStats();
    const tbody = document.getElementById('statsBody');
    tbody.innerHTML = '';

    people.forEach(person => {
        const row = document.createElement('tr');
        const personStats = stats[person];
        
        const totalTasks = personStats.tasksA + personStats.tasksB;
        const totalPauses = personStats.pausesA + personStats.pausesB;

        row.innerHTML = `
            <td class="person-name">${person}</td>
            <td class="stat-number">${personStats.tasksA}</td>
            <td class="stat-number">${personStats.pausesA}</td>
            <td class="stat-number">${personStats.tasksB}</td>
            <td class="stat-number">${personStats.pausesB}</td>
            <td class="stat-number" style="color: #28a745;">${totalTasks}</td>
            <td class="stat-number" style="color: #ffc107;">${totalPauses}</td>
        `;
        
        tbody.appendChild(row);
    });

    displayTaskStats();
}

function displayTaskStats() {
    // Calculer combien de fois chaque personne fait chaque tâche
    const taskStats = {};
    
    people.forEach(person => {
        taskStats[person] = {};
        tasks.forEach(task => {
            taskStats[person][task] = 0;
        });
    });

    // Compter pour les semaines A et B
    ['A', 'B'].forEach(week => {
        const schedule = generateSchedule(week);
        people.forEach(person => {
            schedule[person].forEach(task => {
                if (task !== 'PAUSE' && taskStats[person][task] !== undefined) {
                    taskStats[person][task]++;
                }
            });
        });
    });

    // Créer les en-têtes de colonnes (une colonne par tâche)
    const header = document.getElementById('taskStatsHeader');
    tasks.forEach(task => {
        const th = document.createElement('th');
        th.textContent = task;
        th.style.fontSize = '0.9em';
        header.appendChild(th);
    });

    // Remplir le tableau
    const tbody = document.getElementById('taskStatsBody');
    tbody.innerHTML = '';

    people.forEach(person => {
        const row = document.createElement('tr');
        
        // Colonne du nom
        const nameCell = document.createElement('td');
        nameCell.className = 'person-name';
        nameCell.textContent = person;
        row.appendChild(nameCell);

        // Colonnes des tâches
        tasks.forEach(task => {
            const cell = document.createElement('td');
            cell.className = 'stat-number';
            cell.textContent = taskStats[person][task];
            
            // Coloration selon le nombre
            if (taskStats[person][task] === 0) {
                cell.style.color = '#dc3545';
            } else if (taskStats[person][task] === 1) {
                cell.style.color = '#ffc107';
            } else {
                cell.style.color = '#28a745';
            }
            
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}


// Initialize

// Initialisation
displaySchedule('A');
displaySchedule('B');
displayDayCards('A');
displayDayCards('B');
showWeek('A');
displayBinomes();
displayBinomeCards();
displayStats();