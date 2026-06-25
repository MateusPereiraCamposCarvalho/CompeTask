package br.cefetmg.pp_competask.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.cefetmg.pp_competask.dto.TarefaRequestDTO;
import br.cefetmg.pp_competask.dto.TarefaResponseDTO;
import br.cefetmg.pp_competask.model.Tarefa;
import br.cefetmg.pp_competask.model.Usuario;
import br.cefetmg.pp_competask.repository.TarefaRepository;
import br.cefetmg.pp_competask.repository.UsuarioRepository;

@Service
public class TarefaService {
    
    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<TarefaResponseDTO> buscarTarefasPorUsuarioId(Long id){
        List<Tarefa> tarefas = tarefaRepository.findAllByUsuarioIdUsuario(id);
        return tarefas.stream().map(TarefaResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public TarefaResponseDTO buscarPorId(Long id){
        Tarefa tarefa = tarefaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Tarefa nao encontrada."));

        return new TarefaResponseDTO(tarefa);
    }

    @Transactional
    public TarefaResponseDTO inserir(TarefaRequestDTO dto){
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
            .orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado. Faca login novamente."));

        Tarefa tarefa = new Tarefa();
        tarefa.setUsuario(usuario);
        tarefa.setTitulo(dto.getTitulo());
        tarefa.setDescricao(dto.getDescricao());
        tarefa.setPrioridade(dto.getPrioridade());
        tarefa.setDataRealizacao(dto.getDataRealizacao());
        tarefa.setLembreteData(dto.getLembreteData());
        tarefa.setLembreteHora(dto.getLembreteHora());
        tarefa.setTempoExecucao(dto.getTempoExecucao());
        tarefa.setConcluida(false);
        tarefa.setDataConfeccao(null);
        
        return new TarefaResponseDTO(tarefaRepository.save(tarefa));
    }

    @Transactional
    public TarefaResponseDTO atualizar(Long id, TarefaRequestDTO dto){
        //ver se existe tarefa com esse id
        Tarefa tarefa = tarefaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Tarefa nao encontrada."));

        tarefa.setTitulo(dto.getTitulo());
        tarefa.setDescricao(dto.getDescricao());
        tarefa.setPrioridade(dto.getPrioridade());
        tarefa.setDataRealizacao(dto.getDataRealizacao());
        tarefa.setLembreteData(dto.getLembreteData());
        tarefa.setLembreteHora(dto.getLembreteHora());
        tarefa.setTempoExecucao(dto.getTempoExecucao());

        if (dto.getConcluida() != null) {
            tarefa.setConcluida(dto.getConcluida());

            if (dto.getConcluida()) {
                tarefa.setDataConfeccao(LocalDate.now().toString());
            } else {
                tarefa.setDataConfeccao(null);
            }
        }

        return new TarefaResponseDTO(tarefaRepository.save(tarefa));
    }

    @Transactional
    public void excluir(Long id){
        //verificar se existe pra ai mandar excluir
        if (!tarefaRepository.existsById(id)) {
            throw new IllegalArgumentException("Tarefa nao encontrada.");
        }

        tarefaRepository.deleteById(id);
    }
}
