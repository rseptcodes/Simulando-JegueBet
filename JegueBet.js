let blocosAtivos = [];
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
  falsaEsperança: 95,
  numeroAtual: null,
  ultimoNumero: null,
  rigged: null,
  overlay: null,
};
const gerenciadorDeSom = {
    plin: new Audio('Spin.wav'),
    win: new Audio('Win.wav'),
    unlocked: false,
    init() {
        this.plin.preload = 'auto';
        this.plin.volume = 0.6;
        this.win.preload = 'auto';
        this.win.volume = 0.6;
    },
    async unlockOnce() {
        if (this.unlocked) return;
        this.testSound('win',0.0001);
        this.testSound('plin',0.0001);
        this.unlocked = true;
    },
    async playPlin() {
        this.plin.currentTime = 0;
        await this.plin.play();
    },
    async playWin() {
        this.win.currentTime = 0;
        await this.win.play();
    },
    
    async testSound(audioName, testVolume = 0.1) {
        const audio = this[audioName];
        audio.volume = testVolume;
        audio.currentTime = 0;
        await audio.play();
        setTimeout(() => {
            audio.volume = 0.6;
        }, 3000); 
    }
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
gerenciadorDeSom.init();
function criarHud(){
	criarLogo();
  criarAreaRoleta();
  criarAreaSaldo();
  criarBotao("botaoPlay", "JOGAR", gerenciarAreaAposta);
  criarBotao("botaoI","", criarAreaInformacao);
  roleta.glowController = startGlow(3, 800);
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
	if (document.querySelector(".areaSaldo")){
		return;
	}
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

Qualquer semelhança com sistemas de apostas reais é apenas para fins educacionais e não configura um convite ao jogo ou atividade comercial.`;
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
  criarAreaSaldo()
    });
}
async function animarEntradaAreaAposta(a) {
  a.classList.add("minimizado");
  a.style.transform = "translateY(350%) translateX(-50%)";
  await delay(150);
  a.style.transform = "translateY(-30%) translateX(-50%)";
  a.offsetHeight;
  await delay(200);
  a.style.transform = "translateY(0%) translateX(-50%)";
  await delay(150);
  a.classList.remove("minimizado");
  await delay(900);
  a.style.pointerEvents = "auto";
}
async function animarSaidaAreaAposta(a) {
  a.style.transform = "translateY(0%) translateX(-50%)";
  await delay(150);
  a.style.transform = "translateY(-30%) translateX(-50%)";
  await delay(200);
  a.style.transform = "translateY(150%) translateX(-50%)";
  a.offsetHeight;
  await delay(300);
  a.classList.add("minimizado");
  await delay(200)
  a.style.transform = "translateY(350%) translateX(-50%)";
  await delay(500);
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
    roleta.glowController.abort();
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
async function focusRoleta() {
  roleta.overlay = document.createElement("div");
  roleta.overlay.classList.add("overlay");
  game.appendChild(roleta.overlay);

  const jegue = document.createElement("div");
  jegue.classList.add("jegue");
  game.appendChild(jegue);
  jegue.style.transform = "translate(-50%, 100%)";

  await delay(500);
    jegue.style.transform = "translate(-50%, 25%)";
    roleta.overlay.style.opacity = "1";
  await delay(2000);
    jegue.style.transform = "translate(-50%, 500%)";
  await delay(1000);
    jegue.remove();
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
  if (roleta.estaParando) roleta.velocidade = roleta.velocidade - 0.007;
  let posY;
  let novaPosY;
  blocosAtivos.forEach (bloco => {
    posY = parseFloat(bloco.style.top || '0px');
    novaPosY = posY + roleta.velocidade;
    bloco.style.top = novaPosY + "px";
  });
  while (blocosAtivos.length > 0 && blocosAtivos[0].offsetTop >= LIMITE_DA_BORDA && !roleta.podeParar) {
    apagarBloco();
    gerenciadorDeSom.playPlin();
  }
  let blocosAtivoslength = blocosAtivos.length;
  if (roleta.frames > NUMERO_DE_FRAMES && blocosAtivos.length < LIMITE_DE_BLOCOS){
    if (roleta.quantidadeDeBlocos <= 42){
      criarColunaAleatoria();
      roleta.quantidadeDeBlocos++
    } else if (roleta.quantidadeDeBlocos === 43){
      criarColunaAleatoria();
      roleta.quantidadeDeBlocos++
    } else if (roleta.quantidadeDeBlocos === 44){
      gerenciarResultado();
      roleta.quantidadeDeBlocos++
    } else if (roleta.quantidadeDeBlocos === 45){
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
async function setarResultado(resultado){
  const { divResultado, h1Resultado, pResultado } = criarElementosdoResultado();
  if (resultado === "ganhou"){
    h1Resultado.innerText = "Você ganhou!";
    gerenciadorDeSom.playWin();
    piscarNumeros();
    mostrarVinheta("rgba(0,255,0,0.5)");
    pResultado.innerText = "+" + gerenciadorDeSaldo.valorApostado * 2;
    pResultado.style.color = "#49e57dff";
  } else if (resultado === "perdeu"){
    h1Resultado.innerText = "Você perdeu!";
    mostrarVinheta("rgba(255,0,0,0.5)");
    
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
		criarParticulaNumero("negativo", gerenciadorDeSaldo.valorApostado, "red", "areaSaldo")
	} else if (resultado === "ganhou"){
		gerenciadorDeSaldo.saldoAtual += gerenciadorDeSaldo.valorApostado * 2;
		criarParticulaNumero("positivo", gerenciadorDeSaldo.valorApostado * 2, "#49e57dff", "areaSaldo")
		variarCriarMoedas();
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
    gerenciadorDeSom.unlockOnce();
    botao.classList.add("hover");
    await delay(100);
    botao.classList.remove("hover");
  });
}

// funcao relacionada a animação e UX
function delay(ms){
	return new Promise(resolve =>
	setTimeout(resolve, ms));
}
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
function mostrarVinheta(cor = "rgba(255,0,0,0.5)") {
  const vinheta = document.createElement("div");
  vinheta.classList.add("vinheta");
  vinheta.style.background = `radial-gradient(circle, rgba(0,0,0,0) 70%, ${cor} 100%)`;

  document.body.appendChild(vinheta);

  setTimeout(() => vinheta.remove(), 1000);
}
function criarMoeda(index) {
  const moeda = document.createElement("div");
  moeda.style.left = Math.random() * window.innerWidth + "px";
  moeda.classList.add("moedas");
  moeda.dataset.index = index;
  game.appendChild(moeda);
  return moeda;
}
async function criarVariasMoedas(quantidade) {
  for (let i = 0; i < quantidade; i++) {
    let moeda = criarMoeda(i);
    animarMoeda(moeda);
    if (i > 0) await delay(150);
  }
}
function variarCriarMoedas(){
	if (gerenciadorDeSaldo.valorApostado === 50){
		criarVariasMoedas(5);
	} else if (gerenciadorDeSaldo.valorApostado === 100){
		criarVariasMoedas(10);
	} else if (gerenciadorDeSaldo.valorApostado === 250){
		criarVariasMoedas(15);
	} else if (gerenciadorDeSaldo.valorApostado === 500){
		criarVariasMoedas(25);
	}
}
function animarMoeda(elemento) {
  let posY = -30;
  function cair() {
    posY += 5;
    elemento.style.top = posY + "px";
    if (posY > window.innerHeight + elemento.offsetHeight) {
      elemento.remove();
    } else {
      requestAnimationFrame(cair);
    }
  }

  requestAnimationFrame(cair)
}
function criarTextoRoleta(array){
	const roletaTexto = document.createElement("div");
	let roletaTextoPosY = array.length;
	roletaTexto.style.top = 83 * roletaTextoPosY + "px";
	roletaTexto.innerText = "JOGUE";
	roletaTexto.classList.add("roletaTexto");
	roleta.divRoleta.appendChild(roletaTexto);
	array.push(roletaTexto);
	return roletaTexto;
}
function criarVariosTextos(qtd, array){
	for (let i = 0; i < qtd; i++){
		criarTextoRoleta(array);
	}
}
function startGlow(qtd = 3, intervalo = 1500) {
  const controller = new AbortController();
  const signal = controller.signal;

  const roletaTextoArray = [];
  criarVariosTextos(qtd, roletaTextoArray);
  const n = roletaTextoArray.length;
  let i = 0;

  (async function loop() {
    while (!signal.aborted) {
      removerClassesTextosRoleta(roletaTextoArray);
      if (i < n) adicionarClasseTextoRoleta(roletaTextoArray[i]);

      await Promise.race([
        delay(intervalo),
        new Promise(resolve => signal.addEventListener('abort', resolve, { once: true }))
      ]);

      i = (i + 1) % (n + 1);
    }

    removerClassesTextosRoleta(roletaTextoArray);
    roletaTextoArray.forEach(el => animarFadein(el));
    await delay(1000);
    roletaTextoArray.forEach(el => el.remove());
  })();

  return controller;
}
function removerClassesTextosRoleta(array){
    array.forEach(elemento => {
		elemento.classList.remove("roletaTextoGlow");
	});
}
function adicionarClasseTextoRoleta(elemento){
	elemento.classList.add("roletaTextoGlow");
}
async function piscarNumeros(){
	blocosAtivos.forEach(elemento => {
		elemento.classList.add("piscar");
		setTimeout(() => {
		elemento.classList.remove("piscar");
		}, 5000);
	})
}