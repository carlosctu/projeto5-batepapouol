let cadastrarNome = prompt("Qual é seu nome?");
let mensagens = [];
let cont = 0;
let cont2 = 0;
let receiver = "Todos";
let typeMessage = "message";
// const message = {}
login();
// Login no Batepapo OUL
function login() {
  const nome = {
    name: cadastrarNome,
  };
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    nome
  );
  promise.then(() => {
    setTimeout(searchMessages, 200);
    setInterval(enableConnection, 5000);
  });
  promise.catch(() => {
    cadastrarNome = prompt("Qual é seu nome?");
  });
}
//---------------------------------------------------------------
setInterval(searchMessages, 3000);

// Enviar Mensagem
function sendMessage() {
  const messageToSend = document.querySelector(".msg");
  if (messageToSend.value == null || messageToSend.value == "") {
    return;
  }
  const message = {
    from: cadastrarNome,
    to: receiver,
    text: messageToSend.value,
    type: typeMessage,
  };
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    message
  );
  promise.then(() => {
    document.querySelector(".msg").value = "";
    searchMessages();
  });
  promise.catch(() =>
    console.log(`Deu erro na tua mensagem: ${erro.response.status}`)
  );
}
//---------------------------------------------------------------

// Manter Conexão
function enableConnection() {
  const user = {
    name: cadastrarNome,
  };
  const promisse = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    user
  );
  promisse.then(() => console.log("Conexão estável"));
  promisse.catch(() => {
    console.log("Conexão encerrada");
    window.location.reload();
  });
}
//---------------------------------------------------------------

// Procurar Mensagens
function searchMessages() {
  const promisse = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promisse.then((dados) => {
    mensagens = dados.data;
    renderMessages(mensagens);
  });
  promisse.catch(() => console.log("Erro no carregamento das mensages"));
}
// Renderizar mensagens
function renderMessages(mensagens) {
  cont++;
  if (cont !== cont2) {
    document.querySelector(".chat").innerText = "";
  }
  let div = document.querySelector(".chat");
  for (let i = 0; i < mensagens.length; i++) {
    if (mensagens[i].type == "status") {
      div.innerHTML += `<div class="log"><p class="hour">(${mensagens[i].time})</p>&nbsp&nbsp<p class="user">${mensagens[i].from}</p>&nbsp&nbsp<p>${mensagens[i].text}</p></div>`;
    } else if (mensagens[i].type == "message") {
      div.innerHTML += `<div class="message"><p class="hour">(${mensagens[i].time})</p>&nbsp&nbsp<p class="user">${mensagens[i].from}</p>&nbsp&nbsp<p>para</p>&nbsp&nbsp<p class="user">${mensagens[i].to}:</p>&nbsp&nbsp<div><p>${mensagens[i].text}</p><div/></div>`;
    } else if (mensagens[i].type == "private_message") {
      if (
        cadastrarNome == mensagens[i].to ||
        (cadastrarNome == mensagens[i].from && receiver == mensagens[i].to)
      ) {
        div.innerHTML += `<div class="private-message"><p class="hour">(${mensagens[i].time})</p>&nbsp&nbsp<p class="user">${mensagens[i].from}</p>&nbsp&nbsp<p>para</p>&nbsp&nbsp<p class="user">${mensagens[i].to}:</p>&nbsp&nbsp<p>${mensagens[i].text}</p></div>`;
      }
    }
    lastMessage();
  }
  cont2 = cont;
}
function lastMessage() {
  const element = document.querySelector(".chat").lastElementChild;
  if (element !== null) {
    element.scrollIntoView();
  }
}
//---------------------------------------------------------------
// Procurar Participantes
function findPeople() {
  const availableUsers = document.querySelector(".available-users");
  const promisse = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/participants"
  );
  promisse.then((dados) => {
    const participants = dados.data;
    for (let i = 0; i < participants.length; i++) {
      availableUsers.innerHTML += `<div><button onclick="selectedPerson(this)"><ion-icon name="person-circle"></ion-icon><p>${participants[i].name}</p></button></div>`;
    }
  });
  promisse.catch(() => console.log("Não foi possivel localizar pessoas"));
}
//---------------------------------------------------------------
// Escolher pessoas
function selectedPerson(person) {
  let checkSelectedPerson = document.querySelector(".available-users .check");
  if (checkSelectedPerson == null || checkSelectedPerson == "") {
    person.innerHTML += `<ion-icon class="check person" name="checkmark-outline" style="color:green"></ion-icon>`;
  } else {
    checkSelectedPerson.remove();
    person.innerHTML += `<ion-icon class="check person" name="checkmark-outline" style="color:green"></ion-icon>`;
  }
  const ppl = document.querySelector(".available-users .check").parentNode;
  receiver = ppl.querySelector("p").innerHTML;
}
//---------------------------------------------------------------
// sideBar
const sideBar = document.querySelector(".find-users");
const check = document.querySelector(".check");
let loadPeople;
function showSideBar() {
  loadPeople = setInterval(findPeople, 10000);
  sideBar.classList.remove("hidden");
  document.querySelector("body").classList.add("no-scroll");
}
function closeSideBar() {
  clearInterval(loadPeople);
  sideBar.classList.add("hidden");
  document.querySelector("body").classList.remove("no-scroll");
}
// Mostrar participantes
let checkPublic = "";
let checkPrivate = "";

// Logica dos checks do side bar
function enableCheck(element) {
  checkPublic = document.querySelector(".public .check");
  checkPrivate = document.querySelector(".private .check");
  if (checkPublic == null && checkPrivate == null) {
    element.innerHTML += `<ion-icon class="check" name="checkmark-outline" style="color:green"></ion-icon>`;
  } else if (checkPublic !== null && checkPrivate == null) {
    checkPublic.remove();
    console.log(receiver)
    if (receiver == "Todos") {
      typeMessage = "message";
    } else {
      typeMessage = "private_message";
    }
    element.innerHTML += `<ion-icon class="check" name="checkmark-outline" style="color:green"></ion-icon>`;
  } else if (checkPublic == null && checkPrivate !== null) {
    checkPrivate.remove();
    typeMessage = "message";
    element.innerHTML += `<ion-icon class="check" name="checkmark-outline" style="color:green"></ion-icon>`;
  }
}
//---------------------------------------------------------------
// Lógica do enter
document.addEventListener("keypress", function (element) {
  if (element.key === "Enter") {
    const btn = document.querySelector(".send");
    btn.click();
  }
});
//---------------------------------------------------------------
