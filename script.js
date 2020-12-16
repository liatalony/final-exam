window.addEventListener("DOMContentLoaded", init);
let currentTab = 0; // Current tab is set to be the first tab (0)
let petCount = 0;
function init() {
  console.log("Hello there...");
showTab(currentTab); // Display the current tab
addPetForm(petCount);
 let nextBtn = document.querySelector(".next"); 
 console.log(nextBtn);
 nextBtn.addEventListener("click", ()=>{
  nextPrev(1)
 });
 let backBtn = document.querySelector(".back"); 
 console.log(backBtn);
 backBtn.addEventListener("click", ()=>{
  nextPrev(-1)
 });

 let addPetBtn = document.querySelector(".link");
 addPetBtn.addEventListener("click", addPetForm);

 let pg1Types = document.querySelectorAll(".pg1-types input[type=checkbox]");
 console.log(pg1Types);
 pg1Types.forEach((type)=>{
type.addEventListener("input", filterServices)
 })
 let services = document.querySelectorAll(".service");
 services.forEach((e)=>{
  e.addEventListener("input", displayfields);
 })
 console.log(services);
 filterServices();
 displayfields();
}

function showTab(tab){
  let tabs = document.getElementsByClassName("part");
  tabs[tab].style.display ="block";
  if (tab==0) {
    document.querySelector(".back").classList.add("hidden");
  }else{
    document.querySelector(".back").classList.remove("hidden");
  }
}

function nextPrev(n){
  let tabs = document.getElementsByClassName("part");
  if (n == 1 && !validateForm()) return false;
  if (currentTab == 3) {
    showConfirmation();
  }
  tabs[currentTab].style.display = "none";
  currentTab = currentTab + n;
  if (currentTab >= tabs.length) {
//    document.getElementById("regForm").submit();
    return false;
  } else {
    // Otherwise, display the correct tab:
    showTab(currentTab);
  }
}

function validateForm(){
    // This function deals with validation of the form fields
    let valid = true;
    let tabs = document.getElementsByClassName("part");
    let inputs = tabs[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < inputs.length; i++) {
      // If a field is empty...
      if (inputs[i].value == "") {
        // add an "invalid" class to the field:
        inputs[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }
    }
    if (tabs[currentTab].className == "pg1 part") {
      let checkbox = tabs[currentTab].querySelectorAll("input[type=checkbox].pg1-type:checked");
      console.log(checkbox);
      if (checkbox.length == 0) {
        valid = false
      }
  
      let radio = tabs[currentTab].querySelectorAll("input[type=radio].pg1-type:checked");
      console.log(radio);
      if (radio.length == 0) {
        valid = false
      }
    }
    
    // If the valid status is true, mark the step as finished and valid:
    return valid; // return the valid status
}

function updateStep(){}

function filterServices(){
  let typeCat = document.querySelector("#pg1-type-cat");
  let typeother = document.querySelector("#pg1-type-other");
  if (typeCat.checked || typeother.checked) {
    console.log("no dog only services");
    let dogInputs = document.querySelectorAll("input.dog-only");
    let dogLabels = document.querySelectorAll("label.dog-only");
    for (let i = 0; i < dogInputs.length; i++) {
      let x = dogInputs[i];
      x.checked = false;
    }
    for (let i = 0; i < dogLabels.length; i++) {
      let x = dogLabels[i];
      x.classList.add("hidden")
      console.log(x);
    }
    
  } else {
    let dogLabels = document.querySelectorAll("label.dog-only");
    for (let i = 0; i < dogLabels.length; i++) {
      let x = dogLabels[i];
      x.classList.remove("hidden")
    }
  }
  displayfields();
}

function displayfields(){
  let walking = document.querySelector("#pg1-walking");
  let sitting = document.querySelector("#pg1-sitting");
  if (walking.checked||sitting.checked) {
    timesPerDay();
  }else{
   document.querySelector(".daysGeneral").classList.add("hidden")
   document.querySelector(".daysGeneral").innerHTML="";
   document.querySelector(".daysFirstLast").innerHTML ="";
   document.querySelector(".daysFirstLast").classList.add("hidden");
  }
}

function addPetForm (){
  petCount++;
  const template = document.querySelector("template.pet-template").content.cloneNode(true);
  template.querySelector(".petNum span").textContent = petCount;
  let ifOther = template.querySelector(".if-other");
  let trash = template.querySelector(".delete");
  //console.log(trash);
  let labels = template.querySelectorAll("label");
  for (let i = 0; i < labels.length; i++) {
    let label = labels[i];
    label.setAttribute("for", `${label.getAttribute("for")}${petCount}`)
  }
  let inputs = template.querySelectorAll("input");
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    input.setAttribute("id", `${input.getAttribute("id")}${petCount}`)
    input.setAttribute("name", `${input.getAttribute("name")}${petCount}`)
  }
  let health = template.querySelector("textarea");
  health.setAttribute("id", `${health.getAttribute("id")}${petCount}`)
  let radio = template.querySelectorAll("input[type=radio]");
  radio.forEach(e => {
    e.addEventListener("input", ()=>{
      if (e.checked == true&&e.id==`pg3-type-other${petCount}`) {
        console.log("checked");
        let other = document.createElement("div");
        other.className="other pg2-input";
        let otherLabel = document.createElement("label");
        otherLabel.setAttribute("for", `what-type${petCount}`);
        otherLabel.textContent="Type of other pet"
        other.append(otherLabel);
        let otherInput = document.createElement("input");
        otherInput.setAttribute("type", "text");
        otherInput.setAttribute("id", `what-type${petCount}`)
        other.append(otherInput);
        ifOther.append(other)
      } else{
        ifOther.innerHTML = "";
        console.log("unchecked");
      }
    })
  });
  let newDiv = document.createElement("div");
  newDiv.className=`pet${petCount}`
  newDiv.append(template);
  trash.addEventListener("click",()=>{
    newDiv.parentElement.removeChild(newDiv);
  })
  document.querySelector(".pet-forms").append(newDiv);

}
let days_difference;
function numOfDays(){
  //define two date object variables with dates inside it  
  let date1 = new Date(document.querySelector("#pg1_start_date").value);  
  let date2 = new Date(document.querySelector("#pg1_end_date").value);  
           
  //calculate time difference  
  let time_difference = date2.getTime() - date1.getTime();  
           
  //calculate days difference by dividing total milliseconds in a day  
  days_difference = (time_difference / (1000 * 60 * 60 * 24))+1;  
  console.log(days_difference);
  isWeekend(date1, date2);
}

let weekendDays = 0;
function isWeekend(date1, date2){
let weekend = false;
while (date1 < date2) {
  let day = date1.getDay();
  weekend = (day === 6) || (day === 0); 
  if (weekend) { weekendDays++; }
  date1.setDate(date1.getDate() + 1);
}
console.log( "weekend days: " + weekendDays);
return false;
}

function timesPerDay(){
  document.querySelector(".daysGeneral").classList.remove("hidden")
  document.querySelector(".daysGeneral").innerHTML="";
  document.querySelector(".daysFirstLast").innerHTML ="";
  selectdays("How many times per day?", "timesGeneral", document.querySelector(".daysGeneral"))
  let generalInput = document.querySelector("#timesGeneral");
  generalInput.addEventListener("change", ()=>{
    if (generalInput.value == "Twice Daily") {
      firstLast();
    }else{
      document.querySelector(".daysFirstLast").innerHTML ="";
    }
  });
}

function firstLast(){
  const container = document.querySelector(".daysFirstLast")
  container.classList.remove("hidden");
  container.innerHTML = "";
  selectdays("How many time on the first day?", "timesFirst", container);
  selectdays("How many time on the last day?", "timesLast", container);
}

function selectdays(question, id, container){
  let label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = question;
  let input = document.createElement("select");
  input.setAttribute("id", id);
  let option1 = document.createElement("option");
  option1.textContent = "Once Daily";
  option1.setAttribute("value", "Once Daily");
  let option2 = document.createElement("option");
  option2.textContent = "Twice Daily";
  option2.setAttribute("value", "Twice Daily");
  input.append(option1);
  input.append(option2);
  container.append(label);
  container.append(input);
}

function showConfirmation(){
  let price;
  let weekendPrice = 0;
  let medicationPrice = 0;
  let firstDayPrice = 0;
  let lastDayPrice=0;
  let restPrice = 0;
  let template = document.querySelector("template.bookingTemp").content.cloneNode(true);
  let startDate = new Date(document.querySelector("#pg1_start_date").value);
  let endDate = new Date(document.querySelector("#pg1_end_date").value)
  let selected = document.querySelector(".service:checked + label .service-name");
  let pets = document.querySelectorAll("input.pet-name");
  let petsNames = "";

  //--------<booking name and pet names>--------------//
  //combining pet names
  for (let i = 0; i < pets.length; i++) {
    const element = pets[i].value;
    console.log(element);
    if (i==0) {petsNames = element;}
    else if(i==pets.length-1){petsNames = petsNames + " and " + element}
    else{petsNames = petsNames + ", " + element;}
  }
  template.querySelector(".servicedPets").textContent=petsNames; // what appears on the page
  console.log(petsNames);
  console.log(pets);
  template.querySelector(".chosenService").textContent = selected.textContent; // service name, next to pet names
//--------</booking name and pet names>---------------//

  template.querySelector(".fromTo").textContent =`${startDate.toDateString()} - ${endDate.toDateString()}`;// from date 1 to date 2
  //--------<firstlast days + rest of days>------------//
  let sub = document.querySelector(".service:checked + label sub").textContent; // the prices of the service
  if (document.querySelector("#timesGeneral")) { // if the field for "how many time a day" exists
  // the name of the service will appear with Once/Twice Daily
    template.querySelector(".onRest").textContent = selected.textContent+": "+document.querySelector("#timesGeneral").value;
    if (document.querySelector("#timesGeneral").value == "Once Daily"){ //if the value for "how many time a day" is Once
      price = sub.substring(0, sub.indexOf("-")); // get the lower price
      template.querySelector(".onRestDays .price").textContent = days_difference + "x" + price;  // total amount of days X the price
      restPrice = days_difference*price;
      console.log(restPrice);
      let first = template.querySelector(".onFirstDay"); // times on first day
      let last = template.querySelector(".onLastDay"); // times on last day
      first.parentElement.removeChild(first); // remove them since they dont exist
      last.parentElement.removeChild(last);
    } else{ //if the value for "how many time a day" is Twice
      price = sub.substring(sub.indexOf("-")+1, sub.indexOf(" ")); // get the higher price
      let firstPrice, lastPrice;
      let firstDay = document.querySelector("#timesFirst").value;
      let lastDay = document.querySelector("#timesLast").value;
      // if all options selected are Twice
      if (firstDay==document.querySelector("#timesGeneral").value&&lastDay==document.querySelector("#timesGeneral").value) { 
        let first = template.querySelector(".onFirstDay"); // times on first day
        let last = template.querySelector(".onLastDay"); // times on last day
        first.parentElement.removeChild(first); // remove them since they dont exist
        last.parentElement.removeChild(last);
        template.querySelector(".onRestDays .price").textContent = days_difference + "x" + price+ " kr";  // total amount of days X the price
        restPrice = days_difference*price;
        // if only the first day is the same
      }else if (firstDay==document.querySelector("#timesGeneral").value) {
        let first = template.querySelector(".onFirstDay"); // times on first day
        first.parentElement.removeChild(first);
        template.querySelector(".onRestDays .price").textContent = days_difference-1 + "x" + price+" kr";  // total amount of days X the price
        restPrice = (days_difference-1)*price;
        let last = template.querySelector(".onLastDay .onLast");
        last.textContent = "Last day: "+lastDay;
        lastPrice = sub.substring(0, sub.indexOf("-")); // get lower price
        template.querySelector(".onLastDay .price").textContent = lastPrice+" kr";
        lastDayPrice = lastPrice;

        //if only the last day is the same
      }else if (lastDay==document.querySelector("#timesGeneral").value) {
        let last = template.querySelector(".onLastDay"); // times on first day
        last.parentElement.removeChild(last);
        template.querySelector(".onRestDays .price").textContent = days_difference-1 + "x" + price+" kr";  // total amount of days X the price
        restPrice = (days_difference-1)*price;
        let first = template.querySelector(".onFirstDay .onFirst"); // times on first day
        first.textContent = "First day: "+ firstDay;
        firstPrice = sub.substring(0, sub.indexOf("-")); // get lower price
        template.querySelector(".onFirstDay .price").textContent = firstPrice+" kr";
        firstDayPrice = firstPrice;
        
        // if both are Once
      }else{
        template.querySelector(".onRestDays .price").textContent = days_difference-2 + "x" + price + " kr";  // total amount of days X the price
        restPrice = (days_difference-2)*price;
        firstPrice = sub.substring(0, sub.indexOf("-")); // get lower price
        let first = template.querySelector(".onFirstDay .onFirst"); // times on first day
        first.textContent = "First day: "+ firstDay;
        template.querySelector(".onFirstDay .price").textContent = firstPrice+" kr";
        firstDayPrice = firstPrice;
        let last = template.querySelector(".onLastDay .onLast");
        last.textContent = "Last day: "+ lastDay;
        template.querySelector(".onLastDay .price").textContent = firstPrice+" kr";
        lastDayPrice = firstPrice;
      }
      console.log("first day: " + firstPrice);
      console.log("last day: " + lastPrice);
    }

    // service with no amount of times per day
  }else{
    price = sub.substring(0, sub.indexOf(" "));
    template.querySelector(".onRestDays .price").textContent = days_difference + "x" + price+ " kr";  // total amount of days X the price
    template.querySelector(".onRest").textContent = selected.textContent;
    let first = template.querySelector(".onFirstDay");
    let last = template.querySelector(".onLastDay");
    first.parentElement.removeChild(first);
    last.parentElement.removeChild(last);
  }
  //--------</firstlast days + rest of days>------------//
  //--------<weekend price>-----------------------------//
  if (weekendDays => 0) {
    template.querySelector(".weekendDays .price").textContent = weekendDays+"x"+99+" kr"
    weekendPrice = weekendDays*99;
  }else{
    let weekend = template.querySelector(".weekendDays .price");
    weekend.parentElement.remove(weekend);
  }
  //--------</weekend price>----------------------------//

  console.log(selected.textContent);
  console.log(price);
  console.log( template.querySelector(".fromTo").textContent);
  document.querySelector(".bookings").innerHTML = "";
document.querySelector(".bookings").append(template);
}