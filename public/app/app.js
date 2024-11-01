// app/app.js
import { log, timeoutPromise, retry } from "./utils/promise-helpers.js";
import "./utils/array-helpers.js";
import { notasService as service } from "./nota/service.js";
import { tankeUtil, debounceTime, pipe, partialize } from "./utils/operators.js";
import { EventEmitter } from './utils/event-emitter.js';


// const operation = tankeUtil(3, ()=>
//      service
//     .sumItems('2143')
//     .then(console.log)
//         .catch(console.log)
// );

// Testes de Promisses
/*
const p1 = new Promise((resolve, reject) =>
    setTimeout(() => resolve('Promisse 1 terminou'), 300));
const p2 = new Promise((resolve, reject) =>
    setTimeout(() => resolve('Promisse 2 terminou'), 1000));

Promise.race([p1, p2]).then(console.log).catch(console.log);
*/


const operations = pipe(
    partialize(tankeUtil, 3),
    partialize(debounceTime, 500)
);

const action = operations(
    () => retry(3, 3000, () => timeoutPromise(200, service.sumItems("2143"))
        .then(total => EventEmitter.emit('itensTotalizados', total))
        .catch(console.log)
));

document.querySelector("#myButton").onclick = action;

EventEmitter.on('itensTotalizados', console.log);
EventEmitter.on('itensTotalizados', console.log);
