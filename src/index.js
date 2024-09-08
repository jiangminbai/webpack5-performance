// import React from "react";
import { createRoot } from "react-dom/client";
import App from './App.js'
import _ from 'lodash'
import $ from 'jquery'
import moment from 'moment';

console.log(_.join(["a", "b", "c"], "-"));
console.log($)
moment.locale("zh-cn");
let time = moment().endOf("day").fromNow();
console.log(time);

const root = createRoot(document.getElementById('root'))
root.render(<App />)