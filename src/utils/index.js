export const delay = delayMilliseconds =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("resolved");
      resolve("something");
    }, delayMilliseconds);
    setTimeout(() => {
      reject("noooo :(");
    }, delayMilliseconds * 2 + 1000);
  });
