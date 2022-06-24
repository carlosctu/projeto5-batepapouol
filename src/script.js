let cadastrarNome = prompt("Qual é seu nome?");
let mensagens = [];
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
  promise.then(loginSucess(nome));
  promise.catch(loginFail);
}
function loginSucess() {
  setInterval(enableConnection, 5000);
  //   setInterval(searchMessages, 5000);
}
function loginFail(erro) {
  cadastrarNome = prompt("Qual é seu nome?");
}
//---------------------------------------------------------------
setTimeout(searchMessages, 500);
// Enviar Mensagem
function sendMessage() {
  const messageToSend = document.querySelector(".msg");

  const message = {
    from: cadastrarNome,
    to: "Todos",
    text: messageToSend.value,
    type: "message",
  };
  console.log(message);
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    message
  );
  promise.then(messageSucess);
  promise.catch(messageFail);
}
function messageSucess() {
  console.log(`sua mensagem  foi enviada com sucesso`);
}
function messageFail(erro) {
  console.log(`Deu erro na tua mensagem: ${erro.response.status}`);
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
  promisse.then(connectionEnable);
  promisse.catch(connectionDisable);
}
function connectionEnable() {
  console.log("Conexão mantida");
}
function connectionDisable() {
  console.log("Erro na tentativa de conexão");
}
//---------------------------------------------------------------

// Procurar Mensagens
function searchMessages() {
  const promisse = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  promisse.then(messageArrived);
  promisse.catch(messageNotArrived);
}
function messageArrived(dados) {
  mensagens = dados.data;
  renderMessages(mensagens);
}
function messageNotArrived(error) {
  console.log("Erro no carregamento das mensagems");
}
function renderMessages(mensagens) {
  let div = document.querySelector(".chat");
  for (let i = 0; i < mensagens.length; i++) {
    if (mensagens[i].type == "status") {
      div.innerHTML += `<div class="log"><p class="hour">(${mensagens[i].time})</p>&nbsp&nbsp<p class="user">${mensagens[i].from}</p>&nbsp&nbsp<p>${mensagens[i].text}</p></div>`;
    } else if (mensagens[i].type == "message") {
      div.innerHTML += `<div class="message"><p class="hour">(${mensagens[i].time})</p>&nbsp&nbsp<p class="user">${mensagens[i].from}</p>&nbsp&nbsp<p>para</p>&nbsp&nbsp<p class="user">${mensagens[i].to}:</p>&nbsp&nbsp<div><p>${mensagens[i].text}</p><div/></div>`;
    } else if (mensagens[i].type == "private_message") {
      div.innerHTML += `<div class="private-message"><p class="hour">(${mensagens[i].time})</p>&nbsp&nbsp<p class="user">${mensagens[i].from}</p>&nbsp&nbsp<p>para</p>&nbsp&nbsp<p class="user">${mensagens[i].to}:</p>&nbsp&nbsp<p>${mensagens[i].text}</p></div>`;
    }
    lastMessage();
  }
}
function lastMessage() {
    const element = document.querySelector(".chat").lastElementChild
    element.scrollIntoView()
}
//---------------------------------------------------------------

// Procurar Participantes

//---------------------------------------------------------------