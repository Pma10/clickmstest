let playing = false;
let checkingCounts = 0;
let latencies = [];
let isClickable = false;
let startTime = null;
let timeoutId = null; 

const mainFrame = document.getElementById("clickContainer");
const mainFrameText = document.getElementById("clickContainerText");

function startGame() {
    if (playing) return;
    resetGame();
    playing = true;
    mainFrameText.textContent = "게임 준비 중... 기다리세요!";
    mainFrame.style.backgroundColor = "red";
    timeoutId = setTimeout(nextTest, 1500);
}

function nextTest() {
    if (checkingCounts >= 5) {
        endGame();
        return;
    }

    const waitTime = Math.random() * 2000 + 1000;
    mainFrame.style.backgroundColor = "red";
    mainFrameText.textContent = "기다리세요...";
    isClickable = false;

    timeoutId = setTimeout(() => {
        isClickable = true;
        mainFrame.style.backgroundColor = "green";
        mainFrameText.textContent = "클릭하세요!";
        startTime = performance.now();
    }, waitTime);
}

mainFrame.addEventListener("click", () => {
    if (!playing) {
        startGame();
        return;
    }

    if (!isClickable) {
        clearTimeout(timeoutId); 
        mainFrameText.textContent = "너무 일찍 클릭했어요! 다시 시도합니다.";
        mainFrame.style.backgroundColor = "orange";
        timeoutId = setTimeout(nextTest, 1000);
        return;
    }

    const latency = performance.now() - startTime;
    latencies.push(latency);
    checkingCounts++;

    mainFrameText.textContent = `${latency.toFixed(2)}ms`;
    mainFrame.style.backgroundColor = "gray";
    isClickable = false;

    timeoutId = setTimeout(nextTest, 1000);
});

function endGame() {
    playing = false;
    clearTimeout(timeoutId);
    const avgLatency = latencies.reduce((a, b) => a + b) / latencies.length;
    mainFrameText.textContent = `평균 반응 시간: ${avgLatency.toFixed(2)}ms`;
    mainFrame.style.backgroundColor = "blue";
}

function resetGame() {
    clearTimeout(timeoutId);
    checkingCounts = 0;
    latencies = [];
    mainFrameText.textContent = "게임을 시작하려면 클릭하세요.";
    mainFrame.style.backgroundColor = "blue";
}
