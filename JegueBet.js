
const game = document.getElementById("game");
const roleta = {
  frames: 0,
  quantidadeDeBlocos: 0,
  animationFrameId: null,
  podeRodar: true,
  rodando: false,
  estaParando: false,
  podeParar: false,
  areaRoleta: null,
  divRoleta: null,
  velocidade: 7,
  falsaEsperança: 50,
  numeroAtual: null,
  ultimoNumero: null,
  rigged: null,
  overlay: null,
};
const gerenciadorDeSaldo = {
  saldoAtual: parseInt(localStorage.getItem("saldo")) || 1000,
  valorApostado: null,
  areaAposta: null,
  areaSaldo: null,
  pAreaAposta: null,
  atualizarSaldo(novoValor, a) {
    this.saldoAtual = novoValor;
    a.innerText = "SALDO = " + this.saldoAtual;
  	localStorage.setItem("saldo", this.saldoAtual);
  }
};

// funcões relacionadas a criação do hud
criarHud();
function criarHud(){
	criarLogo();
  criarAreaRoleta();
  criarAreaSaldo();
  criarBotao("botaoPlay", "JOGAR", gerenciarAreaAposta);
  criarBotao("botaoI","", criarAreaInformacao);
}
function criarAreaRoleta(){
  roleta.areaRoleta = document.createElement("div");
  roleta.areaRoleta.classList.add("areaRoleta");
  game.appendChild(roleta.areaRoleta);
  roleta.divRoleta = document.createElement("div");
  roleta.divRoleta.classList.add("divRoleta");
  roleta.areaRoleta.appendChild(roleta.divRoleta);
}
function criarAreaSaldo(){
  gerenciadorDeSaldo.areaSaldo = document.createElement("div");
  gerenciadorDeSaldo.areaSaldo.classList.add("areaSaldo");
  game.appendChild(gerenciadorDeSaldo.areaSaldo);
  animarSurgir(gerenciadorDeSaldo.areaSaldo);
  gerenciadorDeSaldo.atualizarSaldo(gerenciadorDeSaldo.saldoAtual, gerenciadorDeSaldo.areaSaldo);
}
async function removerAreaSaldo(){
	animarFadein(gerenciadorDeSaldo.areaSaldo);
	await delay(1000); 
		gerenciadorDeSaldo.areaSaldo?.remove();
}
function criarLogo(){
	const logo = document.createElement("div");
	logo.classList.add("logo");
	game.appendChild(logo);
	animarSurgir(logo);
}

// funcões relacionadas a criação da area de informações 
async function criarAreaInformacao() {
	if (document.querySelector(".divInfo")){
		return;
	}
  const divInfo = document.createElement("div");
  divInfo.classList.add("divInfo", "glass");
  game.appendChild(divInfo);
  animarEntradaAreaInfo(divInfo);
  divInfo.style.pointerEvents = "none";
  await delay(1700);
  criarTextoInfo(divInfo);
  criarBotaoInfo(divInfo);
  
  divInfo.addEventListener("click",async () => {
  	animarSaidaAreaInfo(divInfo);
  });
}
async function animarEntradaAreaInfo(elemento){
	elemento.classList.add("minimizado");
	elemento.classList.add("entradaAreaIMinimizada");
	await delay(1000);
	elemento.classList.add("expandirAreaIMinimizada");
	elemento.classList.remove("minimizado");
	await delay(400);
	elemento.classList.remove("minimizado");
	await delay(900);
  elemento.style.pointerEvents = "auto";
}
async function animarSaidaAreaInfo(elemento){
	elemento.classList.add("minimizado");
	await delay(10);
	elemento.innerHTML = "";
	elemento.classList.add("sumirAreaI");
	await delay(2000);
	elemento.remove();
}
function criarTextoInfo(divInfo) {
  const tInfo = document.createElement("p");
  tInfo.classList.add("tInfo");
  tInfo.innerText = `Este projeto foi desenvolvido com o objetivo de conscientizar sobre como é fácil manipular resultados em jogos de aposta online. É importante entender que, apesar da aparência realista, aqui não há nenhuma operação financeira verdadeira: o "saldo" utilizado é apenas uma variável virtual, sem conexão com dinheiro real ou backend.

As imagens usadas foram geradas por inteligência artificial (ChatGPT) e não representam marcas ou serviços reais.

Este site não incentiva ou promove jogos de azar, cassinos ou casas de apostas. O intuito é alertar e educar sobre os riscos e as práticas obscuras que podem existir nesses ambientes.

Qualquer semelhança com sistemas de apostas reais é apenas para fins educacionais e não configura um convite ao jogo ou atividade comercial.

Desenvolvido por @I.rsept`;
  divInfo.appendChild(tInfo);
  animarSurgir(tInfo);
}
function criarBotaoInfo(divInfo){
	const botaoinfo = document.createElement("button");
	botaoinfo.classList.add("botaoInfo");
	botaoinfo.innerHTML = "Saldo = 1000";
	botaoinfo.addEventListener("click",async () => {
		botaoinfo.classList.add("hover");
    await delay(500);
    botaoinfo.classList.remove("hover");
		localStorage.clear();
		location.reload();
	});
	divInfo.appendChild(botaoinfo);
	animarSurgir(botaoinfo);
}

// funcões relacionadas ao gerenciamento do valor da aposta
async function gerenciarAreaAposta(){
	if (document.querySelector(".areaAposta")){
		return;
	}
  gerenciadorDeSaldo.areaAposta = document.createElement("div");
  gerenciadorDeSaldo.areaAposta.classList.add("areaAposta", "glass");
  game.appendChild(gerenciadorDeSaldo.areaAposta);
  gerenciadorDeSaldo.pAreaAposta = document.createElement("p");
  gerenciadorDeSaldo.pAreaAposta.classList.add("pAreaAposta");
  gerenciadorDeSaldo.areaAposta.appendChild(gerenciadorDeSaldo.pAreaAposta);
  animarEntradaAreaAposta(gerenciadorDeSaldo.areaAposta);
  removerAreaSaldo();
  gerenciadorDeSaldo.areaAposta.style.pointerEvents = "none";
  await delay(1000); 
    gerenciadorDeSaldo.atualizarSaldo(gerenciadorDeSaldo.saldoAtual, gerenciadorDeSaldo.pAreaAposta);
    criarBotoesDeAposta(gerenciadorDeSaldo.areaAposta);
    gerenciadorDeSaldo.areaAposta.addEventListener("click", () => {
    	document.querySelectorAll(".botaoAposta").forEach((ele) => {
  ele.style.pointerEvents = "none";
  animarFadein(ele);
});
  animarFadein(gerenciadorDeSaldo.pAreaAposta);
  animarSaidaAreaAposta(gerenciadorDeSaldo.areaAposta);
    });
}
async function animarEntradaAreaAposta(a) {
	animarSurgir(a);
  a.classList.add("minimizado");
  a.style.transform = "translateY(350)";
  await delay(150);
  a.style.transform = "translateY(-30%)";
  a.offsetHeight;
  await delay(200);
  a.style.transform = "translateY(0%)";
  await delay(150);
  a.classList.remove("minimizado");
  await delay(900);
  a.style.pointerEvents = "auto";
}

async function animarSaidaAreaAposta(a) {
  a.style.transform = "translateY(0%)";
  await delay(150);
  a.style.transform = "translateY(-30%)";
  await delay(200);
  a.style.transform = "translateY(150%)";
  a.offsetHeight;
  await delay(300);
  a.classList.add("minimizado");
  await delay(300);
  a.innerHTML = "";
  a.remove();
}
function criarBotaoDeAposta(valor, a){
  const botaoAposta = document.createElement("button");
  botaoAposta.classList.add("botaoAposta");
  a.appendChild(botaoAposta);
  botaoAposta.innerText = valor;
  animarSurgir(botaoAposta);
  botaoAposta.addEventListener("click", async () => {
    let novoValor = gerenciadorDeSaldo.saldoAtual - valor;
    gerenciadorDeSaldo.valorApostado = valor;
    gerenciadorDeSaldo.atualizarSaldo(novoValor, gerenciadorDeSaldo.pAreaAposta);
    animarFadein(gerenciadorDeSaldo.pAreaAposta);
    animarSaidaAreaAposta(gerenciadorDeSaldo.areaAposta);
    iniciarRoleta();
    document.querySelectorAll(".botaoAposta").forEach((ele) => {
  ele.style.pointerEvents = "none";
  animarFadein(ele);
});
  });
}
function criarBotoesDeAposta(a){
  criarBotaoDeAposta(50, a);
  criarBotaoDeAposta(100, a);
  criarBotaoDeAposta(250, a);
  criarBotaoDeAposta(500, a);
}

// funcões relacionadas a criação de numeros
function criarNumero(numeroAtual){
  const bloco = document.createElement("div");
  roleta.divRoleta.appendChild(bloco);
  bloco.innerText = numeroAtual;
  bloco.dataset.id = Date.now();
  blocosAtivos.push(bloco);
  let index = blocosAtivos.length - 1;
aplicarEstiloBloco(bloco, index);
  bloco.style.transform = "translateY(-40%)";
  bloco.style.opacity = "0";
  setTimeout(() =>{
    bloco.style.opacity = "1";
  }, 10);
}
function aplicarEstiloBloco(elemento, index) {
  let coluna = index % 3;
  let left = coluna * 80;

  elemento.classList.add("bloco-estilo");
  elemento.style.left = left + "px";
}
function gerarNumero(estado){
  if (estado === "repetir") {
    roleta.numeroAtual = roleta.ultimoNumero;
    criarNumero(roleta.numeroAtual);
  } else if(estado === "gerar"){
    roleta.numeroAtual = Math.floor(Math.random()*9) + 1;
    criarNumero(roleta.numeroAtual);
    roleta.ultimoNumero = roleta.numeroAtual;
  }
}
function gerarColuna(rigged){
  if (rigged){ 
    for (let i = 0; i < 3; i++) {
      gerarNumero("gerar");
    }
  } else if (!rigged){
    gerarNumero("gerar");
    gerarNumero("repetir");
    gerarNumero("repetir");
  }
}
function apagarBloco(){
  const blocoParaRemover = blocosAtivos.shift();
  if (blocoParaRemover) {
    blocoParaRemover.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
    blocoParaRemover.style.transform = "translateY(6%)";
    blocoParaRemover.style.opacity = "0";
    setTimeout(() => {
      blocoParaRemover.remove();
    }, 500);
  }
}
function gerenciarResultado(){
  let chance = Math.floor(Math.random() * 100) +1;
  if (chance > roleta.falsaEsperança) roleta.rigged = false; else roleta.rigged = true;
  if (roleta.rigged) {
    gerarColuna(true); 
  } else if (!roleta.rigged) {
    gerarColuna(false);
  }
}
function criarColunaAleatoria(){
  if (Math.random() < 0.99) {
    gerarColuna(!roleta.rigged);
  } else {
    gerarColuna(roleta.rigged);
  }
}

// funcões relacionadas a inicialização da roleta
function limparFocusRoleta(){
  roleta.overlay.style.opacity = "0";
  setTimeout (() => {
    roleta.overlay.remove();
  }, 2000);
}
function focusRoleta() {
  roleta.overlay = document.createElement("div");
  roleta.overlay.classList.add("overlay");
  game.appendChild(roleta.overlay);

  const jegue = document.createElement("div");
  jegue.classList.add("jegue");
  game.appendChild(jegue);
  jegue.style.transform = "translate(-50%, 100%)";

  setTimeout(() => {
    jegue.style.transform = "translate(-50%, 25%)";
    roleta.overlay.style.opacity = "1";
  }, 500);

  setTimeout(() => {
    jegue.style.transform = "translate(-50%, 500%)";
  }, 2000);

  setTimeout(() => {
    jegue.remove();
    roleta.overlay.style.zIndex = "4";
  }, 5000);
  setTimeout(() => {
  }, 5000);
}
function limparRoleta() {
  return new Promise((resolve, reject) => {
    roleta.quantidadeDeBlocos = 0;
    roleta.frames = 0;
    roleta.estaParando = false;
    roleta.podeParar = false;
    roleta.podeRodar = true;
    roleta.velocidade = 7;
    roleta.rigged = null;

    blocosAtivos.forEach((bloco) => {
      bloco.style.transition = "all 0.8s ease";
      bloco.style.opacity = "0";
    });

    setTimeout(() => {
      blocosAtivos.forEach((bloco) => {
        bloco.remove();
      });
      blocosAtivos.length = 0;
      resolve();
      focusRoleta();
    }, 500);
  });
}
function iniciarRoleta() {
  limparRoleta().then(() => {
    if (roleta.rodando) return;
    setTimeout(() => {
      requestAnimationFrame(animarRoleta);
      setTimeout(() => {
        roleta.estaParando = true;
      }, 3000);
    }, 1000);
  });
}
function animarRoleta(){
  const NUMERO_DE_FRAMES = 15;
  const LIMITE_DA_BORDA = 190;
  const LIMITE_DE_BLOCOS = 9;
  if (!roleta.podeRodar) return;
  roleta.rodando = true;
  roleta.frames ++;
  if (roleta.estaParando) roleta.velocidade = roleta.velocidade - 0.005;
  let posY;
  let novaPosY;
  blocosAtivos.forEach (bloco => {
    posY = parseFloat(bloco.style.top || '0px');
    novaPosY = posY + roleta.velocidade;
    bloco.style.top = novaPosY + "px";
  });
  while (blocosAtivos.length > 0 && blocosAtivos[0].offsetTop >= LIMITE_DA_BORDA && !roleta.podeParar) {
    apagarBloco();
  }
  let blocosAtivoslength = blocosAtivos.length;
  if (roleta.frames > NUMERO_DE_FRAMES && blocosAtivos.length < LIMITE_DE_BLOCOS){
    if (roleta.quantidadeDeBlocos <= 56){
      criarColunaAleatoria();
      roleta.quantidadeDeBlocos++
    } else if (roleta.quantidadeDeBlocos === 57){
      criarColunaAleatoria();
      roleta.quantidadeDeBlocos++
    } else if (roleta.quantidadeDeBlocos === 58){
      gerenciarResultado();
      roleta.quantidadeDeBlocos++
    } else if (roleta.quantidadeDeBlocos === 59){
      criarColunaAleatoria();
      roleta.quantidadeDeBlocos++
      roleta.podeParar = true;
    }
    roleta.frames = 0;
  }

  if (roleta.podeParar && blocosAtivos[0].offsetTop > 200){
    roleta.velocidade = 0;
    roleta.rodando = false;
    limparFocusRoleta();
    mostrarResultado(roleta.rigged)
    cancelAnimationFrame(roleta.animationFrameId);
    return
  }
  roleta.animationFrameId = requestAnimationFrame(animarRoleta);
}

// funcões relacionadas ao resultado
function criarElementosdoResultado(){
  const divResultado = document.createElement("div");
  divResultado.classList.add("divResultado", "glass");
  game.appendChild(divResultado);
  const h1Resultado = document.createElement("h1");
  h1Resultado.classList.add("h1Resultado");
  divResultado.appendChild(h1Resultado);
  const pResultado = document.createElement("p");
  pResultado.classList.add("pResultado");
  divResultado.appendChild(pResultado);
  return { divResultado, h1Resultado, pResultado };
}
function setarResultado(resultado){
  const { divResultado, h1Resultado, pResultado } = criarElementosdoResultado();
  if (resultado === "ganhou"){
    h1Resultado.innerText = "Você ganhou!";
    pResultado.innerText = "+" + gerenciadorDeSaldo.valorApostado * 2;
    pResultado.style.color = "lightgreen";
  } else if (resultado === "perdeu"){
    h1Resultado.innerText = "Você perdeu!";
    document.body.classList.add("shakeTela");
    setTimeout(() => {
      document.body.classList.remove("shakeTela");
    }, 1000);
    pResultado.innerText = "-" + gerenciadorDeSaldo.valorApostado;
    pResultado.style.color = "#c50f0f";
  }
  animarResultado(divResultado);
}
async function animarResultado(div){
  div.classList.add("animarNotfyEntrada")
  await delay(4000);
  div.classList.remove("animarNotfyEntrada")
  void div.offsetWidth;
  div.classList.add("animarNotfySaida");
  await delay(5000);
  div?.remove();
  
}
function mostrarResultado(rigged){
  if (rigged) {
    setarResultado("perdeu");
    calcularResultado("perdeu");
  }else if (!rigged){
    setarResultado("ganhou");
    calcularResultado("ganhou");
  }
  criarAreaSaldo();
}
function calcularResultado(resultado){
	if (resultado === "perdeu"){
		gerenciadorDeSaldo.saldoAtual -= gerenciadorDeSaldo.valorApostado;
		criarParticulaNumero("negativo", gerenciadorDeSaldo.valorApostado, "red", "areaSaldo")
	} else if (resultado === "ganhou"){
		gerenciadorDeSaldo.saldoAtual += gerenciadorDeSaldo.valorApostado * 2;
		criarParticulaNumero("positivo", gerenciadorDeSaldo.valorApostado * 2, "lightgreen", "areaSaldo")
	}
	gerenciadorDeSaldo.atualizarSaldo(gerenciadorDeSaldo.saldoAtual, gerenciadorDeSaldo.areaSaldo);
		gerenciadorDeSaldo.atualizarSaldo(gerenciadorDeSaldo.saldoAtual, gerenciadorDeSaldo.pAreaAposta);
}

// funcões relacionadas a criação de botões
async function criarBotao(tipo, texto, funcao) {
  const botao = document.createElement("button");
  botao.classList.add("botao");

  if (tipo === "botaoI") {
    botao.classList.add("botaoI");
    const Iicon = document.createElement("i");
    Iicon.classList.add("fa-solid", "fa-circle-info");
    botao.appendChild(Iicon);
    game.appendChild(botao);
  } else {
    botao.innerText = texto;
    const botaoDiv = document.createElement("div");
    botaoDiv.classList.add("botaoDiv");
    botaoDiv.appendChild(botao);
    game.appendChild(botaoDiv);
    animarSurgir(botaoDiv);
  }

  botao.addEventListener("click",async () => {
    funcao();
    botao.classList.add("hover");
    await delay(100);
    botao.classList.remove("hover");
  });
}

// funcao relacionada a animação
async function animarSurgir(elemento){
	elemento.classList.add("surgir");
  await delay(1500);
  elemento.classList.remove("surgir");
}
async function animarFadein(elemento){
	elemento.classList.add("fadein");
	await delay(1500);
  elemento.classList.remove("fadein");
}
function mesclarSurgireFadein(elemento){
	animarSurgir(elemento);
	animarFadein(elemento);
}
function delay(ms){
	return new Promise(resolve =>
	setTimeout(resolve, ms));
}
async function criarParticulaNumero(sinal, numero, cor, local){
	const numeroParticula = document.createElement("p");
 numeroParticula.classList.add(local);
 numeroParticula.style.color = cor;
 if (sinal === "negativo"){
 numeroParticula.innerText = "-" + numero;
 } else {
 numeroParticula.innerText = "+" + numero;
 }
 animarSurgir(numeroParticula);
 game.appendChild(numeroParticula);
 await delay(2000); 
 animarFadein(numeroParticula);
 await delay(500); 
 numeroParticula?.remove();
  }
