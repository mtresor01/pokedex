const cardsContainer = document.querySelector('.cards');
const searchInput = document.getElementById('searchInput');
const loadMoreButton = document.getElementById('loadMoreButton');
let allLoadedPokemons = [];
let offset = 0;
const limit = 20;

async function loadPokemons() {
  showLoadingSpinner();
  const pokemonResponses = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await pokemonResponses.json();
  for (const loadedPokemon of data.results) {
    const pokemon = await fetchPokemonDetails(loadedPokemon.url);
    allLoadedPokemons.push(pokemon);
    const card = createPokemonCard(pokemon);
    cardsContainer.appendChild(card);
  }
  if (offset === 0) {
    const saved = localStorage.getItem('selectedPokemon');
    const defaultPokemon = saved ? JSON.parse(saved) : allLoadedPokemons[0];
    renderPokemonInModal(defaultPokemon);
  }
  offset += limit;
  document.getElementById('loadingSpinner').classList.add('hidden');
}

function toggleModal(){
    document.getElementById('loadingSpinner').classList.add('hidden');
    if (localStorage.getItem('modalOpen') === 'true') {
        renderPokemonInModal(allLoadedPokemons[currentIndex]);
        document.getElementById('pokemonModal').classList.remove('hidden');
    }
}

function showLoadingSpinner(duration = 5000) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.remove('hidden');
    setTimeout(() => {
        spinner.classList.add('hidden');
    }, duration);
}

async function fetchPokemonDetails(url) {
  const pokemonResponse = await fetch(url);
  const pokemonData = await pokemonResponse.json();
  const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`);
  const species = await speciesResponse.json();
  const englishEntry  = species.flavor_text_entries.find(entry => entry.language.name === 'en');
  return {
    id: pokemonData.id,
    name: pokemonData.name,
    number: `#${pokemonData.id.toString().padStart(3, '0')}`,
    img: pokemonData.sprites.other['official-artwork'].front_default,
    types: pokemonData.types.map(typeInfo  => typeInfo .type.name),
    weight: pokemonData.weight,
    stats: pokemonData.stats,
    description: englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ') : 'No description.'
  };
}

function renderCards(pokemonList) {
  cardsContainer.innerHTML = '';
  pokemonList.forEach(pokemon => {
    const card = createPokemonCard(pokemon);
    cardsContainer.appendChild(card);
  });
}

function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  const mainType = pokemon.types[0];
  card.className = `card type-${mainType}`;
  card.innerHTML = createCardHTML(pokemon);
  card.addEventListener('click', () => {
    currentIndex = allLoadedPokemons.findIndex(loadedPokemon => loadedPokemon.id === pokemon.id);
    renderPokemonInModal(pokemon);     
    document.getElementById('pokemonModal').classList.remove('hidden');
  });
  return card;
}
searchInput.addEventListener('input', event => {
  const query = event.target.value.toLowerCase();
  const filtered = allLoadedPokemons.filter(pokemon =>
    pokemon.name.toLowerCase().startsWith(query)
  );
  renderCards(filtered);
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

document.querySelector('.closeModal').addEventListener('click', () => {
  document.getElementById('pokemonModal').classList.add('hidden');
});

document.getElementById('pokemonModal').addEventListener('click', (e) => {
  const modalContent = document.querySelector('.modalContent');
  if (!modalContent.contains(e.target)) {
    document.getElementById('pokemonModal').classList.add('hidden');
  }
});

document.getElementById('modalPrevPokemon').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + allLoadedPokemons.length) % allLoadedPokemons.length;
  const pokemon = allLoadedPokemons[currentIndex];
  renderPokemonInModal(pokemon);
});

document.getElementById('modalNextPokemon').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % allLoadedPokemons.length;
  const pokemon = allLoadedPokemons[currentIndex];
  renderPokemonInModal(pokemon);
});

loadMoreButton.addEventListener('click', loadPokemons);
loadPokemons();