import {createCar, deleteCar, drive, getCarsAll, startEngine, stopEngine, updateCar} from "./api";
import {RenderCarImage} from "./ui";
import './styles/styles.css'

let ArrayOfCars : {name: string, color: string, id: number }[];
let idofcar: string;
let clearTimer: boolean = true;
let RaceAllCarsBlock: boolean = true;
let afterDrive: boolean = false;
const createCarWrapper: HTMLDivElement = document.createElement('div');
const selectCarWrapper: HTMLDivElement = document.createElement('div');
const addCarInput: HTMLInputElement = document.createElement('input');
const addCarInputColor: HTMLInputElement = document.createElement('input');
const addCarInputButton: HTMLInputElement = document.createElement('input');
const countCars: HTMLSpanElement = document.createElement('span');
const raceAllCars: HTMLButtonElement = document.createElement('button');
const selectCarInput: HTMLInputElement = document.createElement('input');
const selectCarInputColor: HTMLInputElement = document.createElement('input');
const selectCarInputButton: HTMLInputElement = document.createElement('input');
const resetAllCarsButton: HTMLButtonElement = document.createElement('button');
resetAllCarsButton.classList.add('resetAllCarsButton');


raceAllCars.classList.add('raceAllCars')
createCarWrapper.classList.add('createCarWrapper');
selectCarWrapper.classList.add('selectCarWrapper');
addCarInput.type = 'text';
selectCarInput.type = 'text';
addCarInputColor.type = 'color';
selectCarInputColor.type = 'color';
addCarInputButton.type = 'button'
selectCarInputButton.type = 'button'
addCarInputButton.value = 'Create'
selectCarInputButton.value = 'Update'
addCarInputColor.value = '#069943'
addCarInputButton.innerHTML = 'submit'
addCarInputButton.classList.add('AddCarButton')
countCars.classList.add('countCars');
raceAllCars.innerHTML = 'Race';
resetAllCarsButton.innerHTML = 'Reset'
document.body.append(createCarWrapper);
document.body.append(selectCarWrapper);
createCarWrapper.append(addCarInput);
createCarWrapper.append(addCarInputColor);
createCarWrapper.append(addCarInputButton);
createCarWrapper.append(countCars);
createCarWrapper.append(raceAllCars);
createCarWrapper.append(resetAllCarsButton);
selectCarWrapper.append(selectCarInput);
selectCarWrapper.append(selectCarInputColor);
selectCarWrapper.append(selectCarInputButton)


getCarsAll().then(data => countCars.innerHTML = `Garage: (${data.items.length})`)


addCarInputButton.onclick = () => {

    if (document.querySelector('.invalid')) {
        if (addCarInput.value !== '') {
            addCarInput.classList.remove('invalid');
            document.querySelector('span').innerHTML = '';
        } else return;
    }
    if (addCarInput.value === '') {
        addCarInput.classList.add('invalid')
        const invalid = document.createElement('span');
        invalid.innerHTML = 'Name is required'
        document.body.prepend(invalid);
        return;

    }

    interface Car {
        name: string,
        color: string
    }

    const car: Car = {
        name: addCarInput.value,
        color: addCarInputColor.value,
    }

    if (ArrayOfCars.length === 0) {
        createCar(car).then(() => {
                Render(car.color, 1, car.name);

            }
        ).then(() => {
            getCarsAll().then(data => ArrayOfCars = data.items);
        }).then(() => getCarsAll().then(data => countCars.innerHTML = `Garage: (${data.items.length})`));

    } else {
        createCar(car).then(() => {
            if (ArrayOfCars[0].id === 1) Render(car.color, ArrayOfCars.length + 1, car.name);
            else Render(car.color, ArrayOfCars[ArrayOfCars.length - 1].id + 1, car.name)

        }).then(() => {
            getCarsAll().then(data => ArrayOfCars = data.items)
        }).then(() => getCarsAll().then(data => countCars.innerHTML = `Garage: (${data.items.length})`));


    }

}


getCarsAll().then(data => {
    ArrayOfCars = data.items
})
    .then(() => {
        for (let i = 0; i < ArrayOfCars.length; i++) {
            Render(ArrayOfCars[i].color, ArrayOfCars[i].id, ArrayOfCars[i].name)
        }
    });


const Render = (color: string, id: number, nameofcar: string) => {
    let raceButtonlock: boolean = true;
    let stopButtonlock: boolean = false;
    let timer;
    const car__wrapper: HTMLDivElement = document.createElement('div');
    const raceButton: HTMLButtonElement = document.createElement('button');
    const stopButton: HTMLButtonElement = document.createElement('button');
    const selectButton: HTMLButtonElement = document.createElement('button');
    raceButton.innerHTML = 'Race';
    stopButton.innerHTML = 'Stop';
    selectButton.innerHTML = 'Select';
    car__wrapper.append(raceButton);
    car__wrapper.append(stopButton);
    car__wrapper.append(selectButton);
    raceButton.classList.add('raceButton')
    selectButton.classList.add('selectButton')
    stopButton.classList.add('stopButtonLock')
    document.body.append(car__wrapper);
    car__wrapper.classList.add('car__wrapper');
    car__wrapper.id = `${id}`;
    car__wrapper.classList.add(`car${car__wrapper.id}`)
    const car = document.createElement('div');
    const name = document.createElement('span');
    name.classList.add('name');
    name.innerHTML = `${nameofcar}`
    car__wrapper.append(name);
    car.innerHTML = RenderCarImage(color);
    car.classList.add('car')
    car__wrapper.append(car);
    const deleteCarButton = document.createElement('button');
    deleteCarButton.classList.add('deleteCarButton')
    deleteCarButton.innerHTML = 'Delete car'
    car__wrapper.append(deleteCarButton);
    deleteCarButton.onclick = () => {
        deleteCar(id).then(() => getCarsAll().then(data => ArrayOfCars = data.items)).then(() => getCarsAll().then(data => document.querySelector('.countCars').innerHTML = `Garage: (${data.items.length})`));
        document.body.removeChild(car__wrapper);


    }
    raceButton.onclick = () => {
        if (RaceAllCarsBlock) {
            if (raceButtonlock) {
                RaceAllCarsBlock = false;

                raceButtonlock = false;
                raceButton.classList.add('raceButtonLock')
                raceAllCars.classList.add('raceButtonLock')


                startEngine(car__wrapper.id).then((data) => {
                    stopButton.classList.add('stopButton')
                    stopButtonlock = true;

                    let start: number = Date.now();
                    let interval: number = ((car__wrapper.offsetWidth - 300) / data.velocity) * 2000;
                    timer = setInterval(function () {
                        let timePassed = Date.now() - start;

                        car.style.left = 200 + (timePassed / 2000) * data.velocity + 'px';

                        if (timePassed > interval) clearInterval(timer);
                        RaceAllCarsBlock = true;
                    }, 8);

                    // car.style.left =  `${car__wrapper.offsetWidth - 100}px`;
                }).then(() => drive(car__wrapper.id)).then(data => {
                    if (data.success === false) {
                        clearInterval(timer);

                    }
                });
            }


        }


    }

    stopButton.onclick = () => {
        if (stopButtonlock) {
            stopButtonlock = false;
            stopButton.classList.remove('stopButton')

            stopEngine(car__wrapper.id).then(() => {
                clearInterval(timer);
                car.style.left = '200px'
                raceButton.classList.remove('raceButtonLock');
                raceButtonlock = true;
                raceAllCars.classList.remove('raceButtonLock')

            })
        }


    }

    selectButton.onclick = () => {
        idofcar = car__wrapper.id
        selectCarInput.value = name.innerHTML;
        selectCarInputColor.value = color;
    }


    selectCarInputButton.onclick = (event) => {
        updateCar(idofcar, {
            name: selectCarInput.value,
            color: selectCarInputColor.value
        });

        document.querySelector(`.car${idofcar} .car`).innerHTML = RenderCarImage(selectCarInputColor.value);
        document.querySelector(`.car${idofcar} .name`).innerHTML = selectCarInput.value;

    }

}

raceAllCars.onclick = () => {
    if (RaceAllCarsBlock) {
        RaceAllCarsBlock = false;
        raceAllCars.classList.add('raceButtonLock')
        let win = 100000;


        document.querySelectorAll(".raceButton").forEach((e) => {
            e.classList.add('raceButtonLock')
        })

        // @ts-ignore
        for (let i = 0; i < parseInt(countCars.innerHTML.match(/\d+/)); i++) {
            let timer;

            startEngine(document.querySelectorAll(".car__wrapper")[i].id).then((data) => {
                let carWrappers: NodeListOf<HTMLElement> = document.querySelectorAll(".car__wrapper");
                let start: number = Date.now();
                let interval: number = ((carWrappers[i].offsetWidth - 300) / data.velocity) * 2000;
                if (interval < win) win = interval

                timer = setInterval(function () {
                    let timePassed: number = Date.now() - start;

                    let cars: NodeListOf<HTMLElement> = document.querySelectorAll(".car");
                    cars[i].style.left = 200 + (timePassed / 2000) * data.velocity + 'px';

                    if (timePassed > interval || clearTimer === false) clearInterval(timer);
                }, 8);

            }).then(() => drive(document.querySelectorAll(".car__wrapper")[i].id)).then(data => {
                if (data.success === false) {
                    clearInterval(timer);
                }
                afterDrive = true;
                resetAllCarsButton.classList.add('resetAllCarsButtonActivate')
            }).then(() => {
            });

        }
    }


}


resetAllCarsButton.onclick = () => {
    resetAllCarsButton.classList.remove('resetAllCarsButtonActivate');

    if (afterDrive) {
        // @ts-ignore
        for (let i = 0; i < parseInt(countCars.innerHTML.match(/\d+/)); i++) {


            clearTimer = false;

            stopEngine(document.querySelectorAll(".car__wrapper")[i].id).then(() => {
                let cars: NodeListOf<HTMLElement> = document.querySelectorAll(".car");
                cars[i].style.left = '200px'
                RaceAllCarsBlock = true;
                clearTimer = true;
                afterDrive = false;
            }).then(() => {
                raceAllCars.classList.remove('raceButtonLock');
                document.querySelectorAll(".raceButton")[i].classList.remove('raceButtonLock')
                resetAllCarsButton.classList.remove('resetAllCarsButtonActivate');
                afterDrive = false;

            })
        }


    }

}
