import { useState, ChangeEvent, FormEvent } from "react";
import { countries } from "../data/countries";
import styles from "../styles/Form.module.css";
//*COMPONENTS
import { Alert } from "./Alert";
//*TYPES
import type { SearchType } from "../types";

type FormProps = {
   fetchWeather: ( search : SearchType ) => Promise<void>;
}

const FormState = {
   city: "",
   country: ""
}
export const Form = ({ fetchWeather } : FormProps ) => {

   const [search, setSearch] = useState<SearchType>(FormState);
   const [alert, setAlert] = useState("");

   const onInputChange = ( event : ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> ) => {
      const { name, value } = event.target;
      setSearch({ 
         ...search, 
         [name]: value 
      });
   }

   const onSubmit = ( event : FormEvent<HTMLFormElement> ) => {
      event.preventDefault();

      if( Object.values(search).includes("") ){
         setAlert("Todos los campos son obligatorios");
         return;
      };

      fetchWeather(search);
   }

  return (
    <form className={ styles.form } onSubmit={ onSubmit }>
      { Alert && <Alert>{ alert }</Alert> }
      <div className={ styles.field }>
         <label htmlFor="city">Ciudad:</label>
         <input 
            type="text" 
            id="city"
            name="city"
            placeholder="Ciudad..."
            value={ search.city }
            onChange={ onInputChange }
         />
      </div>
      <div className={ styles.field }>
         <label htmlFor="country">País:</label>
         <select 
            name="country" 
            id="country" 
            value={ search.country }
            onChange={ onInputChange }
         >
            <option value="">-- Seleccione un País --</option>
            { countries.map( country => (
               <option
                  key={ country.code }
                  value={ country.code }
               >
                  { country.name }
               </option>
            ) ) }
         </select>
      </div>

      <input className={ styles.submit } type="submit" value="Consultar Clima" />
    </form>
  )
}
