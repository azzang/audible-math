import { scaleLinear, scalePoint } from "d3-scale";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import throttle from "lodash.throttle";
import { scales, intervals } from "./data";
import "./index.css";

const widthSVG = innerWidth * 0.9;
const heightSVG = innerHeight * 0.7;
const svg = select("svg").attr("width", widthSVG).attr("height", heightSVG);

const marginLeft = heightSVG / 12;
const widthScales = widthSVG - marginLeft;
const noteWidth = widthScales / scales.length;
const getNoteX = scaleLinear()
  .domain([0, scales.length])
  .range([0, widthScales]);
const getNoteY = scaleLinear().domain([-1, 11]).range([heightSVG, 0]);
const getIntervalY = scalePoint()
  .domain(intervals)
  .range([(heightSVG * 23) / 24, heightSVG / 24]);

const scaleContainer = svg
  .select("svg > g")
  .attr("transform", `translate(${marginLeft}, 0)`);

const audioContext = new AudioContext();
const gainNode = audioContext.createGain();

gainNode.connect(audioContext.destination);
gainNode.gain.value = 0.08;

select("h1")
  .style("left", `${widthSVG * 0.05556}px`)
  .style("font-size", `${marginLeft / 1.6}px`)
  .style("margin-top", `${marginLeft}px`)
  .style("margin-bottom", `${marginLeft / 1.6}px`);

svg
  .selectAll("text")
  .data(intervals)
  .enter()
  .append("text")
  .text((interval) => interval)
  .attr("x", marginLeft / 2)
  .attr("y", (interval) => getIntervalY(interval))
  .attr("id", (interval) => interval)
  .style("font-size", `${marginLeft / 4}px`)
  .on("click", filterScales);

svg.select("#clip > rect").attr("width", widthScales).attr("height", heightSVG);

function plotScales(scales) {
  scaleContainer
    .append("g")
    .attr("id", "scales")
    .call(zoom().scaleExtent([1, 25]).on("zoom", throttle(handleZoom, 250)))
    .selectAll("g")
    .data(scales)
    .enter()
    .append("g")
    .on("mouseover", toggleMissingIntervals)
    .on("mouseout", toggleMissingIntervals)
    .on("click", throttle(playScale, 2000))
    .each(function (_, j) {
      select(this)
        .selectAll("rect")
        .data((scale) => scale.toString(2))
        .join("rect")
        .attr("x", () => getNoteX(j))
        .attr("y", (_, i) => getNoteY(i))
        .attr("width", noteWidth)
        .attr("height", marginLeft)
        .attr("fill", (note) => (note === "0" ? "white" : "black"));
    });
}

function filterScales() {
  const interval = select(this);
  if (interval.data() !== "P1") {
    interval.classed("include", !interval.classed("include"));
    const include = svg
      .selectAll(".include")
      .data()
      .map((interval) => 1 << (11 - intervals.indexOf(interval)))
      .reduce((last, current) => last + current, 0);
    select("#scales").remove();
    plotScales(scales.filter((scale) => (scale & include) == include));
  }
}

function handleZoom({ transform: { k: s, x } }) {
  select(this).attr(
    "transform",
    `translate(
      ${Math.min(0, Math.max(widthScales * (1 - s), x))}
      , 0) scale(${s}, 1)`
  );
}

function toggleMissingIntervals() {
  const scale = select(this).selectAll("rect").data();
  const selector = intervals
    .filter((_, i) => scale[i] === "0")
    .map((interval) => `#${interval}`)
    .join();
  if (selector) {
    const missingIntervals = svg.selectAll(selector);
    const areWhite = missingIntervals.attr("fill") === "white";
    missingIntervals.attr("fill", areWhite ? "black" : "white");
  }
}

function playNote(delay, interval, duration) {
  const oscillator = audioContext.createOscillator();
  oscillator.connect(gainNode);
  oscillator.type = "square";
  oscillator.frequency.value = 110;
  oscillator.detune.value = 100 * interval;
  const startTime = audioContext.currentTime + delay;
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function playScale() {
  const scale = select(this).selectAll("rect").data();
  const scaleIntervals = intervals
    .filter((_, i) => scale[i] === "1")
    .map((interval) => intervals.indexOf(interval));
  let delay = 0;
  let currentIndex = scaleIntervals.length;
  let randomIndex;
  let temp;
  let duration;
  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    duration = Math.random() < 2 / 3 ? 0.18 : 0.36;
    playNote(delay, scaleIntervals[randomIndex], duration);
    delay += duration;
    currentIndex--;
    temp = scaleIntervals[currentIndex];
    scaleIntervals[currentIndex] = scaleIntervals[randomIndex];
    scaleIntervals[randomIndex] = temp;
  }
}

plotScales(scales);
