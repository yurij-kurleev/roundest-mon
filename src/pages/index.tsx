import React, { useState } from 'react';
import { getOptionsForVote } from '@/backend/utils/getRandomPokemon';
import { trpc } from '@/backend/utils/trpc';
import { inferQueryResponse } from '@/pages/api/trpc/[trpc]';

const btn = 'inline-flex items-center px-2.5 py-1.5 border border-gray300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', {id: first}]);
  const secondPokemon = trpc.useQuery(['get-pokemon-by-id', {id: second}]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is Rounder?</div>
      <div className="p-2"/>
      <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
        {
          !firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(first)}
              />
              <div className="p-8">Vs</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(second)}
              />
            </>
          )
        }
        <div className="p-2" />
      </div>
    </div>
  )
}

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{ pokemon: PokemonFromServer, vote: () => void }> = ({ pokemon, vote }) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={pokemon.sprites.front_default!}
        alt="First Pokemon"
        className="w-64 h-64"
      />
      <div className="text-xl text-center capitalize mt-[-2rem]">{pokemon.name}</div>
      <button onClick={() => vote()} className={btn}>Rounder</button>
    </div>
  )
}
