// 1. Initialize Particles.js
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#00ff00" },
        "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
        "opacity": { "value": 0.5, "random": false, "anim": { "enable": false } },
        "size": { "value": 3, "random": true, "anim": { "enable": false } },
        "line_linked": { "enable": true, "distance": 150, "color": "#00ff00", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 2.3, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": true, "mode": "repulse" },
            "onclick": { "enable": true, "mode": "push" },
            "resize": true
        },
        "modes": {
            "repulse": { "distance": 100, "duration": 0.4 },
            "push": { "particles_nb": 4 }
        }
    },
    "retina_detect": true
});

// 2. Terminal Toggle Function
function toggleTerminal() {
    const profileView = document.getElementById('profile-view');
    const terminalView = document.getElementById('terminal-view');
    const cmdInput = document.getElementById('cmd-input');

    if (terminalView.style.display === 'flex') {
        // Hide Terminal, Show Profile
        terminalView.style.display = 'none';
        profileView.style.display = 'block';
    } else {
        // Show Terminal, Hide Profile
        profileView.style.display = 'none';
        terminalView.style.display = 'flex';
        // Auto-focus the terminal input when opening
        setTimeout(() => cmdInput.focus(), 100);
    }
}

// 3. Terminal Command Handling
const cmdInput = document.getElementById('cmd-input');
const outputArea = document.getElementById('output-area');
const terminalBody = document.getElementById('terminal-body');

// Focus input if user clicks anywhere in terminal body
terminalBody.addEventListener('click', function() {
    cmdInput.focus();
});

cmdInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim().toLowerCase();
        
        // 1. Print the user's prompt and command to history
        outputArea.innerHTML += `<div class="output-line"><span class="prompt">root@xackerlud:~$</span> ${cmdInput.value}</div>`;

        // 2. Process Commands
        if (command === 'ls') {
            // List Projects with your specific links
            outputArea.innerHTML += `
                <div class="output-line">drwx------ 1 xackerlud staff <a href="https://github.com/xackerlud31337/CaptureGo" target="_blank" class="project-link">CaptureGo</a></div>
                <div class="output-line">drwx------ 1 xackerlud staff <a href="https://github.com/xackerlud31337/Parser_In_Haskell" target="_blank" class="project-link">Parser_In_Haskell</a></div>
                <div class="output-line">drwx------ 1 xackerlud staff <a href="https://github.com/xackerlud31337/BotNet" target="_blank" class="project-link">BotNet</a></div>
                <div class="output-line">-rwx------ 1 xackerlud staff <a href="https://github.com/xackerlud31337" target="_blank" class="project-link">README.md</a></div>
            `;
        } else if (command === 'help') {
            outputArea.innerHTML += `<div class="output-line">Available commands: ls, clear, exit</div>`;
        } else if (command === 'clear') {
            outputArea.innerHTML = '';
        } else if (command === 'exit') {
            toggleTerminal();
            cmdInput.value = ''; 
            return;
        } else if (command !== '') {
            outputArea.innerHTML += `<div class="output-line">bash: ${command}: command not found</div>`;
        }

        // 3. Auto Scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;

        // 4. Clear Input
        cmdInput.value = '';
    }
});