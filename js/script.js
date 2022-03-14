// Estado de nuestra APP. Fila y columna de donde "toca" escribir la siguiente letra
let row = 0;
let column = 0;
let secretWord = getNextWord();
let guessedWord = "";

function writeLetter(row, column, letter) {
    // 1. Obtener todas las celdas disponibles
    let cells = document.querySelectorAll(".game--cell");

    // querySelectorArray --> array de celdas
    // 2. Las celdas son nodos HTML. Debemos actualizar la propiedad textContent del nodo correspondiente a la fila y columna que nos pasan en la función

    // calculo la posición del nodoHTML en el array en función de la fila y la columna
    let position = row * 5 + column;

    cells[position].textContent = letter;
}

// Añadir un listener a todo el body, cada vez que dejamos ir una tecla aparezca por consola

document.body.addEventListener("keyup", handleInput);

function handleInput(event) {

    // En el objeto event, tenemos la propiedad 'key', que nos va a informar de qué tecla ha pulsado el usuario
    let keyPressed = event.key;

    console.log(event.keyCode);

    // Si la tecla pulsada es backspace, ver si podemos borrar la última letra. En tal caso, hacerlo
    if (event.key == "Backspace" && column != 0) {
        // 0. Eliminar el textContent de la posición actual
        // utilizar la función writeLetter para poner un espacio en blanco en el row y column actual

        column--;

        writeLetter(row, column, '');

        // 2. eliminar el último carácter 'guessedWord'
        // slice o substring

        guessedWord = guessedWord.slice(0, -1);

        return
    }

    // Si la tecla esta fuera del rango de las letras de la [a...z]; acabamos inmediatamente la función 

    if (event.keyCode < 65 || event.keyCode > 90) {
        return;
    }

    // 1. Invocar la función writeLetter para escribir la 'keyPressed' en la 'row' y 'column' que tocan
    writeLetter(row, column, keyPressed);
    guessedWord += keyPressed; // guessedWord = guessedWord + keyPressed

    // 2. Actualizar el estado de nuestra APP
    // 2.1 Incrementar en 1; la variable 'column'
    column++;
    // 2.2 Si hemos llegado a column ==5 --> comprobar la palabra secreta --> hacer un console.log("Comprobar palabra secreta"). Debemos actualizar column = 0; e incrementar en 1 la variable 'row' (cambiamos de fila)


    if (column == 5) {
        console.log(`Comparar ${secretWord} con ${guessedWord}`);

        checkRow(row)

        if (checkGameWon()) {
            document.querySelector(".victory").style.display = "block";
            document.body.removeEventListener("keyup", handleInput);
            return;
        }

        row++;

        if (checkGameLoose()) {
            // hemos perdido
            // mostrar el mensaje de derrota
            document.querySelector(".defeat").style.display = "block";
            document.body.removeEventListener("keyup", handleInput);
            return;
        }

        column = 0;
        guessedWord = "";
    }
}

function checkRow(row) {
    // 1. Utilizar rightOrder para obtener el array de puntaciones de letras
    let cells = document.querySelectorAll(".game--cell");

    // let position = row * 5 + column;

    let scoreLetters = rightOrder(secretWord, guessedWord);

    scoreLetters.forEach((score, index) => {
        let position = row * 5 + index;

        switch (score) { // -1, 0, 1
            case -1:
                cells[position].classList.add("cell__wrong");
                break;
            case 0:
                cells[position].classList.add("cell__anotherposition");
                break;
            case 1:
                cells[position].classList.add("cell__correct");
                break;
        }

    });

}

function rightOrder(palabraSecreta, palabraIntroducida) {
    // array para guardar resultados
    let resultados = [];
    // for para comprobar cada carácter del string introducido
    for (let i = 0; i < palabraIntroducida.length; i++) {
        // comprobamos si se encuentra el mismo carácter en la palabra secreta 
        if (palabraIntroducida[i] == palabraSecreta[i]) {
            resultados.push(1);
            //comprobamos si la palabra secreta contiene el carácter sin importar la posición
        } else if (palabraSecreta.includes(palabraIntroducida[i])) {
            resultados.push(0);
            //no contiene el carácter asi que lo valoramos con -1
        } else {
            resultados.push(-1);
        }
    }//devolvemos array con los datos
    return resultados;
}

// Devuelve TRUE si hemos acertado la palabra secreta
function checkGameWon() {
    return guessedWord == secretWord;
}

// Devuelve TRUE si hemos agotado todos los intentos
function checkGameLoose() {
    // si estamos en la fila 6, hemos perdido
    return row == 6;
}



