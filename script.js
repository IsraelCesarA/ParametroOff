function parseHM(s) {
    if (!s) return null;
    const [hh, mm] = s.split(':').map(Number);
    return hh * 60 + mm;
}

function fmtHM(minutos) {
    const total = ((Math.round(minutos) % (24 * 60)) + (24 * 60)) % (24 * 60);
    const hh = String(Math.floor(total / 60)).padStart(2, '0');
    const mm = String(total % 60).padStart(2, '0');
    return `${hh}:${mm}`;
}

function clearFields() {
    document.getElementById('tempo-viagem').innerText = '...';
    const inputs = document.querySelectorAll('.sub-category input');
    inputs.forEach(input => input.value = '');
}

function clearInputFields() {
    document.getElementById('linha').value = '';
    document.getElementById('tabela').value = '';
    document.getElementById('hora-inicial').value = '';
    document.getElementById('hora-final').value = '';
}

const calcularButton = document.getElementById('calcular');
const limparButton = document.getElementById('limpar');

// Para pular de campo com Enter facilmente
document.getElementById('linha').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('tabela').focus(); } });
document.getElementById('tabela').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('hora-inicial').focus(); } });
document.getElementById('hora-inicial').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('hora-final').focus(); } });
document.getElementById('hora-final').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); calcularButton.click(); } });


calcularButton.addEventListener('click', () => {
    clearFields();

    const horaInicialInputVal = document.getElementById('hora-inicial').value;
    const horaFinalInputVal = document.getElementById('hora-final').value;

    if (!horaInicialInputVal || !horaFinalInputVal) {
        alert('Por favor, preencha a Hora Inicial e a Hora Final manualmente.');
        return;
    }

    const horaInicial = parseHM(horaInicialInputVal);
    const horaFinal = parseHM(horaFinalInputVal);
    
    // Calcula o tempo de viagem (se virar a meia-noite, ajusta somando 24h)
    let tempoViagem = horaFinal - horaInicial;
    if (tempoViagem < 0) {
        tempoViagem += 24 * 60;
    }

    document.getElementById('tempo-viagem').innerText = tempoViagem;

    let params = {};
    
    // Configuração dos parâmetros 
    if (tempoViagem >= 0 && tempoViagem <= 30) {
        params = { adiantamento: 40, distorcao: 200, atraso25: 100, atraso100: 200 };
    } else if (tempoViagem > 30 && tempoViagem <= 60) {
        params = { adiantamento: 28, distorcao: 200, atraso25: 80, atraso100: 200 };
    } else if (tempoViagem > 60 && tempoViagem <= 200) {
        params = { adiantamento: 20, distorcao: 200, atraso25: 40, atraso100: 200 };
    } else {
        alert('Tempo de viagem fora do intervalo de 0 a 200 minutos.');
        return;
    }

    // Cálculos dos limites em minutos
    const adiantamentoLimiteMin = Math.round(tempoViagem * (params.adiantamento / 100));
    const distorcaoLimiteMin = Math.round(tempoViagem * (params.distorcao / 100));
    const atraso25LimiteMin = (params.atraso25 !== null) ? Math.round(tempoViagem * (params.atraso25 / 100)) : null;
    const atraso100LimiteMin = Math.round(tempoViagem * (params.atraso100 / 100));

    // Adiantamento (Subtrai da hora de referência)
    const saidaAdiantamento = horaInicial - adiantamentoLimiteMin;
    const chegadaAdiantamento = horaFinal - adiantamentoLimiteMin;
    
    const saidaAdiantamentoDist = horaInicial - distorcaoLimiteMin;
    const chegadaAdiantamentoDist = horaFinal - distorcaoLimiteMin;
    
    // Atraso (Soma na hora de referência)
    const saidaAtraso25 = (atraso25LimiteMin !== null) ? horaInicial + atraso25LimiteMin : null;
    const chegadaAtraso25 = (atraso25LimiteMin !== null) ? horaFinal + atraso25LimiteMin : null;
    
    const saidaAtraso100 = horaInicial + atraso100LimiteMin;
    const llegadaAtraso100 = horaFinal + atraso100LimiteMin;

    // Preenchimento dos blocos HTML
    if (tempoViagem >= 0 && tempoViagem <= 30) {
        document.getElementById('saida-0-30-25').value = fmtHM(saidaAtraso25);
        document.getElementById('chegada-0-30-25').value = fmtHM(chegadaAtraso25);
        document.getElementById('saida-0-30-100').value = fmtHM(saidaAtraso100);
        document.getElementById('chegada-0-30-100').value = fmtHM(llegadaAtraso100);
        document.getElementById('saida-0-30-ad').value = fmtHM(saidaAdiantamento);
        document.getElementById('chegada-0-30-ad').value = fmtHM(chegadaAdiantamento);
        document.getElementById('saida-0-30-ad-dist').value = fmtHM(saidaAdiantamentoDist);
        document.getElementById('chegada-0-30-ad-dist').value = fmtHM(chegadaAdiantamentoDist);
    } else if (tempoViagem > 30 && tempoViagem <= 60) {
        document.getElementById('saida-31-60-25').value = fmtHM(saidaAtraso25);
        document.getElementById('chegada-31-60-25').value = fmtHM(chegadaAtraso25);
        document.getElementById('saida-31-60-100').value = fmtHM(saidaAtraso100);
        document.getElementById('chegada-31-60-100').value = fmtHM(llegadaAtraso100);
        document.getElementById('saida-31-60-ad').value = fmtHM(saidaAdiantamento);
        document.getElementById('chegada-31-60-ad').value = fmtHM(chegadaAdiantamento);
        document.getElementById('saida-31-60-ad-dist').value = fmtHM(saidaAdiantamentoDist);
        document.getElementById('chegada-31-60-ad-dist').value = fmtHM(chegadaAdiantamentoDist);
    } else if (tempoViagem > 60 && tempoViagem <= 200) {
        document.getElementById('saida-61-200-25').value = fmtHM(saidaAtraso25);
        document.getElementById('chegada-61-200-25').value = fmtHM(chegadaAtraso25);
        document.getElementById('saida-61-200-100').value = fmtHM(saidaAtraso100);
        document.getElementById('chegada-61-200-100').value = fmtHM(llegadaAtraso100);
        document.getElementById('saida-61-200-ad').value = fmtHM(saidaAdiantamento);
        document.getElementById('chegada-61-200-ad').value = fmtHM(chegadaAdiantamento);
        document.getElementById('saida-61-200-ad-dist').value = fmtHM(saidaAdiantamentoDist);
        document.getElementById('chegada-61-200-ad-dist').value = fmtHM(chegadaAdiantamentoDist);
    }
});

limparButton.addEventListener('click', () => {
    clearInputFields();
    clearFields();
});
