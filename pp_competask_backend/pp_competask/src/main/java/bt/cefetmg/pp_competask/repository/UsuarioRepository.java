package bt.cefetmg.pp_competask.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import bt.cefetmg.pp_competask.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository <Usuario, Long> {

}
