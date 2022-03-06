let events = [];
let todayEl = $("#currentDay").text(moment().format("dddd, MMMM Do"));

for (let i = 9; i <= 17; i++) {
  let hourEl = $("<div>").addClass("col-md-1 hour")

  if (i < 12) {
    hourEl.text(i + "AM");
  }
  else if (i === 12) {
    hourEl.text(i + "PM");
  }
  else if (i > 12) {
    hourEl.text((i-12) + "PM");
  }
  
  let textEl = $("<textarea>").addClass("col-md-10 description")
  let saveEl = $("<button>")
    .addClass("btn col-md-1 saveBtn")
    .html('<i class="fa-solid fa-floppy-disk"></i>');
  let hourRowEl = $("#hour-" + i);
  hourRowEl.append(hourEl, textEl, saveEl);
}

let loadEvents = function() {
  let events = JSON.parse(localStorage.getItem("events"));
  if (!events) {
    events = [];
    return false;
  }

  // get hour value from each object in events array
  // match hour value from events array (storage) to time-block row
  // append text value to textarea inside correct time-block row 
}

let saveEvents = function() {
  localStorage.setItem("events", JSON.stringify(events));
}

let clearNotify = function() {
  setTimeout(function() {
    $("#notify").hide();
  }, 2000);
}

$(".time-block").on("click", "button", function() {
  let text = $(this)
    .prev("textarea")
    .val();

  let hourRow = $(this)
    .closest(".time-block")
    .attr("id")
    .replace("hour-", "");

  tempArr = {
    hour: hourRow,
    text: text
  };
  
  events.push(tempArr);
  
  saveEvents();

  let notifyContainer = $("#notify");
  
  let saveNotify = $("<p>")
    .html("Appointment Added to <span class='red-text'>localStorage </span><i class='fa-solid fa-check'></i>");
  
  notifyContainer.append(saveNotify);
  clearNotify();
})

let checkTime = function(timeEl) {
  // get time from hour element
  let time = $(timeEl).find("div").text().trim();

  // convert to moment time
  time = moment(time, "LT").set("minute", 0);

  // add a moment time to check current hour
  let withinHour = moment(time, "LT").add(59, "minutes").add(59, "seconds");
  
  // remove any old classes from element
  $(timeEl).removeClass("present future");

  // apply new class if task is near/over due date
  if (moment().isBetween(time, withinHour)) {
    $(timeEl).addClass("present");
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
}, (1000 *60) * 2);

loadEvents();