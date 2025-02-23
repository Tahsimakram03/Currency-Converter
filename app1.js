const BASE_URL = "https://v6.exchangerate-api.com/v6/268fbc7f44ce6a50a1ae0c6d/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => updateFlag(evt.target));
}

const updateExchangeRate = async () => {
  let amtVal = amountInput.value.trim();
  if (!amtVal || isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }
  
  const fromCode = fromCurr.value;
  const toCode = toCurr.value;
  const URL = `${BASE_URL}/${fromCode}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error(`Failed to fetch exchange rate: ${response.statusText}`);
    
    let data = await response.json();
    if (!data.conversion_rates || !data.conversion_rates[toCode]) {
      throw new Error("Invalid currency code or unavailable conversion rate");
    }
    
    let rate = data.conversion_rates[toCode];
    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate. Please try again later.";
    console.error("Exchange Rate Fetch Error:", error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let img = element.parentElement.querySelector("img");
  if (img) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", updateExchangeRate);
