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
  IonToggle,
  IonModal,
  IonSpinner,
  IonDatetime,
} from '@ionic/react';
import { calendar, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { useContext } from 'react';
import { useState } from 'react';
import Context from '../store/context';
import './Tab1.css';

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

const Tab1: React.FC = () => {
  const context = useContext(Context);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [goals, setGoals] = useState<any>({});
  const [teams, setTeams] = useState<any>({});
  const [homeStat, setHomeStat] = useState<any[]>([]);
  const [awayStat, setAwayStat] = useState<any[]>([]);
  const [loadMatches, setLoadMatches] = useState(false);
  const [loadFixture, setloadFixture] = useState(false);

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState({
    date: today.getDate(),
    month: today.toLocaleString('en-US', {
      month: 'short',
    }),
    dateString: `${today.toISOString().slice(0, 10)}`,
  });

  const increaseDate = () => {
    const date = new Date(selectedDate.dateString).setDate(
      selectedDate.date + 1
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

  const changeDate = (event: any) => {
    const date = new Date(event.detail.value);
    setSelectedDate({
      date: date.getDate(),
      month: date.toLocaleString('en-US', {
        month: 'short',
      }),
      dateString: `${date.toISOString().slice(0, 10)}`,
    });
    setOpenDate(false);
  }

  // const toggleDarkModeHandler = () => {
  //   document.body.classList.toggle('dark');
  // };

  const changeLeagueHandler = async (event: any) => {
    setMatches([]);
    setLoadMatches(true);
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
    setLoadMatches(false);
  };

  const formatMatchTime = (time: any) => {
    time = new Date(time).toLocaleTimeString();
    time = time.split(' ');
    const number = time[0].split(':');
    number.pop();
    if (time[1]) {
      return `${number[0]}:${number[1]} ${time[1]}`;
    } else {
      return `${number[0]}:${number[1]}`;
    }
  };

  const handleOpen = async (event: any) => {
    setShowModal(true);
    setloadFixture(true);
    setTeams({});
    setGoals({});
    setHomeStat([]);
    setAwayStat([]);

    const fixtureID = event.currentTarget.getAttribute('data-id');
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?id=${fixtureID}`,
      {
        headers: {
          'x-apisports-key': 'cecd3586b04e7c5ec4f347e8b9278b36',
        },
      }
    );

    const data = await response.json();
    const fixture = data.response[0];

    setTeams(fixture.teams);
    setGoals(fixture.goals);
    setHomeStat(fixture.statistics[0].statistics);
    setAwayStat(fixture.statistics[1].statistics);
    setloadFixture(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Matches</IonTitle>
          <IonToggle
            id='themeToggle'
            slot='end'
            checked={context.isDark}
            onIonChange={context.toggleDarkMode}
          />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='calendar'>
          <IonButton color='primary' fill='outline' onClick={decreaseDate}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <div>
            <IonButton fill='outline' onClick={() => setOpenDate(true)}>
              <IonIcon icon={calendar} />
            </IonButton>
            <IonModal
              isOpen={openDate}
              showBackdrop={true}
              className='calendar__modal'
              onIonModalDidDismiss={() => setOpenDate(false)}
            >
              <div className='blank' onClick={() => setOpenDate(false)} />
              <IonDatetime
                className='calendar__datepicker'
                presentation='date'
                value={selectedDate.dateString}
                onIonChange={changeDate}
              />
              <div className='blank' onClick={() => setOpenDate(false)} />
            </IonModal>
            <IonButton color='primary' fill='solid'>
              <span>{selectedDate.date}</span>
              &nbsp;
              <span>{selectedDate.month}</span>
            </IonButton>
          </div>
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
          {loadMatches && (
            <IonSpinner
              name='crescent'
              color='primary'
              className='stats__spinner'
            />
          )}
          {matches.map((match) => (
            <IonCard
              className='matches__item'
              key={match.fixture.id}
              onClick={
                match.fixture.status.long !== 'Not Started'
                  ? handleOpen
                  : undefined
              }
              data-id={match.fixture.id}
            >
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
          <IonModal isOpen={showModal} swipeToClose={true}>
            <IonCard className='stats'>
              {loadFixture && (
                <IonSpinner
                  name='crescent'
                  color='primary'
                  className='stats__spinner'
                />
              )}
              {!loadFixture && (
                <div className='stats__home'>
                  <p className='stats__home--name'>{teams.home?.name}</p>
                  {homeStat.map((stat) => (
                    <p key={stat.type}>
                      {stat.value !== null ? stat.value : 'N/A'}
                    </p>
                  ))}
                </div>
              )}
              {!loadFixture && (
                <div className='stats__type'>
                  <p className='stats__type--scores'>
                    {goals.home} : {goals.away}
                  </p>
                  {homeStat.map((stat) => (
                    <p key={stat.type}>{stat.type}</p>
                  ))}
                </div>
              )}
              {!loadFixture && (
                <div className='stats__away'>
                  <p className='stats__away--name'>{teams.away?.name}</p>
                  {awayStat.map((stat) => (
                    <p key={stat.type}>
                      {stat.value !== null ? stat.value : 'N/A'}
                    </p>
                  ))}
                </div>
              )}
            </IonCard>
            <IonButton
              onClick={() => setShowModal(false)}
              fill='outline'
              className='stats__close'
            >
              Close
            </IonButton>
          </IonModal>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
