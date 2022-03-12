let appts = [];

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

// create notification container to show when an appointment is saved
let notifyContainer = $("#notify");
let saveNotify = $("<p>")
  .html("Appointment Added to <span class='red-text'>localStorage </span><i class='fa-solid fa-check'></i>");
notifyContainer.append(saveNotify);
notifyContainer.hide();

// load appointments from localStorage
let loadEvents = function() {
  appts = JSON.parse(localStorage.getItem("appts"));
  if (!appts) {
    return false;
  }

  // get hour and text value from each object in appts array
  for (let i = 0; i < appts.length; i++) {
    let hour = appts[i].hour;
    let text = appts[i].text;

    // change text in textarea to stored value in corresponding time-block row
    $("#hour-" + hour)
      .find("textarea")
      .text(text);
  }
}

// save appointments
let saveEvents = function() {
  // save appointments to localStorage
  localStorage.setItem("appts", JSON.stringify(appts));

  // show notification of appointments being saved
  notifyContainer.show();
  clearNotify();
}

// hide notification of appointment saved after 2 seconds
let clearNotify = function() {
  setTimeout(function() {
    notifyContainer.hide();
  }, 2000);
}

// when save button is clicked, get text from textarea and corresponding hour to put into localStorage
$(".time-block").on("click", "button", function() {
  // get value of text from textarea
  let newText = $(this)
    .prev("textarea")
    .val()
    .trim();

  // get the hour/time from the time-block row id
  let hourRow = $(this)
    .closest(".time-block")
    .attr("id")
    .replace("hour-", "");

  // put text value in appropriate object property
  let tempObj = {
    hour: hourRow,
    text: newText
  };

  // get stored appointments to compare to new appt
  appts = JSON.parse(localStorage.getItem("appts"));
  // if no appointments saved, create empty array for appointments and add(push) new appt into it
  if (!appts) {
    appts = [];
    appts.push(tempObj);
    saveEvents();
  }
  // if appoinments exist in localStorage, 
  // find the index of the saved object whose hour value matches the hour of the new appt
  else {
    let index = appts.findIndex(function(appt) {
      return JSON.stringify(tempObj.hour) === JSON.stringify(appt.hour);
    });
    // if index is not found (if there is not a saved object with a matching hour value),
    //then check that there is a text input and if so, add the new appt to the appts array
    if (index === -1) {
      if (tempObj.text !== "") {
        appts.push(tempObj);
        saveEvents();
      }
    }
    // if the index is found (if there is a saved object with a matching hour value),
    // then check that the text is different and if so, replace the object at that index with the new object
    else {
      let text = appts[index].text;
      if (text !== newText) {
        appts[index] = tempObj;
        saveEvents();
      }
    }
  }
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