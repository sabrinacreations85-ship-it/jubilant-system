const MAX_PLAYER_HP = 100;
const MAX_PLAYER_ENERGY = 3;
const MAX_ENEMY_HP = 110;

const state = {
  playerHP: MAX_PLAYER_HP,
  playerEnergy: MAX_PLAYER_ENERGY,
  enemyHP: MAX_ENEMY_HP,
  gameOver: false,
};

const playerHealthFill = document.getElementById('player-health-fill');
const playerHealthText = document.getElementById('player-health-text');
const playerEnergyFill = document.getElementById('player-energy-fill');
const playerEnergyText = document.getElementById('player-energy-text');
const enemyHealthFill = document.getElementById('enemy-health-fill');
const enemyHealthText = document.getElementById('enemy-health-text');
const battleLog = document.getElementById('battle-log');

const attackButton = document.getElementById('attack-button');
const blockButton = document.getElementById('block-button');
const healButton = document.getElementById('heal-button');
const specialButton = document.getElementById('special-button');
const resetButton = document.getElementById('reset-button');

function setLog(message) {
  battleLog.textContent = message;
}

function updateUI() {
  const playerPercent = (state.playerHP / MAX_PLAYER_HP) * 100;
  const enemyPercent = (state.enemyHP / MAX_ENEMY_HP) * 100;
  const energyPercent = (state.playerEnergy / MAX_PLAYER_ENERGY) * 100;

  playerHealthFill.style.width = `${Math.max(playerPercent, 0)}%`;
  enemyHealthFill.style.width = `${Math.max(enemyPercent, 0)}%`;
  playerEnergyFill.style.width = `${Math.max(energyPercent, 0)}%`;

  playerHealthText.textContent = `${state.playerHP} / ${MAX_PLAYER_HP}`;
  enemyHealthText.textContent = `${state.enemyHP} / ${MAX_ENEMY_HP}`;
  playerEnergyText.textContent = `${state.playerEnergy} / ${MAX_PLAYER_ENERGY}`;
}

function enemyTurn() {
  if (state.gameOver) {
    return;
  }

  const actionRoll = Math.random();
  let damage = 8 + Math.floor(Math.random() * 10);

  if (actionRoll < 0.18) {
    damage = 0;
    setLog('Night Fang lunges but misses the opening. Sabrina keeps her footing.');
  } else if (actionRoll < 0.5) {
    damage = 12 + Math.floor(Math.random() * 8);
    setLog(`Night Fang strikes hard for ${damage} damage.`);
  } else if (actionRoll < 0.8) {
    damage = 5 + Math.floor(Math.random() * 6);
    setLog(`A quick counterattack lands for ${damage} damage.`);
  } else {
    setLog('Night Fang roars and forces Sabrina to absorb a brutal hit.');
  }

  if (damage > 0) {
    state.playerHP = Math.max(0, state.playerHP - damage);
    updateUI();
    if (state.playerHP <= 0) {
      state.gameOver = true;
      setLog('Sabrina falls to one knee. Night Fang claims the arena.');
      disableActions();
    }
  }
}

function disableActions() {
  [attackButton, blockButton, healButton, specialButton].forEach((button) => {
    button.disabled = true;
    button.style.opacity = '0.6';
  });
}

function enableActions() {
  [attackButton, blockButton, healButton, specialButton].forEach((button) => {
    button.disabled = false;
    button.style.opacity = '1';
  });
}

function finishTurn() {
  if (state.enemyHP <= 0) {
    state.gameOver = true;
    setLog('Night Fang drops. Sabrina wins the match and the crowd erupts!');
    disableActions();
    return true;
  }

  if (state.playerHP <= 0) {
    state.gameOver = true;
    disableActions();
    return true;
  }

  enemyTurn();
  return false;
}

function resolveAttack() {
  if (state.gameOver) {
    return;
  }

  const damage = 12 + Math.floor(Math.random() * 14);
  state.enemyHP = Math.max(0, state.enemyHP - damage);
  setLog(`Sabrina lands a clean strike for ${damage} damage.`);
  updateUI();

  if (finishTurn()) {
    return;
  }
}

function resolveBlock() {
  if (state.gameOver) {
    return;
  }

  state.playerEnergy = Math.min(MAX_PLAYER_ENERGY, state.playerEnergy + 1);
  setLog('Sabrina raises her guard and steadies her breathing. Focus climbs.');
  updateUI();
  enemyTurn();
}

function resolveHeal() {
  if (state.gameOver) {
    return;
  }

  const healAmount = 16 + Math.floor(Math.random() * 10);
  state.playerHP = Math.min(MAX_PLAYER_HP, state.playerHP + healAmount);
  setLog(`Sabrina recovers ${healAmount} health with a disciplined breath.`);
  updateUI();
  enemyTurn();
}

function resolveSpecial() {
  if (state.gameOver) {
    return;
  }

  if (state.playerEnergy <= 0) {
    setLog('Sabrina needs more focus before she can unleash the special move.');
    return;
  }

  state.playerEnergy -= 1;
  const damage = 24 + Math.floor(Math.random() * 16);
  state.enemyHP = Math.max(0, state.enemyHP - damage);
  setLog(`Sabrina unleashes a blazing finisher for ${damage} damage.`);
  updateUI();

  if (finishTurn()) {
    return;
  }
}

function resetGame() {
  state.playerHP = MAX_PLAYER_HP;
  state.playerEnergy = MAX_PLAYER_ENERGY;
  state.enemyHP = MAX_ENEMY_HP;
  state.gameOver = false;
  setLog('The arena doors slam shut. Sabrina steps forward.');
  enableActions();
  updateUI();
}

attackButton.addEventListener('click', resolveAttack);
blockButton.addEventListener('click', resolveBlock);
healButton.addEventListener('click', resolveHeal);
specialButton.addEventListener('click', resolveSpecial);
resetButton.addEventListener('click', resetGame);

updateUI();
