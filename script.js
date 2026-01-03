alert("JavaScript connected successfully");
const inputBox = document.getElementById("websiteInput");
const button = document.getElementById("submitBtn");
const output = document.getElementById("outputBox");

button.addEventListener("click", function () {
    const websiteURL = inputBox.value;

    if (websiteURL === "") {
        output.innerHTML = "Please enter a website URL";
    } else {
        output.innerHTML = "You entered: " + websiteURL;
    }
});

