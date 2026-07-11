package br.cefetmg.pp_competask.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AutentificacaoRequestDTO {
    
    @NotBlank
    private String email;

    @NotBlank
    private String senha;
}
