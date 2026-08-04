package br.cefetmg.pp_competask.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class TarefaTempoExecucaoPatchDTO {

    @NotBlank
    private String tempoExecucao;
}
