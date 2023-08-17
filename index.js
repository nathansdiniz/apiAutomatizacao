//const puppeteer = require('puppeteer');
const path = require('path');
const moment = require('moment');
const puppeteer = require("puppeteer");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);

const express = require('express');


const app = express();
const ip = '45.166.188.99';
const port = 3000; // Ou a porta que você desejar

let perfil = '3r';
let pass;
switch (perfil){
  case "3r":
    perfil = "3r.producao";
    pass = '3r$igna2k22';
    break;
  case "ficasa":
    perfil = "3r.producao";
    pass = '3r$igna2k22';
    break;
  case "invest":
    perfil = "3r.producao";
    pass = '3r$igna2k22';
    break;
  default:
    perfil = null;
    pass = null;
    console.log("Perfil não encontrado"); 
}





// Configuração de middleware para permitir requisições JSON
app.use(express.json());

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Adicione os detalhes do usuário à solicitação
    next(); // Avance para o próximo middleware
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};


// Definir uma rota de exemplo
app.get('/',  (req, res) => {
    // Acesso autorizado, continue processando a solicitação
  res.json({ message: 'Acesso autorizado à rota protegida' });
  const hoje = moment();
  let ontem = moment().subtract(1, 'days');
  console.log(hoje.year());


  const formatoDesejado = 'DD/MM/YYYY';
  let dataFormatada = ontem.format(formatoDesejado);

  const Holidays = require('date-holidays');
  const hd = new Holidays('BR-DF');
  const holidays = hd.getHolidays(hoje.year()).filter((holiday) => holiday.type !== 'observance');
  const datasComemorativas = holidays.map((holiday) => {
    const data = new Date(holiday.date);
    return data.toLocaleDateString('pt-BR');
  });

  console.log(datasComemorativas);

  // Verifica se a data é segunda-feira
  console.log(hoje.format('dddd'));
  if(hoje.format(formatoDesejado) != datasComemorativas){
      if (hoje.format('dddd') === 'Monday') {
        // Pega a data anterior da sexta-feira
        const dataAnterior = hoje.subtract(3, 'days');

        // Imprime a data anterior
        console.log(dataFormatada = dataAnterior.format('DD/MM/YYYY'));
        abrirNavegador();
      } 
      else if (hoje.format('dddd') === 'Saturday') {
        // Pega a data anterior da sexta-feira
        const dataAnterior = hoje.subtract(1, 'days');

        // Imprime a data anterior
        console.log(dataFormatada = dataAnterior.format('DD/MM/YYYY'));
        abrirNavegador();
      }
      else if (hoje.format('dddd') === 'Sunday') {
      // Pega a data anterior da sexta-feira
      const dataAnterior = hoje.subtract(2, 'days');
    
      // Imprime a data anterior
      console.log(dataFormatada = dataAnterior.format('DD/MM/YYYY'));
      abrirNavegador();
      }

      else {
        // A data não é segunda-feira
      console.log('A data não é segunda-feira.');
      abrirNavegador();
      }
    }else if(hoje.format(formatoDesejado) == datasComemorativas){
        if (hoje.format('dddd') === 'Monday') {
          // Pega a data anterior da sexta-feira
          const dataAnterior = hoje.subtract(3, 'days');
    
          // Imprime a data anterior
          console.log(dataFormatada = dataAnterior.format('DD/MM/YYYY'));
          abrirNavegador();
        } 
        else if (hoje.format('dddd') === 'Saturday') {
          // Pega a data anterior da sexta-feira
          const dataAnterior = hoje.subtract(1, 'days');
    
          // Imprime a data anterior
          console.log(dataFormatada = dataAnterior.format('DD/MM/YYYY'));
          abrirNavegador();
        }
        else if (hoje.format('dddd') === 'Sunday') {
        // Pega a data anterior da sexta-feira
        const dataAnterior = hoje.subtract(2, 'days');
      
        // Imprime a data anterior
        console.log(dataFormatada = dataAnterior.format('DD/MM/YYYY'));
        abrirNavegador();
        
        }
    
        else {
          // A data não é segunda-feira
        console.log('A data não é segunda-feira.');
        abrirNavegador();
        }
    }

  else{
    console.log('Feriado!');
}






console.log(dataFormatada);





async function abrirNavegador() {
  const downloadPath = `C:/Users/natha/Downloads/3r/3r`
  const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
      
      
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(80000);
      const client = await page.target().createCDPSession()
      await client.send("Page.setDownloadBehavior", {
        defaultViewport: null,
        behavior: "allow",
        downloadPath: path.resolve(__dirname, downloadPath)
      });
      

      
    
  
    try{
        await page.goto ('https://sgcp.redepromotiva.com.br/portal/wplogin.aspx');
        new Promise(r => setTimeout(r, 10000));
        // Solicitar ao usuário que insira as credenciais de login
        
        await page.waitForSelector('[name="vLOGIN"]');
        await page.waitForSelector('[name="vSENHA"]');
      
        await page.evaluate(async () => {
          //const username = prompt('Insira seu nome de usuário:');
          //const password = prompt('Insira sua senha:');
      
          // Preencher os campos de login
          document.querySelector('[name="vLOGIN"]').value = '3r.producao';
          document.querySelector('[name="vSENHA"]').value = '3r$igna2k22';
      
          // Submeter o formulário de login
          document.querySelector('#ENTER').click();
        });
       

        await new Promise(r => setTimeout(r, 50000));
    
        await page.goto('https://sgcp.redepromotiva.com.br/portal/wpExibirArquivos_ext.aspx')
        await new Promise(r => setTimeout(r, 10000));
        await page.click('#BUTTON1')
    
        await new Promise(r => setTimeout(r, 10000));
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        await new Promise(r => setTimeout(r, 10000));
    
        idTabela = 'GrdarquivosContainer_0001Tbl';
        valorDesejado = dataFormatada
        const valorEncontrado = await page.evaluate((idTabela, valorDesejado) => {
        new Promise(r => setTimeout(r, 10000));
        const tabela = document.getElementById(idTabela);
        new Promise(r => setTimeout(r, 10000));
        const linhas = tabela.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
      const celulas = linhas[i].getElementsByTagName('td');

      for (let j = 0; j < celulas.length; j++) {
        if (celulas[j].textContent.trim() === valorDesejado) {
          const proximaColuna = celulas[j].nextElementSibling;
          const imagem = proximaColuna.querySelector('img');

          if (imagem) {
            // Faça o download do arquivo
            imagem.click();
            return true;
          }
        }
      }
    }

    return false;
  }, idTabela, valorDesejado);

  if (valorEncontrado) {
    console.log('Valor encontrado na tabela e imagem clicada.');
    setTimeout(function() {
      const lerArquivoRet = require('./teste')
    }, 30000);
    

    await page.goto('https://sgcp.redepromotiva.com.br/portal/wpgerararqcsv.aspx')
    new Promise(r => setTimeout(r, 10000)); 
    //const dataMes = document.getElementById('vMS');
    const mesAtual = moment().format('M');
    //const opcoesMes = dataMes.getElementsByTagName('option').value

    // Aguardar a página e o elemento <select> estarem prontos
    const idSelect = 'vMS';
    const mes = mesAtual;
    await page.waitForSelector(`select#${idSelect}`);

    // Selecionar o mês desejado no <select>
    await page.evaluate((idSelect, mes) => {
        const selectElement = document.getElementById(idSelect);
        selectElement.value = mes;
    }, idSelect, mes);

    // Aguardar um tempo para ver a seleção (opcional)
    new Promise(r => setTimeout(r, 10000)); 
    await page.click ('#BUTTON1')
    new Promise(r => setTimeout(r, 10000)); 


    // Aguardar o download concluir
       
  } else {
    console.log('Valor não encontrado na tabela ou imagem não encontrada.');
  }

  

} catch(error){
    console.log(error)
    console.log('Tempo de Solicitação esgotado.')
}


    
  //await browser.close();
  return true;

};

// Função para solicitar entrada do usuário
function prompt(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

});

// Iniciar o servidor

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});





