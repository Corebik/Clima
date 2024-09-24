import axios from "axios";
import { z } from 'zod';
// import { object, string, number, /*InferOutput*/ parse } from "valibot";
import type { SearchType } from "../types";
import { useMemo, useState } from "react";

//Zod
const WeatherZ = z.object({
   name: z.string(),
   main: z.object({
      temp: z.number(),
      temp_max: z.number(),
      temp_min: z.number(),
   })
})
export type WeatherType = z.infer<typeof WeatherZ>;

//Valibot
// const WeatherSchema = object({
//    name: string(),
//    main: object({
//       temp: number(),
//       temp_max: number(),
//       temp_min: number(),
//    })
// })
// type Weather = InferOutput<typeof WeatherSchema>;

const FormState = {
   name: '',
   main: {
      temp: 0,
      temp_max: 0,
      temp_min: 0
   }
}

export const useWeather = () => {

   const [weather, setWeather] = useState<WeatherType>(FormState);
   const [loading, setLoading] = useState(false);
   const [notFound, setNotFound] = useState(false);

   const fetchWeather = async( search : SearchType ) => {

      setLoading(true);
      setWeather(FormState);
      try{ 
         const appId : string = import.meta.env.VITE_APPID;
         const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
         const { data } = await axios.get( geoUrl );

         //Comprobar si existe la ciudad
         if( !data[0] ){
            setNotFound(true);
            return;
         }

         
         const lat = data[0].lat;
         const lon = data[0].lon;

         const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

         
         //Valibot
         // const { data:weatherResult } = await axios.get( weatherUrl );
         // const result = parse( WeatherSchema, weatherResult );
         // if( result ){
         //    console.log(result);
         // }

         //Zod
         const { data:weatherResult } = await axios.get( weatherUrl );
         const result = WeatherZ.safeParse( weatherResult );
         if( result.success ){
            setWeather(result.data);
         }

      }catch(error){
         console.log( error );
      }finally{
         setLoading(false);
      }
   }

   const hasWeatherData = useMemo(() => weather.name, [ weather ]);

  return {
      //*Properties
      weather,
      loading,
      notFound,

      //*Methods
      fetchWeather,
      hasWeatherData
  }
}
