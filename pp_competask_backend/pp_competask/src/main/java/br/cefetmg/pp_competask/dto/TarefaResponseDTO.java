package br.cefetmg.pp_competask.dto;

import br.cefetmg.pp_competask.model.Tarefa;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TarefaResponseDTO {

    private Long id;
    private Long usuarioId;
    private String titulo;
    private String descricao;
    private int prioridade;
    private String dataRealizacao;
    private String lembreteData;
    private String lembreteHora;
    private String tempoExecucao;
    private boolean concluida;
    private String dataConfeccao;
    // private String atualizadaEm;

    public TarefaResponseDTO(Tarefa tarefa){
        this.id = tarefa.getIdTarefa();
        this.usuarioId = tarefa.getUsuario().getIdUsuario();
        this.titulo = tarefa.getTitulo();
        this.descricao = tarefa.getDescricao();
        this.prioridade = tarefa.getPrioridade();
        this.dataRealizacao = tarefa.getDataRealizacao();
        this.lembreteData = tarefa.getLembreteData();
        this.lembreteHora = tarefa.getLembreteHora();
        this.tempoExecucao = tarefa.getTempoExecucao();
        this.concluida = tarefa.isConcluida();
        this.dataConfeccao = tarefa.getDataConfeccao();
    }
}
