window.addEventListener("DOMContentLoaded", init);
let currentTab = 0; // Current tab is set to be the first tab (0)
let petCount = 0;
function init() {
  //document.querySelector("form").reset();


//--------<EVENTLISTENERS>-----------//
 let nextBtn = document.querySelector(".next"); 
 nextBtn.addEventListener("click", ()=>{
  nextPrev(1)
 });
 let backBtn = document.querySelector(".back"); 
 backBtn.addEventListener("click", ()=>{
  nextPrev(-1)
 });

 let addPetBtn = document.querySelector(".link");
 addPetBtn.addEventListener("click", addPetForm);

 let pg1Types = document.querySelectorAll(".pg1-types input[type=checkbox]");
 pg1Types.forEach((type)=>{
type.addEventListener("input", filterServices)
 })
 let services = document.querySelectorAll(".service");
 services.forEach((e)=>{
  e.addEventListener("input", displayfields);
 })
 let methods = document.querySelectorAll(".paymentMethod");
 console.log(methods);
 methods.forEach((method)=>{
   method.addEventListener("input", showDetails);
 })
 
 addPetForm(petCount);
 let inputs = document.querySelectorAll(".inputs");
 inputs.forEach((input)=>{
   input.addEventListener("input", ()=>{
     input.classList.remove("invalid");
   })
 })

 //----<functions called an page load>---------//
setStartDate();
 filterServices();
 displayfields();
 showTab(currentTab); // Display the current tab
}
// make past date disabled when choosing dates for service
function setStartDate(){
  let startDate = document.querySelector("#pg1_start_date");
  let endDate = document.querySelector("#pg1_end_date");
  var dtToday = new Date();
     
  var month = dtToday.getMonth() + 1;
  var day = dtToday.getDate();
  var year = dtToday.getFullYear();
  if(month < 10){
    month = '0' + month.toString();
  }
  if(day < 10){
    day = '0' + day.toString();
  }
  
  var maxDate = year + '-' + month + '-' + day;
  startDate.setAttribute('min', maxDate);
  endDate.setAttribute('min', maxDate);
  startDate.addEventListener("input", setEndDate);
}
//make dates before start date disabled - end date > start date
function setEndDate(){
  var dtToday = new Date(document.querySelector("#pg1_start_date").value);
  let endDate = document.querySelector("#pg1_end_date");
    
  var month = dtToday.getMonth() + 1;
  var day = dtToday.getDate();
  var year = dtToday.getFullYear();
  if(month < 10){
    month = '0' + month.toString();
  }
  if(day < 10){
    day = '0' + day.toString();
  }
  var maxDate = year + '-' + month + '-' + day;
  endDate.setAttribute('min', maxDate);
}

function showTab(tab){ // display the right step
  let tabs = document.getElementsByClassName("part");
  tabs[tab].style.display ="block";
  if (tab==0) {
    document.querySelector(".back").classList.add("hidden"); // hide back button on first step
  }else{
    document.querySelector(".back").classList.remove("hidden");
  }
  if (tab == 4) {
    document.querySelector(".next").textContent = "Confirm"; // change "Next" buttons meaning
  } else if (tab == 5) {
    document.querySelector(".next").classList.add("hidden");
    document.querySelector(".next").textContent = `Pay ${totalPrice} kr`;// change "Next" buttons meaning
  }else{
    document.querySelector(".next").textContent = "Next";
    document.querySelector(".next").classList.remove("hidden");
  }
  updateStep(tab);
}

function nextPrev(n){ // next / back
  let tabs = document.getElementsByClassName("part");
  if (n == 1 && !validateForm()) return false; // if inputs are not valid dont move on to next step
  if (currentTab == 3) {
    numOfDays(); // get the amount of days of service
  }
  tabs[currentTab].style.display = "none"; // hide current step
  updateStep(tabs);
  currentTab = currentTab + n;

  if (currentTab == 6) { // hide everything and show the recipt
    document.querySelector(".next").setAttribute("type", "submit");
    document.querySelector(".buttons").classList.add("hidden");
    document.querySelector(".progress").classList.add("hidden");
    document.querySelector(".recipt").classList.remove("hidden")
    return false;
  } else {   // Otherwise, display the correct tab:
    document.querySelector(".next").setAttribute("type", "button");
    showTab(currentTab);
  }
}

function validateForm(){ // This function deals with validation of the form fields
    let valid = true;
    let tabs = document.getElementsByClassName("part");
    let inputs = tabs[currentTab].getElementsByClassName("inputs");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < inputs.length; i++) {
      // If a field is empty...
      if (inputs[i].value == "") {
        // add an "invalid" class to the field:
        inputs[i].classList.add("invalid");
        // and set the current valid status to false
        valid = false;
      }
    }
    if (currentTab == 0) {
      let types = document.querySelectorAll(".pg1 input[type=checkbox].pg1-type");
      types.forEach((type)=>{
        type.addEventListener("input",()=>{
          type.parentElement.parentElement.nextElementSibling.classList.add("hidden");
        })
      })
      let serviceTypes = document.querySelectorAll(".pg1 input[type=radio].pg1-type");
      serviceTypes.forEach((type)=>{
        type.addEventListener("input",()=>{
          type.parentElement.parentElement.nextElementSibling.classList.add("hidden");
        })
      })
      let checkbox = tabs[currentTab].querySelectorAll("input[type=checkbox].pg1-type:checked"); // get type of pets
      if (checkbox.length == 0) { //if nothing is checked
        valid = false
        let type = document.querySelector(".pg1 input[type=checkbox].pg1-type");
        type.parentElement.parentElement.nextElementSibling.classList.remove("hidden");
      }
      let radio = tabs[currentTab].querySelectorAll("input[type=radio].pg1-type:checked"); // get selected service
      if (radio.length == 0) { //if nothing is selected
        valid = false
        let type = document.querySelector(".pg1 input[type=radio].pg1-type");
        type.parentElement.parentElement.nextElementSibling.classList.remove("hidden");
      }
    }
    if (valid) {
      document.querySelectorAll(".step")[currentTab].classList.add("done");
    }
    
    // If the valid status is true, mark the step as finished and valid:
    return valid; // return the valid status
}

function updateStep (){ // show current step on step indicator
  let steps = document.querySelectorAll(".step");
  for (let i = 0; i < steps.length; i++) {
    steps[i].classList.remove("active");
  }
steps[currentTab].classList.add("active");
}

function filterServices(){ // filter the services available based on the types of animals you have
  let typeCat = document.querySelector("#pg1-type-cat");
  let typeother = document.querySelector("#pg1-type-other");
  if (typeCat.checked || typeother.checked) { // if cat or other is checked - dog only services are disabled
    let dogInputs = document.querySelectorAll("input.dog-only");
    let dogLabels = document.querySelectorAll("label.dog-only");
    for (let i = 0; i < dogInputs.length; i++) {
      let x = dogInputs[i];
      x.checked = false;
    }
    for (let i = 0; i < dogLabels.length; i++) {
      let x = dogLabels[i];
      x.classList.add("hidden")
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

function displayfields(){ // display conditional fields
  let walking = document.querySelector("#pg1-walking");
  let sitting = document.querySelector("#pg1-sitting");
  if (walking.checked||sitting.checked) { // if dog walking or pet sitting is selected show conditional field
    timesPerDay();
  }else{
   document.querySelector(".daysGeneral").classList.add("hidden")
   document.querySelector(".daysGeneral").innerHTML="";
   document.querySelector(".daysFirstLast").innerHTML ="";
   document.querySelector(".daysFirstLast").classList.add("hidden");
  }
}

function addPetForm (){ // add pet info form
  petCount++;
  const template = document.querySelector("template.pet-template").content.cloneNode(true); // copy template
  template.querySelector(".petNum span").textContent = petCount;
  let ifOther = template.querySelector(".if-other");
  let trash = template.querySelector(".delete");
  let labels = template.querySelectorAll("label");
  for (let i = 0; i < labels.length; i++) {
    let label = labels[i];
    label.setAttribute("for", `${label.getAttribute("for")}${petCount}`) // set unique ids and fors
  }
  let inputs = template.querySelectorAll("input");
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    input.setAttribute("id", `${input.getAttribute("id")}${petCount}`)// set unique ids and fors
    input.setAttribute("name", `${input.getAttribute("name")}${petCount}`)// set unique ids and fors
  }
  let health = template.querySelector("textarea");
  health.setAttribute("id", `${health.getAttribute("id")}${petCount}`)
  let radio = template.querySelectorAll("input[type=radio]");
  radio.forEach(e => {
    e.addEventListener("input", ()=>{
      if (e.checked == true&&e.id==`pg3-type-other${petCount}`) { // create type of pet field if other is chosen
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
        ifOther.innerHTML = ""; // remove type of pet if another type is chosen
      }
    })
  });
  let newDiv = document.createElement("div");
  newDiv.className=`pet${petCount}`
  newDiv.append(template);
  trash.addEventListener("click",()=>{
    newDiv.parentElement.removeChild(newDiv);
  })
  document.querySelector(".pet-forms").append(newDiv); // appened the pet form in the form

}
let days_difference;
function numOfDays(){ // calculate the number of days from start date to end date
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
function isWeekend(date1, date2){ // calculate how many weekend days are in the service
let weekend = false;
while (date1 < date2) {
  let day = date1.getDay();
  weekend = (day === 6) || (day === 0); 
  if (weekend) { weekendDays++; }
  date1.setDate(date1.getDate() + 1);
}
console.log( "weekend days: " + weekendDays);
showConfirmation();
}

function timesPerDay(){ // conditional fields
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

function firstLast(){ // conditional fields
  const container = document.querySelector(".daysFirstLast")
  container.classList.remove("hidden");
  container.innerHTML = "";
  selectdays("How many time on the first day?", "timesFirst", container);
  selectdays("How many time on the last day?", "timesLast", container);
}

function selectdays(question, id, container){ // create conditional field
  let label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = question;
  let input = document.createElement("select");
  input.setAttribute("id", id);
  input.classList.add("inputs");
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
let totalPrice;
function showConfirmation(){ // display summery of booking
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
    if (i==0) {petsNames = element;}
    else if(i==pets.length-1){petsNames = petsNames + " and " + element}
    else{petsNames = petsNames + ", " + element;}
  }
  template.querySelector(".servicedPets").textContent=petsNames; // what appears on the page
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
      template.querySelector(".onRestDays .price").textContent = days_difference + "x" + price+" kr";  // total amount of days X the price
      restPrice = days_difference*price;
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
        lastDayPrice = lastPrice*1;

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
        firstDayPrice = firstPrice*1;
        
        // if both are Once
      }else{
        template.querySelector(".onRestDays .price").textContent = days_difference-2 + "x" + price + " kr";  // total amount of days X the price
        restPrice = (days_difference-2)*price;
        firstPrice = sub.substring(0, sub.indexOf("-")); // get lower price
        let first = template.querySelector(".onFirstDay .onFirst"); // times on first day
        first.textContent = "First day: "+ firstDay;
        template.querySelector(".onFirstDay .price").textContent = firstPrice+" kr";
        firstDayPrice = firstPrice*1;
        let last = template.querySelector(".onLastDay .onLast");
        last.textContent = "Last day: "+ lastDay;
        template.querySelector(".onLastDay .price").textContent = firstPrice+" kr";
        lastDayPrice = firstPrice*1;
      }
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
  if (weekendDays) {
    template.querySelector(".weekendDays .price").textContent = weekendDays+"x99 kr"
    weekendPrice = weekendDays*99;
  }else{
    let weekend = template.querySelector(".weekendDays");
    weekend.parentElement.removeChild(weekend);
  }
  //--------</weekend price>----------------------------//
  //--------<medication price>--------------------------//
  let medication = document.querySelector("#extra1");
  if (medication.checked) {
    template.querySelector(".onMedicationDays .price").textContent = days_difference+"x30 kr";
    medicationPrice = days_difference*30;
  }else{
    let medicin = template.querySelector(".onMedicationDays");
    medicin.parentElement.removeChild(medicin);
  }
  //--------</medication price>-------------------------//
  //--------<total>------------------------------------//
  let total = document.querySelector(".total .price");
  let priceArray = [firstDayPrice, lastDayPrice, restPrice, medicationPrice, weekendPrice]
  totalPrice =priceArray.reduce((a,b)=>{
    return a+b;
  },0);
  console.log(totalPrice);
  console.log(firstDayPrice);
  console.log(lastDayPrice);
  console.log(restPrice);
  console.log(medicationPrice);
  console.log(weekendPrice);

  total.textContent = totalPrice+" kr";
  //--------</total>------------------------------------//
  document.querySelector(".bookings").innerHTML = "";
document.querySelector(".bookings").append(template);
}

function showDetails(){ // credit card fields
  let card = document.querySelector(".paymentMethod#credit-card");
  if (card.checked) {
    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "cardHolder");
    nameLabel.textContent = "Name";
    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("id", "cardHolder");
    nameInput.classList.add("inputs")
    let cardLabel = document.createElement("label");
    cardLabel.setAttribute("for", "card-element");
    cardLabel.textContent="Credit or Debit card";
    let cardInput = document.createElement("div");
    cardInput.setAttribute("id", "card-element");
    cardInput.classList.add("field");
    let errormsg = document.createElement("p");
    errormsg.classList.add("error","hidden");
    document.querySelector(".credit-info").append(nameLabel, nameInput, cardLabel, cardInput, errormsg);
    document.querySelector(".next").classList.remove("hidden");
    stripeStuff();
  }else{
    document.querySelector(".next").classList.add("hidden");
    document.querySelector(".credit-info").innerHTML="";
  }
}

//stripe fields settings
//https://stripe.com/docs/js
var stripe = Stripe('pk_test_51HzJxADA3uJiKcuR4X3s8HnqtQUW6CaWBI0f03dR064VRvTE10LUaBoYNgsL7wGgqAknPicUMgGeKcSlzpFDkmQf00VXwvFGJu');
var elements = stripe.elements();
var cardElement = elements.create('card',  {
  hidePostalCode: true,
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#14675e",
      color: "#555555",
      lineHeight: "14px",
      fontWeight: 300,
      fontFamily: '"Lato", Helvetica, sans-serif',
      fontSize: "14px",

      "::placeholder": {
        color: "#8898AA",
      },
    },
    invalid: {
      iconColor: "#e85746",
      color: "#e85746",
    },
  },
  classes: {
    focus: "is-focused",
    empty: "is-empty",
  },
});
function stripeStuff(){
  cardElement.mount('#card-element');
  cardElement.on("change", function (event) {
    console.log(event);
    setOutcome(event);
  });

}
// stripe
function setOutcome(result) {
  let errorElement = document.querySelector(".credit-info .error");
  errorElement.classList.add("hidden");

  if (result.token) {
    // Use the token to create a charge or a customer
    // https://stripe.com/docs/payments/charges-api

  } else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.remove("hidden");
  }
}

document.querySelector("form").addEventListener("submit", function (e) { // when submitting the form
  e.preventDefault();
  //this.contact_number.value = Math.random() * 100000 | 0;
                // these IDs from the previous steps
                emailjs.sendForm('confirmation_xo7e3gj', 'booking_form', this)
                    .then(function() {
                        console.log('SUCCESS!');
                    }, function(error) {
                        console.log('FAILED...', error);
                    });
  console.log("submiting");
  let form = document.querySelector("form#form");
  let extraDetails = {
    name: form.querySelector("#cardHolder").value,
  };
  stripe.createToken(cardElement, extraDetails).then(setOutcome);
});

