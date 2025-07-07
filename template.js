function createCardHTML(pokemon) {
  return `
    <h5 class="cardTitle">${capitalize(pokemon.name)}</h5>
    <div class="cardBody">
      <img src="${pokemon.img}" class="cardImg" alt="${pokemon.name}">
      <span>${pokemon.number}</span>
    </div>
    <div class="cardFooter">
      ${pokemon.types.map(pokemonType => `<span class="spanCardFooter type-${pokemonType}">${pokemonType}</span>`).join('')}
    </div>
  `;
}

function renderPokemonInVisualizer(pokemon) {
  if (!pokemon) return;
  nameContainer.textContent = capitalize(pokemon.name);
  numberContainer.textContent = pokemon.number;
  imageContainer.innerHTML = `<img src="${pokemon.img}" alt="${pokemon.name}" style="width: 150px;">`;
  descriptionContainer.textContent = pokemon.description;
  typeContainer.innerHTML = pokemon.types.map(pokemonType =>
    `<span class="spanCardFooter type-${pokemonType}">${pokemonType}</span>`).join('');
  statsContainer.innerHTML = `
    <p><strong>Weight:</strong> ${pokemon.weight}</p>
    ${pokemon.stats.map(stat => `
      <p><strong>${capitalize(stat.stat.name)}:</strong> ${stat.base_stat}</p>`).join('')}
  `;
  localStorage.setItem('selectedPokemon', JSON.stringify(pokemon));
}

function renderPokemonInModal(pokemon) {
  document.getElementById('modalPokemonName').textContent = capitalize(pokemon.name);
  document.getElementById('modalPokemonNumber').textContent = pokemon.number;
  document.getElementById('modalPokemonImage').innerHTML = `<img src="${pokemon.img}" alt="${pokemon.name}" style="width: 150px;">`;
  document.getElementById('modalPokemonDescription').textContent = pokemon.description;
  document.getElementById('modalPokemonType').innerHTML = pokemon.types.map(pokemonType =>
    `<span class="spanCardFooter type-${pokemonType}">${pokemonType}</span>`).join('');
  document.getElementById('modalPokemonStatistc').innerHTML = `
    <p><strong>Weight:</strong> ${pokemon.weight}</p>
    ${pokemon.stats.map(stat => `
      <p><strong>${capitalize(stat.stat.name)}:</strong> ${stat.base_stat}</p>`).join('')}
  `;
}