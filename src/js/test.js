console.log('hallo')


var renderers = {};

var mainElement = document.querySelector('main');
console.log(mainElement)



var modalElement = createModal();
var modalContentElement = modalElement.querySelector('.content');
var modalCloseButton = modalElement.querySelector('.controls button');
modalCloseButton.addEventListener('click', hideModal);
document.body.appendChild(modalElement);


function loadData(url,done) {
  var xhr = new XMLHttpRequest();
  
  xhr.onload = function() {
      var response = xhr.responseText;
      var reasponseObj = JSON.parse(response);
      done(reasponseObj);

      console.log(reasponseObj);
      console.log(reasponseObj["results"]);

  }
  xhr.open('GET', url);
  xhr.send();

};

function loadPeople(done) {
  loadData('https://swapi.co/api/people', done);
}
function loadPlanet (url , done){
  loadData(url,done)
}

function renderPeople(people) {
  mainElement.textContent='';
  var navElement =document.createElement('nav');
  if (people.previous) {
    var previousButton = document.createElement('button');
    previousButton.classList.add('previous');
    previousButton.textContent = 'Previous';
    previousButton.addEventListener('click', function(){
      loadData(people.previous,renderPeople)
    });
    navElement.appendChild(previousButton);
     mainElement.appendChild(navElement);
  }

    if (people.next) {
    var nextButton = document.createElement('button');
    nextButton.classList.add('next');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', function(){
      loadData(people.next,renderPeople)
    });
    navElement.appendChild(nextButton);
    mainElement.appendChild(navElement);
  }


  people.results.forEach(function(person) {
    var sectionElement = document.createElement('section');
    sectionElement.classList.add('person');

    var genderSymbol;
    switch (person.gender) {
      case 'male':
        genderSymbol = '♂';
        break;
      case 'female':
        genderSymbol = '♀';
        break;
      default:
        genderSymbol = '?';

    }
    sectionElement.innerHTML = `
    <header>
      <h1>
        ${person.name}
        <span class="gender" tilte="Gender: ${person.gender}">${genderSymbol}</span>
      </h1>
    </header>
    <div>
    <button class="buttonplanet">Show Planet</button>
      <ul>
        <li>
          <span class="lable">Birth Year :</span>
         <span class="value">${person.birth_year}</span>
        </li>
        <li>
          <span class="lable">Eye Color :</span>
          <span class="value">${person.eye_color}</span>
        </li>
        <li>
          <span class="lable">Skin Color :</span>
          <span class="value">${person.skin_color}</span>
        </li>
        <li>
          <span class="lable">Hair Color :</span>
          <span class="value">${person.hair_color}</span>
        </li>
        <li>
          <span class="lable">Height :</span>
          <span class="value">${(person.height/100).toFixed(2)}m</span>
        </li>
        <li>
          <span class="lable">'Mass :</span>
          <span class="value">${person.mass}</span>
        </li>
      </ul>
    </div>
    `;
    sectionElement
      .querySelector('button')
      .addEventListener('click', function() {
        loadPlanet(person.homeworld, renderPlanet)
    

   });
    mainElement.appendChild(sectionElement);
  });
  console.log(people)
}
renderers.people = renderPeople;

function renderUnimplemented(){
  mainElement.textContent= "Sorry, this is not implemented yet."
}

function renderMenu (data){
  var menuElement = document.getElementsByClassName('mainlist');
  console.log(menuElement)

  var keys = Object.keys(data);
  keys.forEach(function(key){
    var liElement = document.createElement('li');
    var aElement = document.createElement('a');
    aElement.textContent = key;
    aElement.addEventListener('click',function(){
      if (!renderers[keys]) return renderUnimplemented();
      loadData(data[keys], renderers[keys]);
    });

    liElement.appendChild(aElement);
    console.log(liElement);
    
    menuElement.appendChild(liElement);
    console.log(menuElement);
  });

};
loadData('https://swapi.co/api/', renderMenu)

function renderPlanet(planet) {
    var sectionElement = document.createElement('section');
    sectionElement.classList.add('planet');
    sectionElement.innerHTML = `
    <header>
      <h1>
        ${planet.name}
      </h1>
    </header>
    <div>
      <ul>
        <li>
          <span class="lable">Rotation Period :</span>
         <span class="value">${planet.rotation_period}</span>
        </li>
        <li>
          <span class="lable">Orbital Period</span>
          <span class="value">${planet.orbital_period}</span>
        </li>
        <li>
          <span class="lable">Diameter</span>
          <span class="value">${planet.diameter}</span>
        </li>
        <li>
          <span class="lable">Climate</span>
          <span class="value">${planet.climate}</span>
        </li>
        <li>
          <span class="lable">Gravity</span>
          <span class="value">${(planet.gravity/100).toFixed(2)}m</span>
        </li>
        <li>
          <span class="lable">Terrain</span>
          <span class="value">${planet.terrain}</span>
        </li>
      </ul>
    </div>
    `;
    showModal(sectionElement);

  };
renderers.planet = renderPlanet;


function createModal (){
  var element = document.createElement('div');
  element.classList.add('modal');
  element.innerHTML = `
  <div class="body">
  <div class="controls">
    <button class="buttonplanet">close</button>
  </div>
  <div class="content"></div>
</div>
<div class="underlay"></div>
`;
    element
      .querySelector('button')
      .addEventListener('click', function() {
        hideModal(element)
    

   });

return element
}

function showModal (contentElement){
 modalContentElement.innerHTML='';
 modalContentElement.appendChild(contentElement);
 modalElement.classList.add('open')
  
}
function hideModal (contentElement){
  contentElement.classList.remove('open')
}

loadPeople(renderPeople);





