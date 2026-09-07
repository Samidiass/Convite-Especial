let clawPosition = 98;
let caughtCount = 0;
let isBusy = false;
let selectedTicket = "";

const envelopes = [
    { id: 'env-1', x: 35, caught: false },
    { id: 'env-2', x: 95, caught: false },
    { id: 'env-3', x: 155, caught: false }
];

const ticketDetails = {
    'pordosol': {
        title: 'PÔR DO SOL G10',
        image: 'pordosol.png'
    },
    'jardins': {
        title: 'JARDINS CAFÉ',
        image: 'jardins.png'
    },
    'cajuba': {
        title: 'O CAJUBÁ',
        image: 'cajuba.png'
    }
};

function goToScreen(screenId) {
    document.querySelectorAll('.pixel-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function moveClaw(direction) {
    if (isBusy) return;
    if (clawPosition + direction >= 15 && clawPosition + direction <= 175) {
        clawPosition += direction;
        document.getElementById('claw-arm').style.left = clawPosition + 'px';
    }
}

function catchEnvelope() {
    if (isBusy) return;
    isBusy = true;

    const clawArm = document.getElementById('claw-arm');
    const clawHead = document.getElementById('claw-head');
    const statusMsg = document.getElementById('status-msg');
    
    statusMsg.innerText = "Baixando...";

    gsap.to(clawArm, {
        height: "135px",
        duration: 0.8,
        onComplete: () => {
            let targetEnv = null;

            envelopes.forEach(env => {
                if (!env.caught && Math.abs(clawPosition - env.x) <= 10) {
                    targetEnv = env;
                }
            });

            if (targetEnv) {
                targetEnv.caught = true;
                caughtCount++;
                statusMsg.innerText = "PEGOU!";
                
                const envElement = document.getElementById(targetEnv.id);
                envElement.style.position = 'absolute';
                envElement.style.left = '-3px';
                envElement.style.bottom = '-12px';
                clawHead.appendChild(envElement);

                gsap.to(clawArm, {
                    height: "30px",
                    duration: 0.8,
                    delay: 0.2,
                    onComplete: () => {
                        envElement.style.display = 'none';
                        document.getElementById('counter').innerText = `CARTAS: ${caughtCount}/3`;
                        finishTurn();
                    }
                });
            } else {
                statusMsg.innerText = "ERROU!";
                gsap.to(clawArm, {
                    height: "30px",
                    duration: 0.8,
                    delay: 0.2,
                    onComplete: finishTurn
                });
            }
        }
    });
}

function finishTurn() {
    isBusy = false;
    const statusMsg = document.getElementById('status-msg');
    
    if (caughtCount === 3) {
        statusMsg.innerText = "TODAS CAPTURADAS!";
        document.getElementById('btn-next').classList.remove('hidden');
        document.getElementById('btn-catch').disabled = true;
    } else {
        setTimeout(() => { statusMsg.innerText = "Mire e aperte PEGAR!"; }, 1000);
    }
}

function showTicketDetail(type) {
    selectedTicket = ticketDetails[type].title;
    document.getElementById('detail-title').innerText = ticketDetails[type].title;
    document.getElementById('detail-image').src = ticketDetails[type].image;
    goToScreen('screen-detail');
}

function runAway() {
    const btnNo = document.getElementById('btn-no');
    const randomX = Math.floor(Math.random() * 80) - 40;
    const randomY = Math.floor(Math.random() * 50) - 25;
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

function sendWhatsapp() {
    window.open("https://wa.me/5585992437888", "_blank");
}