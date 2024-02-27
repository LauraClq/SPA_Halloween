class Personaje
{
    constructor(id, nombre, tipo)
    {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
    }
}

export class Monstruo extends Personaje
{
    constructor (id, nombre, tipo, alias, defensa, miedo)
    {
        super(id,nombre,tipo);

        this.alias = alias;
        this.defensa = defensa;
        this.miedo = miedo;
    }
}