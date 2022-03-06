let events = [];

// dispaly current day in the header
let todayEl = $("#currentDay").text(moment().format("dddd, MMMM Do"));

// create hour, textarea, and button columns within time-block rows
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

// load appointments from localStorage
let loadEvents = function() {
  let events = JSON.parse(localStorage.getItem("events"));
  if (!events) {
    events = [];
    //return false;
  }

  // get hour and text value from each object in events array
  for (let i = 0; i < events.length; i++) {
    let hour = events[i].hour;
    let text = events[i].text;

    // change text in textarea to stored value in corresponding time-block row
    $("#hour-" + hour)
      .find("textarea")
      .text(text);
  }
}

// save event appointments to local storage
let saveEvents = function() {
  localStorage.setItem("events", JSON.stringify(events));
}

// hide notification of appointment saved
let clearNotify = function() {
  setTimeout(function() {
    $("#notify").hide();
  }, 2000);
}

// when save button is clicked, get text from textarea and corresponding hour to put into localStorage
$(".time-block").on("click", "button", function() {
  // get value of text from textarea
  let text = $(this)
    .prev("textarea")
    .val();

  // get the hour/time from the time-block row id
  let hourRow = $(this)
    .closest(".time-block")
    .attr("id")
    .replace("hour-", "");

  // put values in temp object
  tempObj = {
    hour: hourRow,
    text: text
  };
  
  // add temp object to events array being saved to localStorage 
  events.push(tempObj);
  
  // save events
  saveEvents();
  
  // show then hide notification of appointments being saved
  let notifyContainer = $("#notify");
  
  let saveNotify = $("<p>")
    .html("Appointment Added to <span class='red-text'>localStorage </span><i class='fa-solid fa-check'></i>");
  
  notifyContainer.append(saveNotify);
  clearNotify();
})

// check time and compare to time-blocks, add classes to change color based on time
let checkTime = function(timeEl) {
  // get time from hour element
  let time = $(timeEl).find("div").text().trim();

  // convert to moment time
  time = moment(time, "LT").set("minute", 0);

  // add a moment time to check current hour
  let withinHour = moment(time, "LT").add(59, "minutes").add(59, "seconds");
  
  // remove any old classes from element
  $(timeEl).removeClass("present future");

  // apply new class if hour is current or in future
  if (moment().isBetween(time, withinHour)) {
    $(timeEl).addClass("present");
  }
  else if (moment().isBefore(time)) {
    $(timeEl).addClass("future");
  }
};

// check time when page loads
setTimeout(function() {
  $(".time-block").each(function(index, el) {
    checkTime(el);
  });
}, 1);

// check time every two minutes
setInterval(function() {
  $(".time-block").each(function(index, el) {
    checkTime(el);
  });
}, (1000 *60) * 2);

loadEvents();