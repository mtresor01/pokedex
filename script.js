const cardsContainer = document.querySelector('.cards');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loadMoreButton = document.getElementById('loadMoreButton');
const allLoadedPokemons = [];
let offset = 0;
const limit = 20;

async function loadPokemons() {
  showLoadingSpinner();
  const data = await fetchPokemonList(limit, offset);
  for (const result of data.results) {
    const pokemon = await fetchPokemonDetails(result.url);
    allLoadedPokemons.push(pokemon);
    cardsContainer.appendChild(createPokemonCard(pokemon));
  }
  if (offset === 0) renderInitialModal();
  offset += limit;
  hideLoadingSpinner();
}

async function fetchPokemonList(limit, offset) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  return res.json();
}

function renderInitialModal() {
  const saved = localStorage.getItem('selectedPokemon');
  const defaultPokemon = saved ? JSON.parse(saved) : allLoadedPokemons[0];
  renderPokemonInModal(defaultPokemon);
}

function hideLoadingSpinner() {
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
  const pokemonData = await (await fetch(url)).json();
  const speciesData = await fetchPokemonSpecies(pokemonData.id);
  return formatPokemon(pokemonData, speciesData);
}

async function fetchPokemonSpecies(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  return res.json();
}

function formatPokemon(data, species) {
  const description = species.flavor_text_entries.find(e => e.language.name === 'en');
  return {
    id: data.id,
    name: data.name,
    number: `#${data.id.toString().padStart(3, '0')}`,
    img: data.sprites.other['official-artwork'].front_default,
    types: data.types.map(t => t.type.name),
    weight: data.weight,
    stats: data.stats,
    description: description ? description.flavor_text.replace(/\f/g, ' ') : 'No description.'
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
    document.body.classList.add('modal-open');
  });
  return card;
}

function handleSearchInput() {
  const value = searchInput.value.trim();
  if (value.length >= 3) {
    searchButton.disabled = false;
    searchButton.classList.add('active');
  } else {
    searchButton.disabled = true;
    searchButton.classList.remove('active');
    renderCards(allLoadedPokemons);
  }
}

function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (query.length < 3) {
    alert("Bitte mindestens 3 Buchstaben eingeben");
    return;
  }
  const filteredPokemons = allLoadedPokemons.filter(p =>
    p.name.toLowerCase().includes(query)
  );
  renderCards(filteredPokemons);
  document.getElementById('pokemonModal').classList.add('hidden');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

document.querySelector('.closeModal').addEventListener('click', () => {
  document.getElementById('pokemonModal').classList.add('hidden');
  document.body.classList.remove('modal-open');
});

document.getElementById('pokemonModal').addEventListener('click', (e) => {
  const modalContent = document.querySelector('.modalContent');
  if (!modalContent.contains(e.target)) {
    document.getElementById('pokemonModal').classList.add('hidden');
    document.body.classList.remove('modal-open'); 
  }
});

document.getElementById('modalPrevPokemon').addEventListener('click', () => {
  if (currentIndex === 0) {
    currentIndex = allLoadedPokemons.length - 1;
  } else {
    currentIndex--;
  }
  const pokemon = allLoadedPokemons[currentIndex];
  renderPokemonInModal(pokemon);
});

document.getElementById('modalNextPokemon').addEventListener('click', () => {
  if (currentIndex === allLoadedPokemons.length - 1) {
    currentIndex = 0;
  } else {
    currentIndex++;
  }
  const pokemon = allLoadedPokemons[currentIndex];
  renderPokemonInModal(pokemon);
});

function init() {
  loadMoreButton.addEventListener('click', loadPokemons);
  searchInput.addEventListener('input', handleSearchInput);
  searchButton.addEventListener('click', handleSearch);
  loadPokemons();
}

init();