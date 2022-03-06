let events = {};
let todayEl = $("#currentDay").text(moment().format("dddd, MMMM Do"));

for (let i = 9; i <= 17; i++) {
  let hourEl = $("<div>").addClass("col-1 hour")

  if (i < 12) {
    hourEl.text(i + "AM");
  }
  else if (i === 12) {
    hourEl.text(i + "PM");
  }
  else if (i > 12) {
    hourEl.text((i-12) + "PM");
  }
  
  let textEl = $("<textarea>").addClass("col-10 text-area")
  let saveEl = $("<button>")
    .addClass("col-1 saveBtn")
    .html('<i class="fa-solid fa-floppy-disk"></i>');
  let hourRowEl = $("#hour-" + i);
  hourRowEl.append(hourEl, textEl, saveEl);
}

let saveEvents = function() {
  localStorage.setItem("events", JSON.stringify(events));
}

$(".time-block").on("click", "button", function() {
  let text = $(this)
    .prev("textarea")
    .val();

  let hourRow = $(this)
    .closest(".time-block")
    .attr("id")
    .replace("#", "");

  events = {
    hour: hourRow,
    text: text
  };

  saveEvents();
})

let checkTime = function(timeEl) {
  // get time from hour element
  let time = $(timeEl).find("div").text().trim();

  // convert to moment time
  time = moment(time, "LT").set("minute", 0);

  // add a moment time to check current hour
  let withinHour = moment(time, "LT").add(59, "minutes").add(59, "seconds");
  
  // remove any old classes from element
  $(timeEl).removeClass("past present future");

  // apply new class if task is near/over due date
  if (moment().isBetween(time, withinHour)) {
    $(timeEl).addClass("present");
  }
  else if (moment().isAfter(time)) {
    $(timeEl).addClass("past");
  }
  else if (moment().isBefore(time)) {
    $(timeEl).addClass("future");
  }
};

setTimeout(function() {
  $(".time-block").each(function(index, el) {
    checkTime(el);
  });
}, 1);

setInterval(function() {
  $(".time-block").each(function(index, el) {
    checkTime(el);
  });
}, (1000 *60) * 3);
