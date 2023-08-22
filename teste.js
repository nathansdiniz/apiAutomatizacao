const fs = require('fs');
const { slice } = require('lodash');
const path = require('path');
const conexao = require('./mysql')
const pasta = './downloads';
const formatoDesejado = '.ret'; // Substitua pelo formato desejado, como '.txt', '.csv', '.json', etc.


let novoFormato = [];
let resultado;
let texto = [];
let valorLimpo = [];
const lerArquivoRet = fs.readdir(pasta, (err, arquivos) => {
    if (err) { console.error('Erro ao ler a pasta:', err);  return; }
  
    const arquivosNoFormatoDesejado = arquivos.filter(arquivo => path.extname(arquivo) === formatoDesejado);
  
    if (arquivosNoFormatoDesejado.length === 0) {
      console.log('Nenhum arquivo no formato desejado encontrado na pasta.');
      return;
    }
    
    const arquivoMaisRecente = arquivosNoFormatoDesejado.pop();
    console.log(arquivoMaisRecente);
    const caminhoArquivo = path.join(pasta, arquivoMaisRecente);
    // Ler a lista de valores na próxima execução
    let valoresArmazenados = [];
    valoresArmazenados = lerValoresDoArquivo();

    if (valoresArmazenados.includes(arquivoMaisRecente)){
        throw new Error('PROCESSO JÁ EXECUTADO.');
    }
    // Adicionar o novo valor à lista no arquivo
    adicionarValorAoArquivo(arquivoMaisRecente);

    
    console.log('Valores armazenados:', valoresArmazenados);
    
    fs.readFile(caminhoArquivo, 'utf8', (err, conteudo) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }
    texto = conteudo;
    let tipoArquivo = texto.slice(12,18);
    console.log(`Tipo Arquivo: ${tipoArquivo}`);
    switch (tipoArquivo){
        case "CBF801": 
        console.log("O arquivo é um CBF801");
        resultado = CBF801();
        break;
        case "CBO558":
            console.log("O arquivo é um CBO558");
            CBO558();
            break;
        case "CBO561":
            console.log("O arquivo é um CBO561");
            CBO561();
            break;
        case "CBO562":
            console.log("O arquivo é um CBO562");
            CBO562();
            break;
        case "CBG242":
            console.log("O arquivo é um CBG242");
            CBG242();
            break;
        default :
            console.log ("Erro ao ler o arquivo!");
    }

    const linhas = resultado.split('\n');
    const linhasConcatenadas = [];

    for (let i = 0; i < linhas.length; i++) {
        const linhaAtual = linhas[i].replace(/\s+/g, ' ');

        if (i > 0 && !(linhaAtual.startsWith('0') || linhaAtual.startsWith('1') || linhaAtual.startsWith('2') || linhaAtual.startsWith('8'))) {
            
            linhasConcatenadas[linhasConcatenadas.length - 1] += linhaAtual;

        } else {
            linhasConcatenadas.push(linhaAtual);
            
        }
    }

    const novoConteudo = linhasConcatenadas.join('\n');
    console.log(novoConteudo);
    let valorLimpo = [];

    
    novoConteudo.split('\n').forEach(linha => {
        if(linha.slice(0,1) === '2'){
            const partes = linha.split(';');
            const excluiParte15 = partes[15];
            partes.splice(partes.indexOf(excluiParte15), 1);
            valorLimpo.push(partes);
        }else{
            return false;
        }

    });

    let linha = []
    for (linha of valorLimpo) {
        let dadosSeparados = [linha]
        //dadosSeparados = dadosSeparados.split(',');
        const query = 'INSERT INTO credito (Tipo, Banco, DataTransacao, Agencia, ChaveOperador, SequenciaOperador, CodigoTransacao, DataMovimentacao, HoraMovimentacao, Valor, Loja, PDV, FormLiquidacao, SituacaoDoc, RetornoCorrespondente, Linha, Convenio, Proposta, TipoLiberacao, Parcelas, PropostaVinc, Troco) VALUES (?)';

        conexao.query(query, dadosSeparados , (err, results, fields) => {
             if (err) return null;
             adicionarValorAoArquivo(arquivoMaisRecente);
             console.log('Resultados da consulta:', results);});
    };
    });
});

module.exports = lerArquivoRet;




    // Função para adicionar um valor à lista de valores no arquivo
function adicionarValorAoArquivo(novoValor) {
        try {
            const valoresAnteriores = lerValoresDoArquivo();
            const valoresAtualizados = [...valoresAnteriores, novoValor];
            fs.writeFileSync('meus_valores.txt', valoresAtualizados.join(','));
        } catch (error) {console.error('Erro ao adicionar valor:', error); }
}
    // Função para ler a lista de valores do arquivo
function lerValoresDoArquivo() {
        try {const conteudo = fs.readFileSync('meus_valores.txt', 'utf8');
            if (conteudo) { return conteudo.split(',');
            } else { return [];}
        } catch (error) { return []; }
 }


function CBF801(){
    texto.split('\n').forEach(linha => {
        if (linha.substring(4, 8).includes('2023')) {
            let parte8;
            let parte9;
            let parte1 = linha.substring(0, 1);
            let parte2 = linha.substring(1, 4);
            let parte3 = `${linha.substring(10, 12)}/${linha.substring(8, 10)}/${linha.substring(4, 8)}`;
            let parte4 = linha.substring(12, 16);
            let parte5 = linha.substring(16, 24);
            let parte6 = linha.substring(24, 28);
            let parte7 = linha.substring(28, 31);
            if (linha.substring(31, 35).includes('2023')) {
                parte8 = `${linha.substring(37, 39)}/${linha.substring(35, 37)}/${linha.substring(31, 35)}`;
                parte9 = linha.substring(39, 41) + ':' + linha.substring(41, 43) + ':' + linha.substring(43, 45);
            }
            else{parte8 = `${linha.substring(31, 39)}`;
                 parte9 = linha.substring(39, 45);
            };
          
            let valor801 = linha.slice(45, 60);
            //let parte11 = linha.slice(60,62);
            let loja801 = linha.slice(62, 66);
            let empresa = linha.slice(66, 70);
            let formLiqui801 = linha.slice(70, 72);
            let sitDoc801 = linha.slice(72, 75);
            let retCorresp801 = linha.slice(75, 80);
            let parte20 = linha.slice(80,100)
            // Continuar com as demais partes...
    
            let novaLinha = `${parte1};${parte2};${parte3};${parte4};${parte5};${parte6};${parte7};${parte8};${parte9}; ${valor801}; ${loja801}; ${empresa}; ${formLiqui801}; ${sitDoc801}; ${retCorresp801}; ${parte20}`; // Continuar com as demais partes
            novoFormato.push(novaLinha);
            
        }
        else {
            let parte21 = linha.slice(0,1);
            let parte22 = linha.slice(1,5);
            let parte23 = linha.slice(5,14);
            let parte24 = linha.slice(14,23); 
            let parte25 = linha.slice(23,27);
            let parte26 = linha.slice(27,31);
            let parte27 = linha.slice(31,39);
            let parte28 = linha.slice(39, 55);
            let parte29 = linha.slice(55, 57);
            let parte30 = linha.slice(57, 61);
            let parte31 = linha.slice(61, 65);
            let parte32 = linha.slice(65, 66);
            let parte33 = linha.slice(66, 70);
            let parte34 = linha.slice(70, 75);
            let parte35 = linha.slice(75, 90);
            let parte36 = linha.slice(90, 92);
            let parte37 = linha.slice(92, 95);
            let parte38 = linha.slice(95,99);
            let novaLinha = `${parte21}; ${parte22}; ${parte23};${parte24};${parte25};${parte26};${parte27}; ${parte28}`; 
    
            novoFormato.push(novaLinha);
        }
    });
    
    return novoFormato.join('\n');
}

function CBO558(){
    texto.split('\n').forEach(linha => {
        if (linha.substring(4, 8).includes('2023')) {
            let parte8;
            let parte9;
            let parte1 = linha.substring(0, 2);
            let parte2 = linha.substring(2, 8);
            let parte3 = `${linha.substring(8, 17)}`;
            let parte4 = linha.substring(17, 26);
            let parte5 = linha.substring(26, 35);
            let parte6 = linha.substring(35, 44);
            let parte7 = linha.substring(44, 53);
                parte8 = `${linha.substring(53, 68)}`;
                parte9 = linha.substring(68, 72);
            let parte10 = `${linha.substring(72, 81)}`;
            let parte11 = linha.substring(81, 85);
          
            let parte12 = linha.slice(85, 102);
            let parte13 = linha.slice(102, 110);
            let parte14 = `${linha.substring(110, 114)}/${linha.substring(114, 116)}/${linha.substring(116, 118)}`;
            let parte15 = linha.slice(120, 125);
            let parte16 = linha.slice(125, 130);
            let parte17 = linha.slice(130, 139);
            let parte18 = linha.slice(139, 150);
            let parte19 = linha.slice(150, 155);
            let parte20 = linha.slice(155, 159);
            let parte21 = linha.slice(159, 163);
            // Continuar com as demais partes...
    
            let novaLinha = `${parte1};${parte2};${parte3};${parte4};${parte5};${parte6};${parte7};${parte8};${parte9}; ${parte10}; ${parte11}; ${parte12}; ${parte13}; ${parte14}; ${parte15}; ${parte16}; ${parte17}; ${parte18}; ${parte19}; ${parte20};  ${parte21};`; // Continuar com as demais partes
            novoFormato.push(novaLinha);
            
        }
        else {
            let parte21 = linha.slice(0,1);
            let parte22 = linha.slice(1,5);
            let parte23 = linha.slice(5,14);
            let parte24 = linha.slice(14,23); 
            let parte25 = linha.slice(23,27);
            let parte26 = linha.slice(27,31);
            let parte27 = linha.slice(31,39);
            let parte28 = linha.slice(39, 55);
            let parte29 = linha.slice(55, 57);
            let parte30 = linha.slice(57, 61);
            let parte31 = linha.slice(61, 65);
            let parte32 = linha.slice(65, 66);
            let parte33 = linha.slice(66, 70);
            let parte34 = linha.slice(70, 75);
            let parte35 = linha.slice(75, 90);
            let parte36 = linha.slice(90, 92);
            let parte37 = linha.slice(92, 95);
            let parte38 = linha.slice(95,99);
            let novaLinha = `${parte22};${parte23};${parte24};${parte25};${parte26};${parte27};${parte28};${parte29}; ${parte30}; ${parte31}; ${parte32}; ${parte33}; ${parte34}; ${parte35}; ${parte36}; ${parte37}; ${parte38};`; 
    
            novoFormato.push(novaLinha);
        }
    });
    
    console.log(novoFormato.join('\n'));
    
}

function CBO561(){
    texto.split('\n').forEach(linha => {
        if (linha.substring(4, 8).includes('2023')) {
            let parte8;
            let parte9;
            let parte1 = linha.substring(0, 2);
            let parte2 = linha.substring(2, 8);
            let parte3 = `${linha.substring(8, 17)}`;
            let parte4 = linha.substring(17, 23);
            let parte5 = linha.substring(23, 35);
            let parte6 = linha.substring(35, 43);
            let parte7 = linha.substring(45, 54);
                parte8 = `${linha.substring(54, 71)}`;
                parte9 = linha.substring(71, 75);
            let parte10 = `${linha.substring(75, 84)}`;
            let parte11 = linha.substring(84, 88);
          
            let parte12 = linha.slice(88, 105);
            let parte13 = `${linha.substring(113, 117)}/${linha.substring(117, 119)}/${linha.substring(119, 121)}`;
            let parte14 = linha.slice(123, 128);
            let parte15 = linha.slice(128, 133);
            let parte16 = linha.slice(133, 137);
            let parte17 = linha.slice(137, 141);
          
            // Continuar com as demais partes...
    
            let novaLinha = `${parte1};${parte2};${parte3};${parte4};${parte5};${parte6};${parte7};${parte8};${parte9}; ${parte10}; ${parte11}; ${parte12}; ${parte13}; ${parte14}; ${parte15}; ${parte16}; ${parte17};`; // Continuar com as demais partes
            novoFormato.push(novaLinha);
            
        }
        else {
            let parte21 = linha.slice(0,1);
            let parte22 = linha.slice(1,5);
            let parte23 = linha.slice(5,14);
            let parte24 = linha.slice(14,23); 
            let parte25 = linha.slice(23,27);
            let parte26 = linha.slice(27,31);
            let parte27 = linha.slice(31,39);
            let parte28 = linha.slice(39, 55);
            let parte29 = linha.slice(55, 57);
            let parte30 = linha.slice(57, 61);
            let parte31 = linha.slice(61, 65);
            let parte32 = linha.slice(65, 66);
            let parte33 = linha.slice(66, 70);
            let parte34 = linha.slice(70, 75);
            let parte35 = linha.slice(75, 90);
            let parte36 = linha.slice(90, 92);
            let parte37 = linha.slice(92, 95);
            let parte38 = linha.slice(95,99);
            let novaLinha = `${parte22};${parte23};${parte24};${parte25};${parte26};${parte27};${parte28};${parte29}; ${parte30}; ${parte31}; ${parte32}; ${parte33}; ${parte34}; ${parte35}; ${parte36}; ${parte37}; ${parte38};`; 
    
            novoFormato.push(novaLinha);
        }
    });
    
    console.log(novoFormato.join('\n'));
    
}

function CBO562(){
    texto.split('\n').forEach(linha => {
        if (linha.substring(4, 8).includes('2023')) {
            let parte8;
            let parte9;
            let parte1 = linha.substring(0, 2);
            let parte2 = linha.substring(2, 8);
            let parte3 = `${linha.substring(8, 17)}`;
            let parte4 = linha.substring(17, 26);
            let parte5 = linha.substring(26, 35);
            let parte6 = linha.substring(35, 39);
            let parte7 = linha.substring(39, 50);
                parte8 = `${linha.substring(50, 58)}`;
                parte9 = linha.substring(58, 62);
            let parte10 = `${linha.substring(62, 66)}/${linha.substring(66, 68)}/${linha.substring(68, 70)}`;
            let parte11 = linha.substring(72, 77);
            let parte12 = linha.slice(77, 82);
    
            let novaLinha = `${parte1};${parte2};${parte3};${parte4};${parte5};${parte6};${parte7};${parte8};${parte9}; ${parte10}; ${parte11}; ${parte12}; `; // Continuar com as demais partes
            novoFormato.push(novaLinha);
            
        }
        else {
            let parte21 = linha.slice(0,1);
            let parte22 = linha.slice(1,5);
            let parte23 = linha.slice(5,14);
            let parte24 = linha.slice(14,23); 
            let parte25 = linha.slice(23,27);
            let parte26 = linha.slice(27,31);
            let parte27 = linha.slice(31,39);
            let parte28 = linha.slice(39, 55);
            let parte29 = linha.slice(55, 57);
            let parte30 = linha.slice(57, 61);
            let parte31 = linha.slice(61, 65);
            let parte32 = linha.slice(65, 66);
            let parte33 = linha.slice(66, 70);
            let parte34 = linha.slice(70, 75);
            let parte35 = linha.slice(75, 90);
            let parte36 = linha.slice(90, 92);
            let parte37 = linha.slice(92, 95);
            let parte38 = linha.slice(95,99);
            let novaLinha = `${parte22};${parte23};${parte24};${parte25};${parte26};${parte27};${parte28};${parte29}; ${parte30}; ${parte31}; ${parte32}; ${parte33}; ${parte34}; ${parte35}; ${parte36}; ${parte37}; ${parte38};`; 
    
            novoFormato.push(novaLinha);
        }
    });
    
    console.log(novoFormato.join('\n'));
    
}

function CBG242(){
    texto.split('\n').forEach(linha => {
        if (linha.substring(0, 1).includes('2')) {
            let parte8;
            let parte9;
            let parte1 = linha.substring(0, 1);
            let parte2 = linha.substring(1, 10);
            let parte3 = `${linha.substring(10, 19)}`;
            let parte4 = linha.substring(19, 28);
            let parte5 = linha.substring(28, 37);
            let parte6 = linha.substring(37, 46);
            let parte7 = linha.substring(46, 54);
                parte8 = `${linha.substring(54, 69)}`;
                parte9 = linha.substring(69, 79);
            let parte10 = `${linha.substring(69, 73)}/${linha.substring(73, 75)}/${linha.substring(75, 77)}`;
            let parte11 = linha.substring(79, 83);
            let parte12 = linha.slice(83, 87);
            let parte13 = linha.slice(87, 91);
            let parte14 = linha.slice(91, 95);
    
            let novaLinha = `${parte1};${parte2};${parte3};${parte4};${parte5};${parte6};${parte7};${parte8};${parte9}; ${parte10}; ${parte11}; ${parte12}; ${parte13}; ${parte14}; `; // Continuar com as demais partes
            novoFormato.push(novaLinha);
            
        }
        else {
            let parte21 = linha.slice(0,1);
            let parte22 = linha.slice(1,5);
            let parte23 = linha.slice(5,14);
            let parte24 = linha.slice(14,23); 
            let parte25 = linha.slice(23,27);
            let parte26 = linha.slice(27,31);
            let parte27 = linha.slice(31,39);
            let parte28 = linha.slice(39, 55);
            let parte29 = linha.slice(55, 57);
            let parte30 = linha.slice(57, 61);
            let parte31 = linha.slice(61, 65);
            let parte32 = linha.slice(65, 66);
            let parte33 = linha.slice(66, 70);
            let parte34 = linha.slice(70, 75);
            let parte35 = linha.slice(75, 90);
            let parte36 = linha.slice(90, 92);
            let parte37 = linha.slice(92, 95);
            let parte38 = linha.slice(95,99);
            let novaLinha = `${parte22};${parte23};${parte24};${parte25};${parte26};${parte27};${parte28};${parte29}; ${parte30}; ${parte31}; ${parte32}; ${parte33}; ${parte34}; ${parte35}; ${parte36}; ${parte37}; ${parte38};`; 
    
            novoFormato.push(novaLinha);
        }
    });
    
    console.log(novoFormato.join('\n'));
    
}









