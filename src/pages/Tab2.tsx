import {
  IonCard,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonLabel,
  IonPage,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/react';
import { useContext } from 'react';
import { useState } from 'react';
import Context from '../store/context';
import './Tab2.scss';

const leagues = [
  {
    id: 410,
    league: 'Cambodian League',
    name: 'cambodian-league',
  },
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
];

const Tab2: React.FC = () => {
  const context = useContext(Context);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [standings, setStandings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const changeLeagueHandler = async (event: any) => {
    setIsLoading(true);
    setStandings([]);
    setSelectedLeague(event.currentTarget.getAttribute('data-league'));

    const leagueID = event.currentTarget.getAttribute('data-league-id');
    let season: string;
    if (leagueID === '410') {
      season = '2022';
    } else {
      season = '2021';
    }

    const response = await fetch(
      `https://v3.football.api-sports.io/standings?league=${leagueID}&season=${season}`,
      {
        headers: {
          'x-apisports-key': 'cecd3586b04e7c5ec4f347e8b9278b36',
        },
      },
    );

    const data = await response.json();
    const item = data.response[0];

    const standings = item.league.standings[0];
    standings.forEach((standing: any) => {
      if (standing.team.id === 5397) {
        standing.team.logo = 'https://i.imgur.com/dW5ovST.jpg';
      } else if (standing.team.id === 5566) {
        standing.team.logo =
          'https://upload.wikimedia.org/wikipedia/en/d/df/Nagaworld_FC_logo.png';
      } else if (standing.team.id === 5389) {
        standing.team.logo =
          'https://upload.wikimedia.org/wikipedia/en/b/b0/Kirivong_Sok_Sen_Chey_FC_Crest.png';
      }
    });

    setStandings(standings);
    setIsLoading(false);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Standings</IonTitle>
          <IonToggle
            id='themeToggle'
            slot='end'
            checked={context.isDark}
            onIonChange={context.toggleDarkMode}
          />
        </IonToolbar>
      </IonHeader>
      <IonContent className='standings'>
        <div className='standings__tournaments'>
          {leagues.map((league) => (
            <IonChip
              color='primary'
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

        {isLoading && (
          <IonSpinner
            name='crescent'
            color='primary'
            className='standings__spinner'
          />
        )}
        {!isLoading && standings.length > 0 && (
          <IonCard className='standings__table'>
            <IonGrid className='standings__table--container'>
              <IonRow className='standings__table--row'>
                <IonCol size='2'>No.</IonCol>
                <IonCol size='5' className='standings__table--team-name'>
                  Club
                </IonCol>
                <IonCol size='2'>Pts</IonCol>
                <IonCol size='2'>MP</IonCol>
                <IonCol size='2'>W</IonCol>
                <IonCol size='2'>D</IonCol>
                <IonCol size='2'>L</IonCol>
                <IonCol size='2'>GF</IonCol>
                <IonCol size='2'>GA</IonCol>
                <IonCol size='2'>GD</IonCol>
              </IonRow>
              {standings.map((team) => (
                <IonRow key={team.rank} className='standings__table--row'>
                  <IonCol size='2'>{team.rank}</IonCol>
                  <IonCol size='5' className='standings__table--team-name'>
                    <div>
                      <img
                        src={team.team.logo}
                        alt={`${team.team.name} logo`}
                      />
                      <p>{team.team.name}</p>
                    </div>
                  </IonCol>
                  <IonCol size='2'>{team.points}</IonCol>
                  <IonCol size='2'>{team.all.played}</IonCol>
                  <IonCol size='2'>{team.all.win}</IonCol>
                  <IonCol size='2'>{team.all.draw}</IonCol>
                  <IonCol size='2'>{team.all.lose}</IonCol>
                  <IonCol size='2'>{team.all.goals.for}</IonCol>
                  <IonCol size='2'>{team.all.goals.against}</IonCol>
                  <IonCol size='2'>{team.goalsDiff}</IonCol>
                </IonRow>
              ))}
            </IonGrid>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
