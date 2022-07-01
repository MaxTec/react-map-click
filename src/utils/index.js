export const waitForElementToDisplay = (selector, callback, checkFrequencyInMs, timeoutInMs) => {
  console.log(selector);
  var startTimeInMs = Date.now();
  (function loopSearch() {
    // console.log(document.querySelector("#" + selector));
    if (document.querySelector("#" + selector) != null) {
      callback();
      // const ele = document.querySelector("#" + selector);
      return;
    } else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
};
