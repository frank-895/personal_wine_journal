// ********* NAV BAR SCRIPT ********** //https://www.w3schools.com/howto/howto_js_topnav_responsive.asp
function expand_nav_contents() {
    var topnav = document.getElementById("topnav");
    if (topnav.className === "topnav") {
        topnav.className += " responsive";
    } else {
        topnav.className = "topnav";
    }
}

// ****** CREATE NEW WINE CARD ********
formSubmitButton = document.querySelector('.submit');
var arrayNewWineInfo;
arrayNewWineInfo = JSON.parse(localStorage.getItem("new_wine"));
if (arrayNewWineInfo === null){
    arrayNewWineInfo = []; // prevents errors
}
formSubmitButton.addEventListener('click', e => {
    validateForm(); // call validation functions when submit is pressed
    checkForm();
    if (checkForm()) { // if form passes
        wineImage = document.getElementById("image").files[0];
        const reader= new FileReader();
        reader.readAsDataURL(wineImage);
        reader.onload = function() { // only continue if image successfully uploaded
            wineImage = reader.result;
            
            var newWineInfo = {};

            star_rating = document.querySelectorAll('.star_rating .fa-solid').length;
            // asign varuables
            newWineInfo['name'] = document.getElementById("wineName").value;
            newWineInfo['price'] = document.getElementById("price").value;
            newWineInfo['producer'] = document.getElementById("producer").value;
            newWineInfo['vintage'] = document.getElementById("vintage").value;
            newWineInfo['notes'] = document.getElementById("notes").value;
            newWineInfo['image'] = wineImage;
            tags = [];
            document.querySelectorAll('.cloud .tag_cloud').forEach(el => {
                tags.push(el.children[0].innerHTML);
            })
            newWineInfo['tags'] = tags;
            newWineInfo['region'] = document.getElementById("region").value;
            newWineInfo['stars'] = star_rating;
            arrayNewWineInfo.push(newWineInfo); // we have an array of new wine cards
            localStorage.setItem('new_wine', JSON.stringify(arrayNewWineInfo)); // JSON string sent to local storage
            window.location.href = "index.html"; //redirect to index.html
        }
    }
})

// ********** DISPLAY UPLOADED PHOTO **************
const image_input = document.querySelector('.image_input');
var uploaded_image = "";

image_input.addEventListener("change", function() {
    const reader = new FileReader();
    reader.addEventListener("load", () => { // only once image has been loaded
        uploaded_image = reader.result;
        document.querySelector(".display_image").style.backgroundImage = `url(${uploaded_image})`;
        if (uploaded_image != null) { // image validation here
            document.querySelector('.progress0').classList.add('valid');
        } else {
            document.querySelector('.progress0').classList.remove('valid');
        }
    });
    reader.readAsDataURL(this.files[0]); // triggers onload function
})

// ********** FORM CAROUSEL ***************
function formRotation(formElements, controls, progressElements, arrowElements) {
    noElements = formElements.length;
    controls[0].addEventListener('click', e => { // user presses previous
        e.preventDefault();
        validateForm(); // validation occurs
        for (let i = 0; i < noElements; i++) {
            if (!formElements[i].classList.contains('hidden')) {
                currentElementIndex = i;
                break; // breaks once current found 
            }
        }
        formElements[(currentElementIndex - 1)].classList.remove('hidden'); // make previous card visible
        formElements[currentElementIndex].classList.add('hidden'); // hide current card
        arrowElements[currentElementIndex - 1].classList.remove('hidden'); // same for the arrow
        arrowElements[currentElementIndex].classList.add('hidden');
        
        // hide buttons that are not needed
        if (currentElementIndex == 1) {
            controls[0].classList.add('hidden');
        }

        if (currentElementIndex == 4) {
            controls[1].classList.remove('hidden');
            formSubmitButton.classList.add('hidden');
        }
    });

    controls[1].addEventListener('click', e => {
        e.preventDefault();
        validateForm();
        for (let i = 0; i < noElements; i++) {
            if (!formElements[i].classList.contains('hidden')) {
                currentElementIndex = i; // breaks once current found 
                break;
            }
        }
        formElements[currentElementIndex + 1].classList.remove('hidden'); // remove hidden from next card
        progressElements[currentElementIndex + 1].classList.add('viewed'); // mark viewed pages as seen
        formElements[currentElementIndex].classList.add('hidden'); // hide current card
        arrowElements[currentElementIndex + 1].classList.remove('hidden'); // same for arrows
        arrowElements[currentElementIndex].classList.add('hidden');
        
        // hide buttons that are not needed
        if (currentElementIndex == 0) {
            controls[0].classList.remove('hidden');
        }

        if (currentElementIndex == 3) {
            controls[1].classList.add('hidden');
            formSubmitButton.classList.remove('hidden');
        }
    });    
}

formRotation(document.querySelectorAll("form"), document.querySelectorAll(".form_buttons button"), document.querySelectorAll(".progress"), document.querySelectorAll('.pointers *')) // call functino

// ********** FORM VALIDATION ***********
function validateForm() { // checks for missing entries
    // form1 check in display uploaded image function
    check = true;
    document.querySelectorAll('.form2 > *:not(h2)').forEach(e => { // form2 check
        if (e.value == '') {
            check = false;
        }
    })
    if (check == true) { // if user has entered all wine details
        document.querySelector('.progress1').classList.add('valid');
    } else {
        document.querySelector('.progress1').classList.remove('valid');
    }

    if (!document.querySelector('.form3').classList.contains('hidden')) { // form3 check - automatically green as default value
        document.querySelector('.progress2').classList.add('valid');
    }

    if (tagHolder.hasChildNodes()) { // form4 check. check tags have been entered
        document.querySelector('.progress3').classList.add('valid');
    } else {
        document.querySelector('.progress3').classList.remove('valid');
    }

    if (document.querySelector('.form5 > *').value != "") { // check text description entered
        document.querySelector('.progress4').classList.add('valid');
    } else {
        document.querySelector('.progress4').classList.remove('valid');
    }
}

function checkForm() { // checks for required field missing entries
    if (!document.querySelector('.progress0').classList.contains('valid')) {
        document.querySelector('.progress0').classList.add('denied'); // makes red and prevents submit
    } else {
        document.querySelector('.progress0').classList.remove('denied');
    } 
    if (document.querySelector('.form2 #region').value == '') { // check region entered
        document.querySelector('.form2 #region').classList.add('denied');
        document.querySelector('.progress1').classList.add('denied');
    }  else {
        document.querySelector('.form2 #region').classList.remove('denied');
    }
    if (document.querySelector('.form2 #wineName').value == '') { // check wine name eneted
        document.querySelector('.form2 #wineName').classList.add('denied');
        document.querySelector('.progress1').classList.add('denied');
    } else {
        document.querySelector('.form2 #wineName').classList.remove('denied');
    }
    if (!document.querySelector('.form2 #wineName').classList.contains('denied') && !document.querySelector('.form2 #region').classList.contains('denied')) {
        return true; // allows submit
    } else {
        document.querySelector('.progress1').classList.add('denied');
        return false; // deines submit, 
    }
}


// ******** CHANGE STAR RATING IN FORM *********
const stars = document.querySelectorAll(".form3 .fa-star");

stars.forEach((star, index) => { // to check if rating changed
    star.addEventListener("click", () => {
        const rating = index + 1;
        changeRating(rating);
    });
});
function changeRating(rating) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove("fa-regular"); // change icon depending on user input
        star.classList.add("fa-solid");
      } else {
        star.classList.remove("fa-solid");
        star.classList.add("fa-regular");
      }
    });
  }

// ******* ADD TAG ***********
addTagButton = document.querySelector('.add_tag');
tagInput = document.querySelector('.input_tag');
tagHolder = document.querySelector('.cloud');

addTagButton.addEventListener('click', e => {
    e.preventDefault();
    newTagText = tagInput.value.trim();
    newTag = document.createElement("span");
    tagHolder.appendChild(newTag);
    newTag.innerHTML = '<p>' + newTagText + ' </p><button><i class="fa-solid fa-xmark"></i></button>';
    newTag.classList.add('tag_cloud');
    tagInput.value = '';
})

// ***** REMOVE TAG ******
tagHolder.addEventListener('click', e => {
    e.preventDefault();
   if (e.target.parentElement.tagName == "BUTTON") {
        button = e.target.parentElement;
        button.parentElement.remove();
   } else if (e.target.tagName == "BUTTON") {
        e.target.parentElement.remove();
    }
})
