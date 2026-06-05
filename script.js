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

calcularButton.addEventListener('click', () => {
    clearFields();

    const horaInicialInputVal = document.getElementById('hora-inicial').value;
    const horaFinalInputVal = document.getElementById('hora-final').value;

    if (!horaInicialInputVal || !horaFinalInputVal) {
        alert('Por favor, preencha a Hora Inicial e a Hora Final para realizar o cálculo.');
        return;
    }

    const horaInicial = parseHM(horaInicialInputVal);
    const horaFinal = parseHM(horaFinalInputVal);
    
    // Cálculo do tempo de viagem considerando virada de noite
    let tempoViagem = horaFinal - horaInicial;
    if (tempoViagem < 0) {
        tempoViagem += 24 * 60;
    }

    document.getElementById('tempo-viagem').innerText = tempoViagem;

    let params = {};
    if (tempoViagem >= 0 && tempoViagem <= 30) {
        params = { adiantamento: 40, atraso25: null, atraso100: 120 };
    } else if (tempoViagem > 30 && tempoViagem <= 60) {
        params = { adiantamento: 28, atraso25: 80, atraso100: 120 };
    } else if (tempoViagem > 60 && tempoViagem <= 200) {
        params = { adiantamento: 20, atraso25: 40, atraso100: 120 };
    } else {
        alert('Tempo de viagem fora do intervalo configurado (0 a 200 minutos).');
        return;
    }

    const adiantamentoLimiteMin = Math.round(tempoViagem * (params.adiantamento / 100));
    const atraso25LimiteMin = (params.atraso25 !== null) ? Math.round(tempoViagem * (params.atraso25 / 100)) : null;
    const atraso100LimiteMin = Math.round(tempoViagem * (params.atraso100 / 100));

    const saidaAdiantamento = horaInicial - adiantamentoLimiteMin;
    const chegadaAdiantamento = horaFinal - adiantamentoLimiteMin;
    
    const saidaAtraso25 = (atraso25LimiteMin !== null) ? horaInicial + atraso25LimiteMin : null;
    const chegadaAtraso25 = (atraso25LimiteMin !== null) ? horaFinal + atraso25LimiteMin : null;
    
    const saidaAtraso100 = horaInicial + atraso100LimiteMin;
    const chegadaAtraso100 = horaFinal + atraso100LimiteMin;

    document.querySelectorAll('.sub-category input').forEach(input => input.value = '');
    
    // Preenchimento dos resultados baseado no tempo de viagem
    if (tempoViagem >= 0 && tempoViagem <= 30) {
        document.getElementById('saida-0-30-100').value = fmtHM(saidaAtraso100);
        document.getElementById('chegada-0-30-100').value = fmtHM(chegadaAtraso100);
        document.getElementById('saida-0-30-ad').value = fmtHM(saidaAdiantamento);
        document.getElementById('chegada-0-30-ad').value = fmtHM(chegadaAdiantamento);
    } else if (tempoViagem > 30 && tempoViagem <= 60) {
        document.getElementById('saida-31-60-25').value = fmtHM(saidaAtraso25);
        document.getElementById('chegada-31-60-25').value = fmtHM(chegadaAtraso25);
        document.getElementById('saida-31-60-100').value = fmtHM(saidaAtraso100);
        document.getElementById('chegada-31-60-100').value = fmtHM(chegadaAtraso100);
        document.getElementById('saida-31-60-ad').value = fmtHM(saidaAdiantamento);
        document.getElementById('chegada-31-60-ad').value = fmtHM(chegadaAdiantamento);
    } else if (tempoViagem > 60 && tempoViagem <= 200) {
        document.getElementById('saida-61-200-25').value = fmtHM(saidaAtraso25);
        document.getElementById('chegada-61-200-25').value = fmtHM(chegadaAtraso25);
        document.getElementById('saida-61-200-100').value = fmtHM(saidaAtraso100);
        document.getElementById('chegada-61-200-100').value = fmtHM(chegadaAtraso100);
        document.getElementById('saida-61-200-ad').value = fmtHM(saidaAdiantamento);
        document.getElementById('chegada-61-200-ad').value = fmtHM(chegadaAdiantamento);
    }
});

limparButton.addEventListener('click', () => {
    clearInputFields();
    clearFields();
});
