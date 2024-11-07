import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pokeData, setPokeData] = useState(null);
  const [pokeId, setPokeId] = useState(1);
  const [pokeInput, setPokeInput] = useState('');

  useEffect(() => {
    const fetchPokeData = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
        if (!response.ok) throw new Error('Not a valid response');
        const data = await response.json();
        setPokeData(data);
      } catch (error) {
        console.error('Failed to Fetch:', error);
        setPokeData(null); // In case of error, reset pokeData
      }
    };

    fetchPokeData();
  }, [pokeId]);

  const handleRandomPokemon = () => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    setPokeId(randomId);
  };

  const handleInputChange = (event) => {
    setPokeInput(event.target.value);
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      const idOrName = pokeInput.toLowerCase();
      if (isNaN(idOrName)) {
        // If input is not a number, treat it as a name
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
        if (response.ok) {
          const data = await response.json();
          setPokeId(data.id); // Set the ID based on the fetched name
        } else {
          alert('Pokémon not found');
          setPokeInput('');
        }
      } else {
        // If input is a number, set as Pokémon ID
        setPokeId(Number(idOrName));
      }
    }
  };

  function PokemonCard({ name, image, types, stats }) {
    const typeColors = {
      normal: '#A6AEBF',
      fire: '#FA812F',
      water: '#133E87',
      grass: '#7c5',
      bug: '#859F3D',
      electric: '#FEEC37',
      ice: '#A2D2DF',
      fighting: '#C62E2E',
      poison: '#7E60BF',
      ground: '#db5',
      flying: '#89f',
      psychic: '#D76C82',
      rock: '#ba6',
      ghost: '#66b',
      dragon: '#433878',
      dark: '#754',
      steel: '#aab',
      fairy: '#e9e',
    };

    return (
      <article className="pokeInfo">
        <h1 className="pokeName">{name}</h1>
        <img src={image} alt={name} />
        <article className="types">
          <ul>
            {types.map((type) => (
              <li
                key={type}
                style={{ background: typeColors[type] }}
              >
                {type}
              </li>
            ))}
          </ul>
        </article>

        <article className="pokeStats">
          <h2>Stats:</h2>
          <ul>
            {stats.map((stat) => (
              <li key={stat.stat.name}>
                <strong>{stat.stat.name.toUpperCase()}:</strong> {stat.base_stat}
              </li>
            ))}
          </ul>
        </article>
      </article>
    );
  }

  function PokemonAbilitiesAndMoves({ abilities, moves }) {
    return (
      <section className="pokemon-data">
        <article className="lists">
          <article className="abilityList">
            <h2>Abilities:</h2>
            <ul>
              {abilities.map((ability) => (
                <li key={ability.ability.name}>{ability.ability.name}</li>
              ))}
            </ul>
          </article>

          <article className="moveList">
            <h2>Moves:</h2>
            <ul>
              {moves.map((move) => (
                <li key={move.move.name}>{move.move.name}</li>
              ))}
            </ul>
          </article>
        </article>
      </section>
    );
  }

  return (
    <section className="pokedex--section">
      <h1>PokeDex</h1>

      <section className="pokedex-screen">
        <div className="inputs">
          <input
            type="text"
            value={pokeInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Enter Pokémon name or Pokémon ID"
          />
          <button onClick={handleRandomPokemon}>Next Random Pokémon</button>
        </div>

        {pokeData ? (
          <>
            <PokemonCard
              name={pokeData.name}
              image={pokeData.sprites.front_default}
              types={pokeData.types.map((type) => type.type.name)}
              stats={pokeData.stats}
            />

            <PokemonAbilitiesAndMoves
              abilities={pokeData.abilities}
              moves={pokeData.moves}
            />
          </>
        ) : (
          <p>Loading next Pokémon...</p>
        )}
      </section>
    </section>
  );
}

export default App;
