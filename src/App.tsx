import { Form, WeatherDetail, Spinner, Alert } from './components';
import styles from './styles/App.module.css';
//*HOOKS
import { useWeather } from './hooks/useWeather';

export const App = () => {

   const { weather, loading, notFound, fetchWeather, hasWeatherData } = useWeather();



  return (
    <>
      <h1 className={styles.title}>Buscador de Clima</h1>

      <div className={styles.container}>
         <Form fetchWeather={ fetchWeather } />
         { loading && <Spinner /> }
         { hasWeatherData && <WeatherDetail weather={ weather } /> }
         { notFound && <Alert>Ciudad No Encontrada</Alert> }
      </div>
    </>
  )
}
