let cadastrarNome = prompt("Qual é seu nome?");
let mensagens = [];
let cont = 0;
let cont2 = 0;
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
    setTimeout(searchMessages, 200)
    setInterval(enableConnection, 5000)
  })
  promise.catch(() => {
    cadastrarNome = prompt("Qual é seu nome?")
  });
}
// function loginSucess() {
//   setTimeout(searchMessages, 200);
//   setInterval(enableConnection, 5000);
//   console.log("Caiu aqui")
// }
// function loginFail(erro) {
//   cadastrarNome = prompt("Qual é seu nome?");
// }
//---------------------------------------------------------------

setInterval(searchMessages, 3000);
// Enviar Mensagem
function sendMessage() {
  const messageToSend = document.querySelector(".msg");
  if (messageToSend.value == null  || messageToSend.value == "") {
    return
  }
  const message = {
    from: cadastrarNome,
    to: "Todos",
    text: messageToSend.value,
    type: "message",
  };
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    message
  );
  promise.then(() => {
    document.querySelector(".msg").value = "";
    searchMessages()
  });
  promise.catch(() => console.log(`Deu erro na tua mensagem: ${erro.response.status}`));
}
// function messageSucess() {
//   searchMessages()
//   console.log(`sua mensagem  foi enviada com sucesso`);
//   document.querySelector(".msg").value = "";
// }
// function messageFail(erro) {
//   console.log(`Deu erro na tua mensagem: ${erro.response.status}`);
// }
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
    console.log("Conexão encerrada")
    window.location.reload()
  });
}
// function connectionEnable() {
//   console.log("Conexão mantida");
// }
// function connectionDisable() {
//   console.log("Erro na tentativa de conexão");
//   window.location.reload()
// }
//---------------------------------------------------------------

// Procurar Mensagens
function searchMessages() {
  const promisse = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promisse.then((dados) => {
    mensagens = dados.data
    renderMessages(mensagens)
  });
  promisse.catch(() => console.log("Erro no carregamento das mensages"));
}
// function messageArrived(dados) {
//   mensagens = dados.data;
//   console.log(mensagens)
//   renderMessages(mensagens);
// }
// function messageNotArrived(error) {
//   console.log("Erro no carregamento das mensagems");
// }
function renderMessages(mensagens) {
  cont++;
  if (cont !== cont2) {
    document.querySelector(".chat").innerText = ""
  }
  let div = document.querySelector(".chat");
  for (let i = 0; i < mensagens.length; i++) {
    if (mensagens[i].type == "status") {
      div.innerHTML += `<div class="log"><p class="hour">(${mensagens[i].time})</p>&nbsp&nbsp<p class="user">${mensagens[i].from}</p>&nbsp&nbsp<p>${mensagens[i].text}</p></div>`;
    } else if (mensagens[i].type == "message") {
      div.innerHTML += `<div class="message"><p class="hour">(${mensagens[i].time})</p>&nbsp&nbsp<p class="user">${mensagens[i].from}</p>&nbsp&nbsp<p>para</p>&nbsp&nbsp<p class="user">${mensagens[i].to}:</p>&nbsp&nbsp<div><p>${mensagens[i].text}</p><div/></div>`;
    } else if (mensagens[i].type == "private_message") {
      if (cadastrarNome == mensagens[i].to) {
        // console.log(cadastrarNome)
        // console.log(mensagens[i].to)
        div.innerHTML += `<div class="private-message"><p class="hour">(${mensagens[i].time})</p>&nbsp&nbsp<p class="user">${mensagens[i].from}</p>&nbsp&nbsp<p>para</p>&nbsp&nbsp<p class="user">${mensagens[i].to}:</p>&nbsp&nbsp<p>${mensagens[i].text}</p></div>`;
      }
    }
    lastMessage();
  }
  cont2 = cont
}
function lastMessage() {
  const element = document.querySelector(".chat").lastElementChild;
  element.scrollIntoView();
}
function cleanMessages() {
  const messages1 = (document.querySelector(`.log-${cont}`));
  const messages2 = (document.querySelector(`.message-${cont}`));
  const messages3 = (document.querySelector(`.private-message${cont}`));
  if (messages1 !== null) {
    messages1.innerText = ""
  } else if (messages2 !== null) {
    messages2.innerText = ""
  } else if (messages3 !== nul) {
    messages3.innerText = ""
  }
}
//---------------------------------------------------------------
// Procurar Participantes
function findPeople() {
  const availableUsers = document.querySelector(".available-users")
  const promisse = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/participants"
  );
  promisse.then(dados => { 
    const participants = dados.data
    console.log(participants)
    console.log(participants.name)
    for (let i = 0; i < participants.length; i++) {
      console.log(participants[i].name)
      console.log("caiuaqui ")
      availableUsers.innerHTML += `<div><ion-icon name="person-circle"></ion-icon><p>${participants[i].name}</p></div>` 
    }
  });
  
  promisse.catch(() => console.log("Não foi possivel localizar pessoas"));
}
//   function foundIt(dados) {
//     const participants = dados.data;
// }
// function notFoundIt() {
//   console.log("Não deu certo ):");
// }
//---------------------------------------------------------------
// sideBar
const sideBar = document.querySelector(".find-users")
const check = document.querySelector(".check")

function showSideBar() {
  sideBar.classList.remove("hidden")
  document.querySelector("body").classList.add("no-scroll")
}
function closeSideBar() {
  sideBar.classList.add("hidden")
  document.querySelector("body").classList.remove("no-scroll")
}
// Mostrar participantes

// Logica dos checks do side bar
function enableCheck(element) {
  const checkPublic = document.querySelector(".public .check")
  const checkPrivate = document.querySelector(".private .check")
  if (checkPublic == null && checkPrivate == null) {
    element.innerHTML += `<ion-icon class="check" name="checkmark-outline" style="color:green"></ion-icon>`
  } else if ((checkPublic !== null && checkPrivate == null)) {
    checkPublic.remove()
    element.innerHTML += `<ion-icon class="check" name="checkmark-outline" style="color:green"></ion-icon>`
  } else if ((checkPublic == null && checkPrivate !== null)) {
    checkPrivate.remove()
    element.innerHTML += `<ion-icon class="check" name="checkmark-outline" style="color:green"></ion-icon>`

  }
}
//---------------------------------------------------------------
// Lógica do enter
document.addEventListener("keypress", function (element) {
  if (element.key === "Enter") {
    const btn = document.querySelector(".send")
    btn.click()
  }
})
//---------------------------------------------------------------