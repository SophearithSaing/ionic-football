import { IonChip, IonLabel } from '@ionic/react';
import { useContext, useState } from 'react';
import Context from '../store/context';

const leagues = [
  {
    id: 39,
    league: 'Premier League',
    name: 'premier-league',
  },
  {
    id: 140,
    league: 'La Liga',
    name: 'la-liga',
  },
  {
    id: 78,
    league: 'Bundesliga',
    name: 'bundesliga',
  },
  {
    id: 135,
    league: 'Serie A',
    name: 'serie-a',
  },
  {
    id: 61,
    league: 'League 1',
    name: 'league-1',
  },
  {
    id: 2,
    league: 'UCL',
    name: 'ucl',
  },
  {
    id: 3,
    league: 'UEL',
    name: 'uel',
  },
];

const Leagues: React.FC = () => {
  const today = new Date();
  const context = useContext(Context);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedDate, setSelectedDate] = useState({
    date: today.getDate(),
    month: today.toLocaleString('en-US', {
      month: 'short',
    }),
    dateString: `${today.toISOString().slice(0, 10)}`,
  });

    const changeLeagueHandler = async (event: any) => {
      // setMatches([]);
      // setLoadMatches(true);
      setSelectedLeague(event.currentTarget.getAttribute('data-league'));

      const leagueID = event.currentTarget.getAttribute('data-league-id');
      let date = context.date;

      if (date === '') {
        const today = new Date();
        const month =
          today.getMonth() + 1 < 10
            ? '0' + (today.getMonth() + 1)
            : today.getMonth() + 1;
        date = `${today.getFullYear()}-${month}-${today.getDate()}`;
      }

      let season: string;
      if (leagueID === '410') {
        season = '2022';
      } else {
        season = '2021';
      }

      const response = await fetch(
        `https://v3.football.api-sports.io/fixtures?league=${leagueID}&season=${season}&date=${selectedDate.dateString}&timezone=Asia/Phnom_Penh`,
        {
          headers: {
            'x-apisports-key': 'cecd3586b04e7c5ec4f347e8b9278b36',
          },
        }
      );

      const data = await response.json();

      const matches = data.response;
      matches.forEach((match: any) => {
        if (match.teams.home.id === 5397) {
          match.teams.home.logo = 'https://i.imgur.com/dW5ovST.jpg';
        } else if (match.teams.home.id === 5566) {
          match.teams.home.logo =
            'https://upload.wikimedia.org/wikipedia/en/d/df/Nagaworld_FC_logo.png';
        } else if (match.teams.home.id === 5389) {
          match.teams.home.logo =
            'https://upload.wikimedia.org/wikipedia/en/b/b0/Kirivong_Sok_Sen_Chey_FC_Crest.png';
        }

        if (match.teams.away.id === 5397) {
          match.teams.away.logo = 'https://i.imgur.com/dW5ovST.jpg';
        } else if (match.teams.away.id === 5566) {
          match.teams.away.logo =
            'https://upload.wikimedia.org/wikipedia/en/d/df/Nagaworld_FC_logo.png';
        } else if (match.teams.away.id === 5389) {
          match.teams.away.logo =
            'https://upload.wikimedia.org/wikipedia/en/b/b0/Kirivong_Sok_Sen_Chey_FC_Crest.png';
        }
      });

      // setMatches(matches);
      // setLoadMatches(false);
      context.setMatches(matches);
    };

  return (
    <div className="leagues">
      {leagues.map((league) => (
        <IonChip
          color="primary"
          key={league.id}
          data-league={league.name}
          data-league-id={league.id}
          outline={selectedLeague !== league.name}
          onClick={changeLeagueHandler}
        >
          <IonLabel>{league.league}</IonLabel>
        </IonChip>
      ))}
    </div>
  );
};

export default Leagues;
