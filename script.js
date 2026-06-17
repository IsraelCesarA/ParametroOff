// Converte string de hora (ex: "14:30") para minutos totais
function parseHM(s) {
    if (!s) return null;
    const [hh, mm] = s.split(':').map(Number);
    return hh * 60 + mm;
}

// Converte minutos totais de volta para formato "HH:MM"
function fmtHM(minutos) {
    if (minutos === null || isNaN(minutos)) return '';
    // Lida com virada de dia (horas negativas ou acima de 24h)
    const total = ((Math.round(minutos) % (24 * 60)) + (24 * 60)) % (24 * 60);
    const hh = String(Math.floor(total / 60)).padStart(2, '0');
    const mm = String(total % 60).padStart(2, '0');
    return `${hh}:${mm}`;
}

// Limpa apenas os resultados da tela
function clearFields() {
    document.getElementById('tempo-viagem').innerText = '...';
    const inputs = document.querySelectorAll('.sub-category input');
    inputs.forEach(input => input.value = '');
}

// Limpa os campos de digitação do usuário
function clearInputFields() {
    document.getElementById('linha').value = '';
    document.getElementById('tabela').value = '';
    document.getElementById('hora-inicial').value = '';
    document.getElementById('hora-final').value = '';
}

const calcularButton = document.getElementById('calcular');
const limparButton = document.getElementById('limpar');

// Atalhos: Pressionar Enter pula para o próximo campo automaticamente
document.getElementById('linha').addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('tabela').focus(); } 
});
document.getElementById('tabela').addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('hora-inicial').focus(); } 
});
document.getElementById('hora-inicial').addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('hora-final').focus(); } 
});
document.getElementById('hora-final').addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') { e.preventDefault(); calcularButton.click(); } 
});

// Ação principal do botão Calcular
calcularButton.addEventListener('click', () => {
    clearFields();

    // Pega as horas digitadas manualmente
    const horaInicialInputVal = document.getElementById('hora-inicial').value;
    const horaFinalInputVal = document.getElementById('hora-final').value;

    if (!horaInicialInputVal || !horaFinalInputVal) {
        alert('Por favor, preencha a Hora Inicial e a Hora Final manualmente.');
        return;
    }

    const horaInicial = parseHM(horaInicialInputVal);
    const horaFinal = parseHM(horaFinalInputVal);
    
    // Calcula o tempo de viagem (se passou da meia-noite, ajusta somando 24h)
    let tempoViagem = horaFinal - horaInicial;
    if (tempoViagem < 0) {
        tempoViagem += 24 * 60;
    }

    // Exibe o tempo de viagem na tela
    document.getElementById('tempo-viagem').innerText = tempoViagem;

    let params = {};
    
    // Regras de tolerância com base na tabela (Distorção fixada em 200)
    if (tempoViagem >= 0 && tempoViagem <= 30) {
        params = { adiantamento: 40, distorcao: 200, atraso25: 100, atraso100: 200 };
    } else if (tempoViagem > 30 && tempoViagem <= 60) {
        params = { adiantamento: 28, distorcao: 200, atraso25: 80, atraso100: 200 };
    } else if (tempoViagem > 60 && tempoViagem <= 200) {
        params = { adiantamento: 20, distorcao: 200, atraso25: 40, atraso100: 200 };
    } else {
        alert('Tempo de viagem fora do intervalo de 0 a 200 minutos. Verifique as horas digitadas.');
        return;
    }

    // Cálculos da quantidade de minutos permitidos para cada limite
    const adiantamentoLimiteMin = Math.round(tempoViagem * (params.adiantamento / 100));
    const distorcaoLimiteMin = Math.round(tempoViagem * (params.distorcao / 100));
    const atraso25LimiteMin = Math.round(tempoViagem * (params.atraso25 / 100));
    const atraso100LimiteMin = Math.round(tempoViagem * (params.atraso100 / 100));

    // Cálculos reais de Hora: Adiantamento (Subtrai) e Atraso (Soma)
    const saidaAdiantamento = horaInicial - adiantamentoLimiteMin;
    const chegadaAdiantamento = horaFinal - adiantamentoLimiteMin;
    const saidaAdiantamentoDist = horaInicial - distorcaoLimiteMin;
    const chegadaAdiantamentoDist = horaFinal - distorcaoLimiteMin;
    
    const saidaAtraso25 = horaInicial + atraso25LimiteMin;
    const chegadaAtraso25 = horaFinal + atraso25LimiteMin;
    const saidaAtraso100 = horaInicial + atraso100LimiteMin;
    const chegadaAtraso100 = horaFinal + atraso100LimiteMin;

    // Distribui os resultados para os campos corretos baseado na duração da viagem
    if (tempoViagem >= 0 && tempoViagem <= 30) {
        document.getElementById('saida-0-30-25').value = fmtHM(saidaAtraso25);
        document.getElementById('chegada-0-30-25').value = fmtHM(chegadaAtraso25);
        document.getElementById('saida-0-30-100').value = fmtHM(saidaAtraso100);
        document.getElementById('chegada-0-30-100').value = fmtHM(chegadaAtraso100);
        
        document.getElementById('saida-0-30-ad').value = fmtHM(saidaAdiantamento);
        document.getElementById('chegada-0-30-ad').value = fmtHM(chegadaAdiantamento);
        document.getElementById('saida-0-30-ad-dist').value = fmtHM(saidaAdiantamentoDist);
        document.getElementById('chegada-0-30-ad-dist').value = fmtHM(chegadaAdiantamentoDist);
        
    } else if (tempoViagem > 30 && tempoViagem <= 60) {
        document.getElementById('saida-31-60-25').value = fmtHM(saidaAtraso25);
        document.getElementById('chegada-31-60-25').value = fmtHM(chegadaAtraso25);
        document.getElementById('saida-31-60-100').value = fmtHM(saidaAtraso100);
        document.getElementById('chegada-31-60-100').value = fmtHM(chegadaAtraso100);
        
        document.getElementById('saida-31-60-ad').value = fmtHM(saidaAdiantamento);
        document.getElementById('chegada-31-60-ad').value = fmtHM(chegadaAdiantamento);
        document.getElementById('saida-31-60-ad-dist').value = fmtHM(saidaAdiantamentoDist);
        document.getElementById('chegada-31-60-ad-dist').value = fmtHM(chegadaAdiantamentoDist);
        
    } else if (tempoViagem > 60 && tempoViagem <= 200) {
        document.getElementById('saida-61-200-25').value = fmtHM(saidaAtraso25);
        document.getElementById('chegada-61-200-25').value = fmtHM(chegadaAtraso25);
        document.getElementById('saida-61-200-100').value = fmtHM(saidaAtraso100);
        document.getElementById('chegada-61-200-100').value = fmtHM(chegadaAtraso100);
        
        document.getElementById('saida-61-200-ad').value = fmtHM(saidaAdiantamento);
        document.getElementById('chegada-61-200-ad').value = fmtHM(chegadaAdiantamento);
        document.getElementById('saida-61-200-ad-dist').value = fmtHM(saidaAdiantamentoDist);
        document.getElementById('chegada-61-200-ad-dist').value = fmtHM(chegadaAdiantamentoDist);
    }
});

// Ação do botão Limpar
limparButton.addEventListener('click', () => {
    clearInputFields();
    clearFields();
});
