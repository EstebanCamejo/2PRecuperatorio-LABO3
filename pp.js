let stringJson;
let tabla;
let formDatos;
let formAbm;
let listaPersonas = [];
let gifBack = document.getElementById('loading-contenedor');


//CLASES
class Persona{
    constructor(id, nombre, apellido, edad)
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }
}

class Heroe extends Persona{   
    constructor(id, nombre, apellido, edad, alterego, ciudad,publicado)
    {
        super(id, nombre, apellido, edad);
        if(alterego != null && ciudad != null && publicado > 1940)
        {
            this.alterego = alterego;
            this.ciudad = ciudad;
            this.publicado = publicado;
        }             
    }
}

class Villano extends Persona{   
    constructor(id, nombre, apellido, edad, enemigo,robos,asesinatos)
    {
        super(id, nombre, apellido, edad);
        if(enemigo != null && robos > 0 && asesinatos>0)
        {
            this.enemigo = enemigo;    
            this.robos = robos;    
            this.asesinatos = asesinatos;    
        }               
    }
}

//Validadciones
function isNull(value) { 
    return value == null;
};

function isNullOrEmpty(value) {
    return isNull(value) || value === "";
};

function isNumeric(value) {
    return !isNull(value) && !isNaN(value) && !isNaN(parseFloat(value))
};



 //LOGICA DE CLASE

function armarLista()
{
    stringJson.forEach (persona => {

        if(persona.ciudad !== undefined)
        {
            let ciudadano = new Heroe(persona.id, persona.nombre, persona.apellido, persona.edad, 
                            persona.alterego, persona.ciudad, persona.publicado);        
            listaPersonas.push(ciudadano);
        }
        else
        {            
            let extranjero = new Villano (persona.id, persona.nombre, persona.apellido, persona.edad,
                             persona.enemigo, persona.robos, persona.asesinatos);        
            listaPersonas.push(extranjero);
        }
    });
}

function altaApi(nuevaPersona) { ////LISTA  XML
    
    //mostrarSpinner();    
    const xhr = new XMLHttpRequest();
    let respuesta;
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
           // ocultarSpinner();

            if (xhr.status === 200) {
                
                try {
                    respuesta = JSON.parse(xhr.response);
                } catch (error) {
                    console.error('Error parsing JSON response:', error);
                    return;
                }

                nuevaPersona.id = respuesta["id"];
                listaPersonas.push(nuevaPersona);

                

                crearTabla(listaPersonas, tabla);

                formAbm.style.display = "none";
                formDatos.style.display = "";
                limpiarCampos();
            } 
            else {
                
                console.log(`Error ${xhr.status} - ${xhr.statusText}`);
            }
        }
    };

    xhr.open('GET', 'https://examenesutn.vercel.app/api/PersonasHeroesVillanos', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    var datos = JSON.stringify(nuevaPersona);
   // console.log(datos);
    xhr.send(datos);
}

function traerListadoFetch()/// OK ---------- fetch - no async
{    
    //mostrarSpinner();
    fetch ('https://examenesutn.vercel.app/api/PersonasHeroesVillanos')
    .then((response) => {

        if (response.ok) 
        {         
            return response.json();            
        } 
        else 
        {            
            throw new Error('Error al realizar el alta');        
        }
    })
    .then((data) => { 
        stringJson = data;
        armarLista();
        crearTabla(listaPersonas, tabla);        
     //   ocultarSpinner();
    })
    .catch((error) => {
        console.error(error);
        
       //ocultarSpinner(); // Asegurar que el spinner se oculte tambien en caso de error
    });
}

async function modificarElementoApi(personaModificada) /// OK ----------
{
   // mostrarSpinner();
    try
    {
        
        const response = await fetch('https://examenesutn.vercel.app/api/PersonasHeroesVillanos',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify(personaModificada),
        });
        if(response.ok)
        {
            for(let i =0; i <listaPersonas.length; i++ )
            {
                if (listaPersonas [i].id == personaModificada.id)
                {
                    listaPersonas[i] = personaModificada;
                    break;   
                }
            }
            formAbm.style.display ="none";
            formDatos.style ="";
            crearTabla(listaPersonas,tabla);
            limpiarCampos();
        }
        else
        {
            throw new Error('Error al realizar la modificacion ');
        }
    }
    catch (error)
    {
        alert('Surgio un problema. ' + error);
    }
    finally {
      //  ocultarSpinner(); // Ocultar el spinner al finalizar la solicitud, independientemente del resultado
    }
}

function limpiarCampos() /// OK ----------
{
    document.getElementById("textId").value = "";
    document.getElementById("textNombre").value = "";
    document.getElementById("textApellido").value = "";
    document.getElementById("textFechaDeNacimiento").value = "";
    document.getElementById("textDni").value = "";
    document.getElementById("textCiudad").value = "";
    document.getElementById("texPublicado").value = "";
    document.getElementById("textPaisDeOrigen").value = "";
    document.getElementById("textRobos").value = "";
    document.getElementById("textAsesinatos").value = "";    
    
}

// Llenar campos del ABM con el objeto
function llenarCampos(persona){/// OK ----------

    document.getElementById("textId").value = persona.id;
    document.getElementById("textNombre").value = persona.nombre;
    document.getElementById("textApellido").value = persona.apellido;
    document.getElementById("textFechaDeNacimiento").value = persona.edad;

    switch(document.getElementById("selABM").value)
    {
        case "Ciudadano":
            document.getElementById("textDni").value = persona.alterego;      
            document.getElementById("textCiudad").value = persona.ciudad;                       
            document.getElementById("textPublicado").value = persona.publicado;                       

            break;

        case "Extranjero":
            document.getElementById("textPaisDeOrigen").value = persona.enemigo;  
            document.getElementById("textRobos").value = persona.robos;          
            document.getElementById("textAsesinatos").value = persona.asesinatos;          

            break;
    }
}

function asignarEventoBotonModificar()/// OK ----------
{
    let personaAbm;
    let selectAbm = document.getElementById("selABM");
    let botones = [...document.getElementsByClassName("botonesModificar")];
    
    botones.forEach(boton => {

        boton.addEventListener("click", ()=>{

            listaPersonas.forEach( persona =>{

                if(persona.id == boton.id)
                {
                    personaAbm = persona;
                }
            });

            formAbm.style.display = "";
            formDatos.style.display = "none";

            document.getElementById("btnModificar").style.display = "";
            document.getElementById("btnAlta").style.display = "none";

            selectAbm.disabled = true;
            if(personaAbm instanceof Heroe)
            {
                selectAbm.value = "Ciudadano";
                document.getElementById("camposCiudadano").style.display = "";
                document.getElementById("camposExtranjero").style.display = "none";
            }
            else
            {
                selectAbm.value = "Extranjero";
                document.getElementById("camposCiudadano").style.display = "none";
                document.getElementById("camposExtranjero").style.display = "";
            }

            llenarCampos(personaAbm);
        })
    });
} 


function asignarEventoBotonEliminar () //**********VER
{
    let botones = [... document.getElementsByClassName("botonesEliminar")];
   
    botones.forEach( boton =>{

        boton.addEventListener("click", ()=>{
        
            let nuevaLista = listaPersonas.filter(persona =>persona.id !== parseInt((boton.id)));

            listaPersonas = nuevaLista;

            crearTabla(listaPersonas,tabla);

            limpiarCampos();
        }); 
    });
}



function crearTabla(lista, tabla) //OK --------------------------------------------------
{    
    tbody = document.getElementById("cuerpo_tabla");
   
    if(!(tbody !== null))
    {
        tbody = tabla.createTBody();
        tbody.id = "cuerpo_tabla";
    }

    tbody.innerHTML = "";

    lista.forEach(persona => {

        let row = tbody.insertRow();
        let values = [persona.id, persona.nombre, persona.apellido, persona.edad];

        let botonModificar = document.createElement("button");
        let botonEliminar = document.createElement("button");
        botonModificar.innerHTML = "Modificar";
        botonEliminar.innerHTML = "Eliminar";
        botonModificar.classList.add("botonesModificar");
        botonEliminar.classList.add("botonesEliminar");
        botonModificar.setAttribute("id", persona.id);
        botonEliminar.setAttribute("id", persona.id);

        if (persona instanceof Heroe)
        {
            values.push(persona.alterego, persona.ciudad, persona.publicado, "N/A","N/A","N/A", botonModificar, botonEliminar);
        }
        else if (persona instanceof Villano)
        {
            values.push("N/A","N/A","N/A", persona.enemigo, persona.robos ,persona.easesinatos, botonModificar, botonEliminar);
        }
       
        values.forEach(value => {
            let cell = row.insertCell();
            if(!(value == botonEliminar || value == botonModificar))
            {
                let text = document.createTextNode(value);
                cell.appendChild(text);
                
            }else{
                cell.appendChild(value);
            }              
        });
       
        let botonesEliminar = document.getElementsByClassName("botonesEliminar");
        let botonesModificar = document.getElementsByClassName("botonesModificar");                       
    });

    asignarEventoBotonModificar();
    asignarEventoBotonEliminar(); 
};


//Validadciones  
function ValidarDatosAbm(){//OK --------------------------------------------------
    if (isNullOrEmpty(document.getElementById("textNombre").value)) {
        alert("Debe indicar un nombre");
        return false;
    }
    if (isNullOrEmpty(document.getElementById("textApellido").value)) {
        alert("Debe indicar un apellido");
        return false;
    }
    if (!isNumeric(document.getElementById("textFechaDeNacimiento").value)) {
        alert("Debe indicar un valor de fechaNacimiento numerico");
        return false;
    }
    if (parseInt(document.getElementById("textFechaDeNacimiento").value) <= 0) {
        alert("Debe indicar una edad mayor a 0");
        return false;
    }

    switch (document.getElementById("selABM").value) {
        case "Ciudadano":

            if (isNullOrEmpty(document.getElementById("textDni").value)) {
                alert("Debe indicar un alterego");
                return false;
            }
            if (isNullOrEmpty(document.getElementById("textCiudad").value)) {
                alert("Debe indicar una Ciudad");
                return false;
            }
             if (!isNumeric(document.getElementById("textPublicado").value)) {
                alert("Debe indicar un valor numerico para publicado");
                return false;
            }
            if (parseInt(document.getElementById("textPublicado").value) < 1940) {
                alert("Debe indicar un valor mayor a 1940");
                return false;
            }

        break;

        case "Extranjero":

            if (isNullOrEmpty(document.getElementById("textPaisDeOrigen").value)) {
                alert("Debe indicar un enemigo");
                return false;
            }
            if (!isNumeric(document.getElementById("textRobos").value)) {
                alert("Debe indicar un valor numerico para robos");
                return false;
            }
            if (parseInt(document.getElementById("textRobos").value) < 0) {
                alert("Debe indicar un valor mayor o igual a 0 ara robos");
                return false;
            }
            if (!isNumeric(document.getElementById("textAsesinatos").value)) {
                alert("Debe indicar un valor numerico para asesinatos");
                return false;
            }
            if (parseInt(document.getElementById("textAsesinatos").value) < 0) {
                alert("Debe indicar un valor mayor o igual a 0 para asesinatos");
                return false;
            }


        break;
    }
    return true;        
}
               


//EVENTOS
window.addEventListener('load', ()=>{ //VER -----------------------------------

    tabla = document.getElementById("tabla");
    formDatos = document.getElementById("formDatos");
    formAbm = document.getElementById("formAbm");
  
    formAbm.style.display = "none";
    
    traerListadoFetch();
    
    crearTabla(listaPersonas, tabla);
    
    let btnAgregar = document.getElementById("btnAgregar");
    btnAgregar.addEventListener('click',()=>
    {
        formDatos.style.display = "none";
        formAbm.style.display = "";

       // document.getElementById("btnEliminar").style.display = "none";
        document.getElementById("btnModificar").style.display = "none";
        document.getElementById("btnAlta").style.display = "";

        if(document.getElementById("selABM").value == "Ciudadano")
        {
            document.getElementById("camposExtranjero").style.display = "none";
            document.getElementById("camposCiudadano").style.display = "";
        }
        else
        {
            document.getElementById("camposExtranjero").style.display = "";
            document.getElementById("camposCiudadano").style.display = "none";
        }
    });
    
    //Boton Cancelar
    let btnCancelar = document.getElementById("btnCancelar");
    btnCancelar.addEventListener('click', () =>
    {
        formAbm.style.display = "none";
        formDatos.style.display = "";

        selectAbm.disabled = false;
        limpiarCampos();
    });


    let selectAbm = document.getElementById("selABM");
    selectAbm.addEventListener('change',()=>
    {
        switch(selectAbm.value)
        {
            case "Ciudadano":
                document.getElementById("camposExtranjero").style.display = "none";
                document.getElementById("camposCiudadano").style.display = "";
                break;

            case "Extranjero":
                document.getElementById("camposExtranjero").style.display = "";
                document.getElementById("camposCiudadano").style.display = "none";
                break;
        }
    });

    //Boton Alta
    let btnAlta = document.getElementById("btnAlta");
    btnAlta.addEventListener('click', () =>{
        
      /**************************************************************///mostrarSpinner();        
    
      if(ValidarDatosAbm()){


            switch(selectAbm.value)
            {
                case "Ciudadano":
                    let nuevoCiudadano = new Heroe(null,                         
                        document.getElementById("textNombre").value, 
                        document.getElementById("textApellido").value,
                        document.getElementById("textFechaDeNacimiento").value,
                        
                        document.getElementById("textDni").value,  
                        document.getElementById("textCiudad").value,  
                        document.getElementById("textPublicado").value);  
                        
                        

                       console.log(nuevoCiudadano);
                       altaApi(nuevoCiudadano);
                       
                        /**************************************************************///ocultarSpinner();
                break;

                case "Extranjero":
                    let nuevoExtranjero = new Villano(null, 
                        document.getElementById("textNombre").value, 
                        document.getElementById("textApellido").value,
                        document.getElementById("textFechaDeNacimiento").value,

                        document.getElementById("textPaisDeOrigen").value,  
                        document.getElementById("textRobos").value,       
                        document.getElementById("textAsesinatos").value);       

                          
               
                        altaApi(nuevoExtranjero);
                        
                        /**************************************************************///ocultarSpinner();
                break;
            }
        }
    });

    //Boton Modificar
    let btnModificar = document.getElementById("btnModificar");
    btnModificar.addEventListener('click', () =>
    {
        /**************************************************************/ //mostrarSpinner();
        let personaModificada;
        if(ValidarDatosAbm())
        {   
            if(document.getElementById("selABM").value == "Ciudadano")
            {
                personaModificada = new Heroe(
                    document.getElementById("textId").value,
                    document.getElementById("textNombre").value,
                    document.getElementById("textApellido").value,
                    document.getElementById("textFechaDeNacimiento").value,

                    document.getElementById("textDni").value,
                    document.getElementById("textCiudad").value,
                    document.getElementById("textPublicado").value);
                
            }
            else
            {
                personaModificada = new Villano(
                    document.getElementById("textId").value,
                    document.getElementById("textNombre").value,
                    document.getElementById("textApellido").value,
                    document.getElementById("textFechaDeNacimiento").value,

                    document.getElementById("textPaisDeOrigen").value,                                    
                    document.getElementById("textRobos").value,                
                    document.getElementById("textAsesinatos").value);                
            }
            modificarElementoApi(personaModificada);
            
            console.log(personaModificada);
        }
    });
        

    function mostrarSpinner() {
        gifBack.style.display = "flex";
    }
    
    function ocultarSpinner() {
        gifBack.style.display = "none";
    }

});
 
        