let data = [];
let index = 0;
let score = 0;

fetch('notts-or-not.json')
  .then(res => res.json())
  .then(json => {
    data = json;
    loadImage();
  });

function loadImage() {
    const item = data[index];
    document.getElementById('pic').src = item.img;
    document.getElementById('result').textContent = "";
    document.getElementById('progress').textContent = `Image ${index + 1} of ${data.length}`;
}

function guess(choice) {
    const correct = data[index].isNotts;
    if (choice === correct) {
        score++;
        document.getElementById('result').textContent = "Correct!";
    } else {
        document.getElementById('result').textContent = "Wrong!";
    }

    index++;

    setTimeout(() => {
        if (index < data.length) {
            loadImage();
        } else {
            endGame();
        }
    }, 600);
}

function endGame() {
    document.getElementById('game').innerHTML = `
      <h2>Final Score: ${score} / ${data.length}</h2>
      <button onclick="location.reload()">Play Again</button>
    `;
}
