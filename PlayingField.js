import Card from "./Card.js";

class PlayingField
{
    //int

    #guessesLeft;

    //bool

    #canSelect;

    //html element

    #cardGuessElement;
    #cardGuessElementText;
    #cardsElement;
    #cardElements;

    //list

    #deck = [];

    constructor()
    {
        this.#guessesLeft = 4;
        this.#canSelect = false;
        this.#cardGuessElement = $("#cardGuess");
        this.#cardGuessElementText = $("#cardGuess > p");
        this.#cardsElement = $("#cards");
        this.#initColumnSelectedEvent();
        this.#loadDeck();
        this.#scrambleDeck();
        this.#generateCards();
    }

    #initColumnSelectedEvent()
    {
        $("#selectionButtons > button").toArray().forEach((element, index) => $(element).on("click", () => window.dispatchEvent(new CustomEvent("columnSelected", { detail: { index: index } }))));
        $(window).on("columnSelected", event => {
            if (this.#canSelect)
            {
                if (this.#guessesLeft === 3)
                {
                    this.#cardGuessElement.removeClass();
                    this.#cardGuessElement.addClass("unknownCard");
                    this.#cardGuessElementText.html("?");
                }
                this.#canSelect = false;
                const COLUMNS = [[], [], []];
                this.#deck.forEach((element, index) => COLUMNS[index % 3].push(element));
                this.#deck = COLUMNS[(event.detail.index + 1) % 3].concat(COLUMNS[event.detail.index]).concat(COLUMNS[(event.detail.index + 2) % 3]);
                this.#generateCards();
            }
        });
    }

    #loadDeck()
    {
        for (let i = 0; i < 3; i++)
        {
            for (let j = 1; j <= 7; j++)
            {
                this.#deck.push(new Card(Card.COLORS[i], j));
            }
        }
    }

    #scrambleDeck()
    {
        for (let i = this.#deck.length - 1; i > 0; i--)
        {
            const R = Math.floor(Math.random() * i);
            [this.#deck[i], this.#deck[R]] = [this.#deck[R], this.#deck[i]];
        }
    }

    #generateCards()
    {
        this.#cardsElement.html("");
        for (let i = 0; i < this.#deck.length; i++)
        {
            this.#cardsElement.append(`
                <div class="white">
                    <p>${this.#deck[i].number}</p>
                </div>
            `);
        }
        this.#cardElements = $("#cards > div");
        this.#revealCards();
    }

    #revealCards(index = 0)
    {
        const CURRENT_CARD = $(this.#cardElements[index]);
        CURRENT_CARD.toggleClass("white");
        CURRENT_CARD.toggleClass(this.#deck[index].color);
        if (++index < this.#cardElements.length)
        {
            setTimeout(() => this.#revealCards(index), 50);
        }
        else
        {
            if (this.#guessesLeft-- === 1)
            {
                const CARD = this.#deck[Math.ceil(this.#deck.length / 2) - 1]
                this.#cardGuessElement.toggleClass(CARD.color);
                this.#cardGuessElementText.html(CARD.number);
                this.#guessesLeft = 3;
            }
            this.#canSelect = true;
        }
    }
}

export default PlayingField;
