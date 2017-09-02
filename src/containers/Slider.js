import React, { Component } from "react";
import PropTypes from "prop-types";
import { kea } from "kea";
import { take, race, put } from "redux-saga/effects";

// import images from "./images"; // array of objects [{ src, author }, ...]
// import range from "~/utils/range"; // helper, range(3) === [0, 1, 2]

const delay = delayMilliseconds =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("resolved");
      resolve("something");
    }, delayMilliseconds);
    setTimeout(reject, delayMilliseconds * 2 + 1000);
  });

const range = intParam =>
  new Array(intParam).fill(0).map((val, index) => index);

const images = [
  { src: "https://kea.js.org/278689e0ed22536cefa31c0ad4ef72bd.jpg" },
  { src: "https://kea.js.org/a63cfb870de9e2d5a64f396ede8c30b0.jpg" },
  { src: "https://kea.js.org/f3950cfdf9b297de16cb49e4405ee0d3.jpg" }
];

@kea({
  actions: () => ({
    updateSlide: index => ({ index })
  }),

  reducers: ({ actions }) => ({
    currentSlide: [
      0,
      PropTypes.number,
      {
        [actions.updateSlide]: (state, payload) => payload.index % images.length
      }
    ]
  }),

  selectors: ({ selectors }) => ({
    currentImage: [
      () => [selectors.currentSlide],
      currentSlide => images[currentSlide],
      PropTypes.object
    ]
  }),

  start: function*() {
    const { updateSlide } = this.actions;

    while (true) {
      const { timeout } = yield race({
        change: take(updateSlide.toString()),
        timeout: delay(5000)
      });

      if (timeout) {
        const currentSlide = yield this.get("currentSlide");
        console.log(currentSlide);
        yield put(updateSlide(currentSlide + 1));
      }
    }
  },
  stop: function() {
    console.log("Stopping homepage slider saga");
  }
})
export default class Slider extends Component {
  render() {
    const { currentSlide, currentImage } = this.props;
    const { updateSlide } = this.actions;

    const title = `Image copyright by ME!`;

    return (
      <div className="kea-slider">
        <img src={currentImage.src} alt={title} title={title} />
        <div className="buttons">
          {range(images.length).map(i =>
            <button
              key={i}
              className={i === currentSlide ? "selected" : ""}
              onClick={() => updateSlide(i)}
            />
          )}
        </div>
      </div>
    );
  }
}
