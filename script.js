const allNamesURL = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const svgButton = document.querySelector('g');
const values = document.querySelectorAll('.value');
const imageDiv = document.getElementById('center');
const types = document.getElementById('types');
const male = '\u2642';
const female = '\u2640';

const fetchData = async (key) => {

    try {
        const res = await fetch(key ? allNamesURL + '/' + key : allNamesURL);
        if (res.status === 200) {
            const data = await res.json();
            showResults(key, data);
        } else {
            alert("Pokémon not found");
            clearValues();
            return;
        }
    } catch (err) {
        console.log(`Caught An Error Hana: ${err}`);
    }
}

const findPokemon = (key) => {
    // key must be lowercase
    // dash seperated
    // U+2640 ♀ FEMALE SIGN	♀	
    //U+2642 ♂ MALE SIGN
    /** replace all non alphabet/number to dash? except male and female?*/

    const id = Number(key) ? key : key.toLowerCase().replace(/[♀]/g, "-f").replace(/[♂]/g, "-m").replace(/[^a-z]/g, "-");
    fetchData(id);
}

const showResults = (key, results) => {
    if (results.count) {
        console.log(results.results);
    } else {

        const makeItFit = (el, remSize) => { //dynamically lower font size on element
            console.log("remSize: ",remSize);
            el.style.fontSize = `${remSize}rem`;
        }

        showImg(results);

        const myKeys = ['hp', 'speed', 'attack', 'defense', 'special-attack', 'special-defense']
        let resStats = {};
        results.stats.forEach(value => myKeys.includes(value.stat.name) ? resStats[value.stat.name] = value.base_stat : false);
        let resTypes = [];
        results.types.forEach(value => resTypes.push({ name: value.type.name, url: value.type.url }));
        let typesEl;

        values.forEach((el) => {
            const id = el.getAttribute('id');

            const statsMap = {
                "pokemon-name": results.name.toUpperCase(),
                "pokemon-id": results.id,
                height: results.height,
                weight: results.weight,
                hp: resStats.hp,
                attack: resStats.attack,
                defense: resStats.defense,
                speed: resStats.speed,
                "special-attack": resStats['special-attack'],
                "special-defense": resStats['special-defense']
            }
            
            // workaround to make longer names fit into the space
            if (id === "pokemon-name") {
                switch (statsMap["pokemon-name"].length) {
                    case 8: makeItFit(el, 0.91); break;
                    case 9: makeItFit(el, 0.83); break;
                    case 10: makeItFit(el, 0.75); break;
                    case 11: makeItFit(el, 0.68); break;
                    default:
                        makeItFit(el, 1);
                }
            }
            el.textContent = statsMap[id];
        });

        showTypes(resTypes);

    }

    //<span class="value type">GHOST</span>
    function showTypes(resTypes) {
        types.innerHTML = '';
        for (let i = 0; i < resTypes.length && i < 3; i++) {
            types.innerHTML += `<span class="value type">${resTypes[i].name.toUpperCase()}</span>`;
        }
    }
}

svgButton.addEventListener('animationend', () => {
    svgButton.classList.remove('button-spin');
})


function resetImgDiv() {
    imageDiv.classList.remove('expand');
    imageDiv.classList.add('reset');
}

searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    search();
})

function search() {
    if (searchInput.value == "") {
        clearValues();
    } else {
        svgButton.classList.add('button-spin');
        findPokemon(searchInput.value);
    }
}

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        search();
    }
});

function clearValues() {
    values.forEach(val => val.textContent = '\u{2B50}');
    types.innerHTML = `<span class="value">${'\u{2B50}'}</span>`;
    resetImgDiv();
}

function showImg(data) {
    let timeout = 0;
    if (imageDiv.classList.contains('expand')) {
        resetImgDiv();
        timeout = 500;
    }
    setTimeout(() => { imageDiv.classList.add("expand") }, timeout);
    imageDiv.innerHTML = `<img id="sprite" src="${data.sprites.front_default}" alt="character image">`;
}

fetchData();
clearValues();
