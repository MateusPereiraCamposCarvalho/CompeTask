import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  closeOutline,
  hourglassOutline,
  pauseOutline,
  peopleOutline,
  personOutline,
  playOutline,
  stopOutline,
  timerOutline,
} from 'ionicons/icons';

import { TarefaModel } from '../../models/tarefa.model';
import { TarefasService } from '../../services/tarefas.service';
import { UsuarioService } from '../../services/usuario.service';

type AtalhoRodape = {
  label: string;
  icon: string;
  rota?: string;
  ativo?: boolean;
};

type AbaTimer = 'cronometro' | 'timer';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.page.html',
  styleUrls: ['./timer.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon],
})
export class TimerPage implements OnDestroy {
  abaAtual: AbaTimer = 'cronometro';
  rodando = false;
  modalSalvarAberto = false;
  mensagemAcao = '';
  mensagemModal = '';

  tempoDecorridoMs = 0;
  tarefaSelecionadaId = '';
  registroPendente = '';

  tarefas: TarefaModel[] = [];

  atalhosRodape: AtalhoRodape[] = [
    { label: 'Tarefas', icon: 'checkmark-circle-outline', rota: '/tarefas' },
    { label: 'Comunidades', icon: 'people-outline', rota: '/comunidades' },
    { label: 'Timer', icon: 'timer-outline', rota: '/timer', ativo: true },
    { label: 'Usuario', icon: 'person-outline', rota: '/usuario' },
  ];

  private intervaloCronometroId: number | null = null;
  private inicioExecucaoMs = 0;

  constructor(
    private readonly router: Router,
    private readonly tarefasService: TarefasService,
    private readonly usuarioService: UsuarioService,
  ) {
    addIcons({
      checkmarkCircleOutline,
      closeOutline,
      hourglassOutline,
      pauseOutline,
      peopleOutline,
      personOutline,
      playOutline,
      stopOutline,
      timerOutline,
    });
  }

  ionViewWillEnter(): void {
    this.carregarTarefasUsuario();
  }

  ngOnDestroy(): void {
    this.pararIntervalo();
  }

  get tempoExibidoCronometro(): string {
    const centesimos = Math.floor(this.tempoDecorridoMs / 10) % 100;
    const totalSegundos = Math.floor(this.tempoDecorridoMs / 1000);
    const segundos = totalSegundos % 60;
    const minutos = Math.floor(totalSegundos / 60);

    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}.${String(centesimos).padStart(2, '0')}`;
  }

  get mostrarAcoesPausa(): boolean {
    return !this.rodando && this.tempoDecorridoMs > 0;
  }

  selecionarAba(aba: AbaTimer): void {
    if (this.abaAtual === aba) {
      return;
    }

    this.abaAtual = aba;

    if (aba === 'timer') {
      this.pararIntervalo();
      this.rodando = false;
    }
  }

  iniciarCronometro(): void {
    if (this.rodando) {
      return;
    }

    this.mensagemAcao = '';
    this.inicioExecucaoMs = Date.now() - this.tempoDecorridoMs;
    this.intervaloCronometroId = window.setInterval(() => {
      this.tempoDecorridoMs = Date.now() - this.inicioExecucaoMs;
    }, 10);
    this.rodando = true;
  }

  pausarCronometro(): void {
    if (!this.rodando) {
      return;
    }

    this.pararIntervalo();
    this.rodando = false;
  }

  retomarCronometro(): void {
    this.iniciarCronometro();
  }

  pararCronometro(): void {
    if (this.tempoDecorridoMs === 0) {
      return;
    }

    this.pausarCronometro();
    this.registroPendente = this.gerarRegistro();
    this.mensagemModal = '';
    this.tarefaSelecionadaId = '';
    this.modalSalvarAberto = true;
  }

  descartarRegistro(): void {
    this.fecharModalSalvar();
    this.resetarCronometro();
  }

  fecharModalSalvar(): void {
    this.modalSalvarAberto = false;
    this.mensagemModal = '';
  }

  salvarRegistro(): void {
    if (!this.tarefaSelecionadaId) {
      this.mensagemModal = 'Selecione uma tarefa para salvar o registro.';
      return;
    }

    const usuarioAtual = this.usuarioService.obterUsuarioSessao();
    if (!usuarioAtual?.id) {
      this.mensagemAcao = 'Voce precisa estar logado para salvar registro.';
      this.router.navigate(['/login']);
      return;
    }

    const tarefaSelecionada = this.tarefas.find((tarefa) => tarefa.id === this.tarefaSelecionadaId);
    if (!tarefaSelecionada) {
      this.mensagemModal = 'A tarefa selecionada nao foi encontrada.';
      return;
    }

    const historicoAnterior = String(tarefaSelecionada.tempoExecucao ?? '').trim();
    const novoHistorico = historicoAnterior
      ? `${historicoAnterior}\n${this.registroPendente}`
      : this.registroPendente;

    const payload: Partial<TarefaModel> = {
      ...tarefaSelecionada,
      usuarioId: Number(usuarioAtual.id) as unknown as string,
      tempoExecucao: novoHistorico,
    };

    this.tarefasService.atualizar(tarefaSelecionada.id, payload).subscribe({
      next: () => {
        this.mensagemAcao = `Registro salvo em ${tarefaSelecionada.titulo}.`;
        this.fecharModalSalvar();
        this.resetarCronometro();
        this.carregarTarefasUsuario();
      },
      error: () => {
        this.mensagemModal = 'Nao foi possivel salvar o registro agora.';
      },
    });
  }

  abrirAtalho(atalho: AtalhoRodape): void {
    if (atalho.ativo) {
      return;
    }

    if (atalho.rota) {
      this.router.navigate([atalho.rota]);
      return;
    }

    this.mensagemAcao = `${atalho.label} ainda sera ligado ao backend.`;
  }

  private carregarTarefasUsuario(): void {
    const usuarioAtual = this.usuarioService.obterUsuarioSessao();

    if (!usuarioAtual?.id) {
      this.tarefas = [];
      this.mensagemAcao = 'Voce precisa estar logado para usar o cronometro.';
      this.router.navigate(['/login']);
      return;
    }

    this.tarefasService.buscarTarefasUsuario(usuarioAtual.id).subscribe({
      next: (tarefas) => {
        this.tarefas = tarefas.filter((tarefa) => !tarefa.concluida);
      },
      error: () => {
        this.tarefas = [];
        this.mensagemAcao = 'Nao foi possivel carregar suas tarefas.';
      },
    });
  }

  private pararIntervalo(): void {
    if (this.intervaloCronometroId !== null) {
      window.clearInterval(this.intervaloCronometroId);
      this.intervaloCronometroId = null;
    }
  }

  private resetarCronometro(): void {
    this.pararIntervalo();
    this.rodando = false;
    this.tempoDecorridoMs = 0;
    this.registroPendente = '';
  }

  private gerarRegistro(): string {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = String(agora.getFullYear());
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    const segundo = String(agora.getSeconds()).padStart(2, '0');

    const totalSegundos = Math.floor(this.tempoDecorridoMs / 1000);
    const duracaoHoras = Math.floor(totalSegundos / 3600);
    const duracaoMinutos = Math.floor((totalSegundos % 3600) / 60);
    const duracaoSegundos = totalSegundos % 60;

    const duracao = `${String(duracaoHoras).padStart(2, '0')}:${String(duracaoMinutos).padStart(2, '0')}:${String(duracaoSegundos).padStart(2, '0')}`;

    return `[${dia}/${mes}/${ano}] ${hora}:${minuto}:${segundo} - duracao ${duracao}`;
  }
}
