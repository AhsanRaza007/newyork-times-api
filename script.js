//checks if the document is loading the first time.
let firstLoadstate = true;

// navbar items also the section for which the apis are called.
let sections = ['HOME', 'WORLD', 'POLITICS', 'MAGAZINE', 'TECHNOLOGY', 'SCIENCE', 'HEALTH', 'SPORTS', 'ARTS', 'FASHION', 'FOOD', 'TRAVEL'];

let navList = document.getElementById('navList');

//renders the nav when called.
function renderNav(){
    navList.innerHTML = '';
    sections.forEach((section) => {
        navList.innerHTML += `
        <li class="nav-item">
            <a class="nav-link" style="cursor: pointer;" id="${section}" onclick="renderPage(&quot;${section}&quot;)">${section}</a>
        </li>
        `;
    });
}


//utility function the Name of the Month from the date as input
function returnMonthName(monthNum){
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNum];
}


//render Page is the actual driver of the website calls other function to complete rendering of the webpage.
async function renderPage(section) {
    //setting the first load as false.
    firstLoadstate = false;
    //rendering navbar
    renderNav();

    //adding the active state of the current selected nav-item
    document.getElementById(section).classList.add('active');

    //emptying the previously loaded articles and adding a spinner which spins till the data gets loaded.
    document.getElementById('articles').innerHTML = '' + createLoader();

    //calling get articles to get the data from the api
    let articles = await getArticles(section);
    
    //storing the results array from the response for ease of use.
    let results = articles.results;

    //destroying the spinner as the data has been loaded
    document.getElementById('articles').innerHTML = '';

    //creating cards for each article in the section with the required values
    results.forEach(result=>{
        let section = result.section;
        let title = result.title;
        let abstract = result.abstract;
        let date = new Date(result.published_date);
        date = returnMonthName(date.getMonth()) + " " + date.getFullYear();
        let link = result.url;
        let image = result.multimedia[0].url;
        card(section, title, date, abstract, link, image);
    })

}

//return a card ui div built on the data from a single article.
function card(section, title, date, abstract, link, image) {
    document.getElementById('articles').innerHTML += `
        <div class="card my-3 border-dark rounded-0" style="box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.5)">
            <div class="row no-gutters">
                <div class="col-md-8">
                    <div class="card-body">
                        <h6 class="card-text text-muted font-weight-bold text-uppercase">${section}</h6>
                        <h4 class="card-title mb-0">${title}</h4>
                        <p class="card-text mt-0"><small class="text-muted font-weight-bold">${date}</small></p>
                        <p class="card-text">${abstract}</p>
                        <p class="card-text text-primary font-weight-bolder"><a href="${link}" target="_blank" class="text-decoration-none">Continue Reading</a></p>
                    </div>
                </div>

                <div class="col-md-4">
                    <img src="${image}" class="card-img img-fluid rounded-0"/>
                    </div>
                </div>
            </div>
        </div>
    `
}

//retrieves articles from the NYT api and returns the result.
async function getArticles(section){
    let articles = await fetch(`https://api.nytimes.com/svc/topstories/v2/${section.toLowerCase()}.json?api-key=9PpdPXrJ0al9ys8Lf3zjkZtRjTB26vDD`);
    articles = await articles.json();
    return articles;
}


//loading spinnner creator
function createLoader(){
    return `<div class="loader"></div>`
}

//checking if the loading time is when the user loads website for the first time. If true renderPage using HOME data
if(firstLoadstate){
    renderPage(sections[0]);
}