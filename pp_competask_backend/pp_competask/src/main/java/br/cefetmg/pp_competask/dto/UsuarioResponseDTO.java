package br.cefetmg.pp_competask.dto;

import br.cefetmg.pp_competask.model.Usuario;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class UsuarioResponseDTO {
    private Long idUsuario;
    private String nome;
    private String email;
    private String foto;
    private Integer streak;

    public UsuarioResponseDTO(Usuario usuario){
        this.idUsuario = usuario.getIdUsuario();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.foto = usuario.getFoto();
        this.streak = usuario.getStreak();
    }
}
