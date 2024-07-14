// ********* NAV BAR SCRIPT ********** //https://www.w3schools.com/howto/howto_js_topnav_responsive.asp
function expand_nav_contents() {
    var topnav = document.getElementById("topnav");
    if (topnav.className === "topnav") {
        topnav.className += " responsive";
    } else {
        topnav.className = "topnav";
    }
}

// ********** SEARCH FUNCTION **************
document.addEventListener("DOMContentLoaded", function() {
    // Retrieve the content container and its original content
    const contentContainer = document.querySelector('.content_container');
    const originalContent = contentContainer.innerHTML;

    // Define the search function to filter wine cards
    window.search = function() {
        let filter = document.getElementById("find").value.toUpperCase(); // Get the search input value and convert it to uppercase for case-insensitive comparison
        let items = document.querySelectorAll(".wine_card"); // Get all wine card elements
        items.forEach(item => { // enable buttons
            button = item.querySelector('button'); // select button and link
            link = item.querySelector('a');
            button.disabled = false;
            if (link) { // change classList for styling purposes
                link.classList.remove('disabled_link');
            }            
        })
        let suggestions = document.getElementById("suggestions"); // Get the suggestions container
        let cardContainers = document.querySelectorAll(".card_container"); // Get all card container elements

        // Clear previous suggestions
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';

        if (filter.length === 0) {
            // Show all cards when search input is cleared
            contentContainer.innerHTML = originalContent;
            main();
            return;
        }

        let uniqueTags = new Set(); // To store unique tags for suggestions
        let hasSuggestions = false; // Flag to check if there are suggestions
        let filteredItems = []; // To store filtered items
        let suggestionCount = 0; // Initialize the suggestion counter

        items.forEach(item => {
            let tags = item.getElementsByClassName("cloud")[0]; // Get the tags element of the current item
            if (!tags) return;

            let value = tags.textContent || tags.innerText || tags.innerHTML; // Get the text content of the tags

            if (value.toUpperCase().includes(filter)) {
                // If the tags contain the filter text, show the item and add to filtered items
                item.style.display = "";
                filteredItems.push(item);

                // Split the tags into individual words and add to suggestions if they match the filter
                value.split(/\s+/).forEach(tag => {
                    if (tag.toUpperCase().includes(filter) && !uniqueTags.has(tag) && suggestionCount < 4) {
                        uniqueTags.add(tag);

                        // Create a suggestion item and add click event to filter cards based on the suggestion
                        let suggestionItem = document.createElement("div");
                        suggestionItem.textContent = tag;
                        suggestionItem.onclick = function() {
                            document.getElementById("find").value = tag;
                            suggestions.style.display = 'none';
                            filterCards(tag.toUpperCase());
                        };
                        suggestions.appendChild(suggestionItem);
                        hasSuggestions = true;
                        suggestionCount++; // Increment the suggestion counter
                    }
                });
            } else {
                // If the tags do not contain the filter text, hide the item
                item.style.display = "none";
            }
        });

        if (hasSuggestions) {
            // If there are suggestions, display the suggestions container
            suggestions.style.display = 'block';
        }

        // Show only filtered items at the top of the content container
        if (filteredItems.length > 0) {
            let container = document.querySelector('.content_container');
            container.innerHTML = '<h1>My Journal Entries</h1>';
            let filteredContainer = document.createElement('div');
            filteredContainer.className = 'filtered_container expanded';
            container.appendChild(filteredContainer);
            filteredItems.forEach(item => {
                filteredContainer.appendChild(item);
            });
        }
    }

    // Define the filterCards function to filter cards based on a specific tag
    window.filterCards = function(filter) {
        let items = document.querySelectorAll(".wine_card"); // Get all wine card elements
        let cardContainers = document.querySelectorAll(".card_container"); // Get all card container elements

        items.forEach(item => {
            let tags = item.getElementsByClassName("cloud")[0]; // Get the tags element of the current item
            if (!tags) return;

            let value = tags.textContent || tags.innerText || tags.innerHTML; // Get the text content of the tags
            if (value.toUpperCase().includes(filter)) {
                // If the tags contain the filter text, show the item
                item.style.display = "";
            } else {
                // If the tags do not contain the filter text, hide the item
                item.style.display = "none";
            }
        });

        if (filter.length === 0) {
            // Show all cards when search input is cleared
            contentContainer.innerHTML = originalContent;
            cardContainers.forEach(container => container.classList.remove("expanded"));
            items.forEach(item => item.style.display = "");
        }
    }
});

function main() {
    cardContainers = document.querySelectorAll('.card_container');


    // ******* CAROUSEL SCRIPT *********
    class Carousel {

        constructor(items, controls) {
            this.carouselControls = controls;
            this.carouselArray = [...items];
            this.useControls();
        }

        updateGallery(){ // update cards, based on useControls
            const numCards = this.carouselArray.length;
            const cardClasses =[];
            for (let i = 0; i < numCards; i++) {
                cardClasses.push("wine_card_" + i);
            }

            this.carouselArray.forEach(el => {
                el.classList.remove(...cardClasses);
            });

            this.carouselArray.slice(0,numCards).forEach((el, i) => { // take carousel and reassign classes
                el.classList.add(cardClasses[(i) % numCards]);
            });
        }

        useControls(){
            this.carouselControls[0].addEventListener('click', e => { // previous pressed
                e.preventDefault();
                this.carouselArray.unshift(this.carouselArray.pop()); // last element becomes first
                this.updateGallery();
                disableSubsequentCards(cardContainers);
            });

            this.carouselControls[1].addEventListener('click', e => { //next pressed
                e.preventDefault();
                this.carouselArray.push(this.carouselArray.shift()); // first element becomes last
                this.updateGallery();
                disableSubsequentCards(cardContainers);
            });
        }
    }


    // ****** DISABLE BUTTONS ON NON-ACTIVE CARDS ***********
    function disableSubsequentCards(cardContainers) { 
        cardContainers.forEach((element) => {
            const wineCards = element.children;
            const wineCardsArray = [...wineCards];
            
            wineCardsArray.forEach((e) => {
                var button = e.querySelector('button'); // select button and link
                var link = e.querySelector('a');
                if ((e.classList.contains('wine_card_0')) || (element.classList.contains('expanded'))) { 
                    button.disabled = false; // undisable button
                    if (link) { // change classList for styling purposes
                        link.classList.remove('disabled_link');
                    }
                } else {
                    button.disabled = true; // disable button
                    if (link) { //change classList for styling purposes
                        link.classList.add('disabled_link');
                    }
                }
            });
        });
    }

    // ******** REMOVE TOGGLE BUTTONS WHEN ONLY ONE CARD IN REGION **************
    function toggleButtonVisibility(divs, buttons) {
        if (divs.length >= 2) {
            buttons.style.display = 'flex'; // Show the button
        } else {
            buttons.style.display = 'none'; // Hide the button
        }}


    // ************* EXPAND REGION SCRIPT ************
    function expandFunction(cardContainers) {
        const expandButtons = document.querySelectorAll(".expand");
        for (let i = 0; i < expandButtons.length; i++) {
            expandButtons[i].addEventListener('click', e => {
                if (cardContainers[i].classList.contains("expanded")) {
                    cardContainers[i].classList.remove('expanded'); // change classList for styling
                    expandButtons[i].innerHTML = 'expand'; //change text of button
                    document.getElementById("next"+ i).style.display = 'flex'; // make sure 'next' and 'previous' are visible
                    document.getElementById("previous"+ i).style.display = 'flex';
                } else {
                    cardContainers[i].classList.add('expanded'); // change classList for styling purposes
                    expandButtons[i].innerHTML = 'shrink'; // change text of button
                    document.getElementById("next"+ i).style.display = 'none'; // remove next and previous buttons
                    document.getElementById("previous"+ i).style.display = 'none';
                }
                disableSubsequentCards(cardContainers); // make sure see more links work on correct cards
            })    
        }
    }
    expandFunction(cardContainers);

    // ********** TOGGLE NO JOURNAL ENTRY MESSAGE ***********
    function toggleNoJournal(){
        cardContainers.forEach(e => {
            if (e.hasChildNodes()) {
                region = e.parentNode;
                region.querySelector('p').innerHTML = ""; // removes message
            } else {
                region = e.parentNode;
                region.querySelector('p').innerHTML = "You have no journal entries for this region..."; //adds message
            }
        })
    }

    //******** CREATE NEW WINE CARD ***********
    arrayNewWineCardInfo = JSON.parse(localStorage.getItem("new_wine")); // get object new_wine
    if (arrayNewWineCardInfo === null) { // prevents error if no new cards
        arrayNewWineCardInfo = [];
    }
    regions = document.querySelectorAll('.region');

    arrayNewWineCardInfo.forEach(el => { // iterate through all new cards
        var newWineCard = document.createElement("article"); // new card

        regions.forEach(region => { // find region for each card
            if (region.classList.contains(el['region'])) {
                newCardContainer = region.querySelector('.card_container');
                newCardContainer.appendChild(newWineCard);
                newWineCard.classList.add('wine_card');
                newWineCard.classList.add('wine_card_' + (newCardContainer.childElementCount - 1));
                newWineCard.innerHTML = '<h3>' + el['name'] + '</h3><img src="' + el['image'] + '" alt="Picture of wine label" /><div class="star_rating"></div><div class="cloud"></div><div class="buttons"><button class="expand-button">See more...</button></div>'
                // ^^ adds necessary classes
                starString = ''; // insert star rating
                for (let i = 0; i < el['stars']; i++) {
                    starString += '<i class="fa-solid fa-star fa-2x"></i>'
                }
                for (let i = 0; i < (5 - el['stars']); i++) {
                    starString += '<i class="fa-regular fa-star fa-2x"></i>'
                }
                newWineCard.querySelector('.star_rating').innerHTML = starString;

                el['tags'].forEach(tag => { // insert tags
                    newTag = document.createElement("span");
                    newTag.classList.add("tag_cloud");
                    newTag.innerHTML = tag;
                    newWineCard.querySelector('.cloud').appendChild(newTag);
                })
            }
            const controls =[region.querySelector('.previous'),region.querySelector('.next')];
            const items = region.querySelectorAll('.' + region.classList[1] + ' .wine_card');
            const newCarousel = new Carousel(items, controls); // redefine carousel object for new wine card
        });
        if (newWineCard && newWineCard.querySelector('.expand-button') != null) { //prevents errors
        newWineCard.querySelector('.expand-button').addEventListener('click', e => { //check if see more pressed on new card
            template = '';
            fetch('template.html') // fetches template
                .then(response => response.text()) // response store template
                .then(temp => { template = temp; // template is assigned the text content of response
                    seemoreWindow = window.open('','_self');
                    // replace necessary variables 
                    template = template.replace("{name}", (el['name']));
                        template = template.replace("{imagesource}", el['image']);
                        template = template.replace("{price}", el['price']);
                        template = template.replace("{producer}", el['producer']);
                        template = template.replace("{vintage}", el['vintage']);
                        template = template.replace("{region}", el['region'].charAt(0).toUpperCase() + el['region'].slice(1));
                        template = template.replace("{notes}", el['notes']);
                        template = template.replace("{stars}", starString);

                    tagString = '';
                        el['tags'].forEach(tag => {
                            tagString += ('<ul>' + tag + '</ul>');
                    })
                        template = template.replace('{tags}', tagString);
                    seemoreWindow.document.write(template); // write template to the new window
                    });
            });
        }
        cardContainers.forEach(element => {
            toggleButtonVisibility(element.children, element.nextElementSibling); // refresh button visibility
        })
        toggleNoJournal(); // refresh no journal message visibility

    })

    regions.forEach(region => { //create initial carousels
        const controls =[region.querySelector('.previous'),region.querySelector('.next')];
        const items = region.querySelectorAll('.' + region.classList[1] + ' .wine_card');
        const newCarousel = new Carousel(items, controls);
    })

    disableSubsequentCards(cardContainers); // call inital functions
    toggleNoJournal();
    cardContainers.forEach(element => {
        toggleButtonVisibility(element.children, element.nextElementSibling);
    })
}

main();
