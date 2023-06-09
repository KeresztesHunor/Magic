class Card
{
    static COLORS = {
        0: "red",
        1: "green",
        2: "blue"
    };

    #color;
    #number;

    constructor(color, number)
    {
        this.#color = color;
        this.#number = number;
    }

    get color()
    {
        return this.#color;
    }

    get number()
    {
        return this.#number;
    }
}

export default Card;