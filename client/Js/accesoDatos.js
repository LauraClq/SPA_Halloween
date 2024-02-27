import {mostrarSpinner, ocultarSpinner} from "./cargaDinamica.js";

/*-----------------OBTENER LISTA DE MONSTRUOS------------------*/
export function getMonstruos(url_datos)
{
    return new Promise((resolve,reject) => {

        const peticion = new XMLHttpRequest();
        peticion.addEventListener("readystatechange", ()=>
        {
            if (peticion.readyState === 4) 
            {
                if (peticion.status >= 200 && peticion.status < 300) 
                {
                    const data = JSON.parse(peticion.responseText);
                    resolve(data);
                }    
                else
                {
                    reject(`Error ${peticion.status}: ${peticion.statusText}`);
                }
                ocultarSpinner();
            }
            else
            {
                mostrarSpinner();
            }
    });

    peticion.open("GET",url_datos, true); 
    try
    {
        peticion.send(); 
    }
    catch(error)
    {
       reject(error);
    }
    
    });
}

/*-----------------PETICION POR POST CREAR UN MONSTRUO------------------*/
export function postMonstruo(url_datos, nuevoMonstruo)
{
    const peticion = new XMLHttpRequest();
    peticion.addEventListener("readystatechange", ()=>
    {
        if (peticion.readyState == 4) 
        {
            if (peticion.status >= 200 && peticion.status < 300) 
            {
                const data = JSON.parse(peticion.responseText);
                console.log(data);
            }    
            else
            {
                console.error(`Error ${peticion.status}: ${peticion.statusText}`);
            }
            ocultarSpinner();
        }
        else
        {
            mostrarSpinner();
        }
    });

    peticion.open("POST",url_datos); 
    peticion.setRequestHeader("Content-Type","application/json;charset=UTF-8");

    try
    {
        peticion.send(JSON.stringify(nuevoMonstruo)); 
    }
    catch(error)
    {
       console.log(error);
    }

}

/*-----------------PETICION MODIFICAR UN MONSTRUO------------------*/
export function updateMonstruo(url_datos, updateMonstruo)
{
    const peticion = new XMLHttpRequest();
    peticion.addEventListener("readystatechange", ()=>
    {
        if (peticion.readyState == 4) 
        {
            if (peticion.status >= 200 && peticion.status < 300) 
            {
                const data = JSON.parse(peticion.responseText);
                console.log(data);
            }    
            else
            {
                console.error(`Error ${peticion.status}: ${peticion.statusText}`);
            }
            ocultarSpinner();
        }
        else
        {
            mostrarSpinner();
        }
    });

    peticion.open("PUT",url_datos + `/${updateMonstruo.id}`,true); 
    peticion.setRequestHeader("Content-Type","application/json;charset=UTF-8");

    try
    {
        peticion.send(JSON.stringify(updateMonstruo)); 
    }
    catch(error)
    {
       console.log(error);
    }
}

/*-----------------PETICION ELIMINAR UN MONSTRUO------------------*/
export function deleteMonstruos(url,id)
{
    mostrarSpinner();
    axios.delete(url +"/"+id)
    .then(({data}) => console.log(data))
    .catch(({message}) => console.error(message))
    .finally(()=> ocultarSpinner());
}

/*-----------------PETICION GET UN MONSTRUO------------------*/
export async function getUnMonstruoFetch(url,id, callback)
{
    mostrarSpinner();
    try 
    {
        const res = await fetch(url + "/" + id);    
        if (!res.ok) 
        {
            throw Error(res);    
        }
        const data = await res.json();
        callback(data);
        console.log(data);
    } 
    catch (res) 
    {
        console.error(`Error ${res.status}: ${res.statusText}`);
    }
    finally
    {
        ocultarSpinner();
    }
}