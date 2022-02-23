import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonChip,
  IonLabel,
  IonCard,
  IonIcon,
} from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { useContext } from 'react';
import { useState } from 'react';
import Context from '../store/context';
import './Tab1.css';

const Tab1: React.FC = () => {
  const context = useContext(Context);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState('');

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
  ];

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState({
    date: today.getDate(),
    month: today.toLocaleString('en-US', {
      month: 'short',
    }),
    dateString: `${today.toISOString().slice(0, 10)}`,
  });  

  const increaseDate = () => {
    const date = new Date(selectedDate.dateString).setDate(selectedDate.date + 1);
    const nextDate = new Date(date);
    setSelectedDate({
      date: nextDate.getDate(),
      month: nextDate.toLocaleString('en-US', {
        month: 'short',
      }),
      dateString: `${nextDate.toISOString().slice(0, 10)}`,
    });
  };

  const decreaseDate = () => {
    const date = new Date(selectedDate.dateString).setDate(
      selectedDate.date - 1
    );
    const nextDate = new Date(date);
    setSelectedDate({
      date: nextDate.getDate(),
      month: nextDate.toLocaleString('en-US', {
        month: 'short',
      }),
      dateString: `${nextDate.toISOString().slice(0, 10)}`,
    });
  };

  const changeLeagueHandler = async (event: any) => {
    setMatches([]);
    setSelectedLeague(event.currentTarget.getAttribute('data-league'));

    const leagueID = event.currentTarget.getAttribute('data-league-id');
    let date = context.date;
    console.log(date);
    
    if (date === '') {
      const today = new Date();
      const month =
        today.getMonth() + 1 < 10
          ? '0' + (today.getMonth() + 1)
          : today.getMonth() + 1;
      date = `${today.getFullYear()}-${month}-${today.getDate()}`;
    }

    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=${leagueID}&season=2021&date=${selectedDate.dateString}&timezone=Asia/Phnom_Penh`,
      {
        headers: {
          'x-apisports-key': 'cecd3586b04e7c5ec4f347e8b9278b36',
        },
      }
    );

    const data = await response.json();
    setMatches(data.response);
  };

  const formatMatchTime = (time: any) => {
    time = new Date(time).toLocaleTimeString();
    time = time.split(' ');
    const number = time[0].split(':');
    number.pop();
    return `${number[0]}:${number[1]} ${time[1]}`;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Matches</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='calendar'>
          <IonButton color='primary' fill='outline' onClick={decreaseDate}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonButton color='primary' fill='solid' onClick={increaseDate}>
            <span>{selectedDate.date}</span>
            &nbsp;
            <span>{selectedDate.month}</span>
          </IonButton>
          <IonButton color='primary' fill='outline' onClick={increaseDate}>
            <IonIcon icon={chevronForwardOutline} />
          </IonButton>
        </div>

        <div className='leagues'>
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

        <div className='matches'>
          {matches.map((match) => (
            <IonCard className='matches__item' key={match.fixture.id}>
              <div className='matches__item--content'>
                <div className='matches__item--team'>
                  <img
                    src={match.teams.home.logo}
                    alt={`${match.teams.home.name} logo`}
                  />
                  <p>{match.teams.home.name}</p>
                </div>
                <div className='matches__item--score'>
                  {match.fixture.status.long !== 'Not Started' && (
                    <p>
                      {match.goals.home} : {match.goals.away}
                    </p>
                  )}
                  {match.fixture.status.long === 'Not Started' && (
                    <p>{formatMatchTime(match.fixture.date)}</p>
                  )}
                </div>
                <div className='matches__item--team'>
                  <p>{match.teams.away.name}</p>
                  <img
                    src={match.teams.away.logo}
                    alt={`${match.teams.away.name} logo`}
                  />
                </div>
              </div>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
