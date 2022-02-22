import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonChip, IonLabel } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const Tab1: React.FC = () => {
  const today = new Date();
  const dateArr = [];

  for (let i = -1; i <= 1; i++) {
    const month =
      today.getMonth() + 1 < 10
        ? '0' + (today.getMonth() + 1)
        : today.getMonth() + 1;
    const fullDateString = `${today.getFullYear()}-${month}-${today.getDate() + i}`;
    dateArr.push({
      date: today.getDate() + i,
      month: new Date(fullDateString).toLocaleString('en-US', {
        month: 'short',
      }),
      fullDateString,
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Matches</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="calendar">
          {
            dateArr.map((date) => (
              <IonButton color="primary" key={date.date}>{date.date} {date.month}</IonButton>
            ))
          }
        </div>
        <div className="leagues">
          <IonChip color="primary">
            <IonLabel>Secondary Label</IonLabel>
          </IonChip>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
