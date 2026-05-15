import { getTopGames, getGenres, getLastUpdated } from '@/lib/api';
import TopGamesTable from '@/components/TopGamesTable';
import GenreChart from '@/components/GenreChart';
import PulseStats from '@/components/PulseStats';
import HeroBanner from '@/components/HeroBanner';

export default async function Home() {
  const [topGames, genres, lastUpdated] = await Promise.all([
    getTopGames(50),
    getGenres(),
    getLastUpdated()
  ]);

  const totalPlayers = topGames.reduce((sum: number, g: {current_players: number}) => sum + g.current_players, 0);

  const formattedTime = lastUpdated?.last_updated
    ? new Date(lastUpdated.last_updated).toLocaleString('en-US', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
      })
    : null;

  return (
    <main style={{minHeight:'100vh', background:'#030712', color:'#f9fafb'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto', padding:'32px 24px'}}>

        <HeroBanner
          totalPlayers={totalPlayers}
          topGames={topGames.slice(0, 20)}
          lastUpdated={formattedTime}
        />

        <PulseStats games={topGames} />

        <div style={{marginTop:'32px'}}>
          <TopGamesTable games={topGames} />
        </div>

        <div style={{marginTop:'24px'}}>
          <GenreChart genres={genres} />
        </div>

      </div>
    </main>
  );
}