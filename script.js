// 1. Initialize Particles
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80 },
        "color": { "value": "#00ff00" },
        "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#00ff00", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 2.3 }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": true, "mode": "repulse" },
            "onclick": { "enable": true, "mode": "push" },
            "resize": true
        }
    },
    "retina_detect": true
});

// 2. Window Toggle Logic
function toggleTerminal() {
    const profileView = document.getElementById('profile-view');
    const terminalView = document.getElementById('terminal-view');
    const minesweeperView = document.getElementById('minesweeper-view');
    const cmdInput = document.getElementById('cmd-input');

    // If Terminal is currently visible, close it and go back to Profile
    if (terminalView.style.display === 'flex') {
        terminalView.style.display = 'none';
        minesweeperView.style.display = 'none'; 
        profileView.style.display = 'block';
    } else {
        // Otherwise, open Terminal and hide others
        profileView.style.display = 'none';
        minesweeperView.style.display = 'none';
        terminalView.style.display = 'flex';
        setTimeout(() => cmdInput.focus(), 100);
    }
}

// 3. Minesweeper Logic
let board = [];
const rows = 8;
const cols = 8;
const minesCount = 10;
let minesLocation = [];
let tilesClicked = 0;
let gameOver = false;

function openMinesweeper() {
    const terminalView = document.getElementById('terminal-view');
    const minesweeperView = document.getElementById('minesweeper-view');
    
    // Switch views: Hide Terminal, Show Game
    terminalView.style.display = 'none';
    minesweeperView.style.display = 'flex';
    
    initMinesweeper();
}

function closeMinesweeper() {
    const terminalView = document.getElementById('terminal-view');
    const minesweeperView = document.getElementById('minesweeper-view');
    const cmdInput = document.getElementById('cmd-input');
    
    // Switch views: Hide Game, Show Terminal (Back to where we came from)
    minesweeperView.style.display = 'none';
    terminalView.style.display = 'flex';
    
    // Focus back on input so user can keep typing
    setTimeout(() => cmdInput.focus(), 100);
}

function initMinesweeper() {
    board = [];
    minesLocation = [];
    tilesClicked = 0;
    gameOver = false;
    document.getElementById("game-status").innerText = "Playing";
    document.getElementById("mine-count").innerText = minesCount;

    // Generate Mines
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        let id = r.toString() + "-" + c.toString();
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }

    // Generate Grid UI
    const grid = document.getElementById("minesweeper-grid");
    grid.innerHTML = "";
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("cell");
            tile.addEventListener("click", clickTile);
            tile.addEventListener("contextmenu", flagTile); // Right click
            grid.appendChild(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function flagTile(e) {
    e.preventDefault();
    if (gameOver || this.classList.contains("revealed")) return;
    
    if (this.innerText === "") {
        this.innerText = "🚩";
        this.classList.add("flag");
    } else if (this.innerText === "🚩") {
        this.innerText = "";
        this.classList.remove("flag");
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("revealed") || this.classList.contains("flag")) return;

    if (minesLocation.includes(this.id)) {
        gameOver = true;
        document.getElementById("game-status").innerText = "GAME OVER";
        document.getElementById("game-status").style.color = "red";
        revealMines();
        return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.classList.add("mine");
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (board[r][c].classList.contains("revealed")) return;

    board[r][c].classList.add("revealed");
    tilesClicked += 1;

    let minesFound = 0;

    // Check neighbors
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let nr = r + i;
            let nc = c + j;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (minesLocation.includes(nr + "-" + nc)) {
                    minesFound += 1;
                }
            }
        }
    }

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        // Color coding numbers
        if(minesFound == 1) board[r][c].style.color = "#00ff00";
        else if(minesFound == 2) board[r][c].style.color = "#ffff00";
        else board[r][c].style.color = "#ff5f56";
    } else {
        // Recursively check neighbors if empty
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                checkMine(r + i, c + j);
            }
        }
    }

    if (tilesClicked == rows * cols - minesCount) {
        document.getElementById("game-status").innerText = "YOU WIN!";
        document.getElementById("game-status").style.color = "#00ff00";
        gameOver = true;
    }
}


// 4. Command Input Handler
const cmdInput = document.getElementById('cmd-input');
const outputArea = document.getElementById('output-area');
const terminalBody = document.getElementById('terminal-body');

if(terminalBody) {
    terminalBody.addEventListener('click', () => cmdInput.focus());
}

if(cmdInput) {
    cmdInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const command = cmdInput.value.trim().toLowerCase();
            outputArea.innerHTML += `<div class="output-line"><span class="prompt">root@xackerlud:~$</span> ${cmdInput.value}</div>`;

            if (command === 'ls') {
                outputArea.innerHTML += `
                    <div class="output-line">drwx------ 1 xackerlud staff <a href="https://github.com/xackerlud31337/CaptureGo" target="_blank" class="project-link">CaptureGo</a></div>
                    <div class="output-line">drwx------ 1 xackerlud staff <a href="https://github.com/xackerlud31337/Parser_In_Haskell" target="_blank" class="project-link">Parser_In_Haskell</a></div>
                    <div class="output-line">drwx------ 1 xackerlud staff <a href="https://github.com/xackerlud31337/BotNet" target="_blank" class="project-link">BotNet</a></div>
                    <div class="output-line">drwx------ 1 xackerlud staff <a href="https://github.com/xackerlud31337/python_facial_recognition" target="_blank" class="project-link">Python_Facial_Recognition</a></div>
                    <div class="output-line">-rwx------ 1 xackerlud staff <a href="https://github.com/xackerlud31337" target="_blank" class="project-link">README.md</a></div>
                `;
            } else if (command === 'minesweeper') {
                outputArea.innerHTML += `<div class="output-line">Launching Minesweeper protocol...</div>`;
                openMinesweeper();
            } else if (command === 'help') {
                outputArea.innerHTML += `<div class="output-line">Available commands: ls, minesweeper, clear, exit</div>`;
            } else if (command === 'clear') {
                outputArea.innerHTML = '';
            } else if (command === 'exit') {
                toggleTerminal();
                cmdInput.value = '';
                return;
            } else if (command !== '') {
                outputArea.innerHTML += `<div class="output-line">bash: ${command}: command not found</div>`;
            }

            if(terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
            cmdInput.value = '';
        }
    });
}