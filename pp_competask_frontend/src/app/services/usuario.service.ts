import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UsuarioModel } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private readonly API_URL = 'http://localhost:8080/api/v1/usuarios';

  constructor(private http: HttpClient){ }

  inicializar() {
    if (!localStorage['usuarios']) {
      let usuarios: UsuarioModel[] = [
        { id: new Date().toISOString(), nome: 'vitor', email: 'vitor@email.com', senha: '123456', diasStreak: 5, foto: 'assets/vitor.webp' },
        { id: new Date().toISOString(), nome: 'pereira', email: 'pereira@email.com', senha: '123456', diasStreak: 12, foto: 'assets/pereira.webp' },
        { id: new Date().toISOString(), nome: 'balbino', email: 'balbino@email.com', senha: '123456', diasStreak: 3, foto: 'assets/balbino.webp' },
      ];
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }

  salvar(usuario: UsuarioModel): boolean {
    let usuariosJson = localStorage.getItem('usuarios');
    if (usuariosJson) {
      let usuarios: UsuarioModel[] = JSON.parse(usuariosJson);
      for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].id === usuario.id) {
          return false;
        }
      }
      usuario.diasStreak = 0;
      usuario.id = new Date().toISOString();
      usuarios.push(usuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      return true;
    }
    return false;
  }

  // salvar(usuario: UsuarioModel): Observable<UsuarioModel> {
  //   return this.http.post<UsuarioModel>(this.API_URL, usuario);
  // }

  excluirUsuario(id: string): boolean {
    let usuariosJson = localStorage.getItem('usuarios');
    if (usuariosJson) {
      let usuarios: UsuarioModel[] = JSON.parse(usuariosJson);
      const aux = usuarios.findIndex(usuarios => usuarios.id === id);
      if (aux === -1) {
        return false;
      }
      usuarios.splice(aux, 1);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      this.excluirSessao();
      return true;
    }
    return false;
  }

  validar(usuario: UsuarioModel): boolean {
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    return usuarios.some((u: UsuarioModel) => u.email === usuario.email && u.senha === usuario.senha);
  }

  salvarSessao(usuario: UsuarioModel) {
    if (!localStorage.getItem('usuarioSessao')) {
      localStorage.setItem('usuarioSessao', JSON.stringify({}));
    }
    localStorage.setItem('usuarioSessao', JSON.stringify(usuario));

    // this.usuarioAtual = usuario;
  }

  excluirSessao() {
    localStorage.removeItem('usuarioSessao');
  }

  obterUsuarioSessao() {
    const json = localStorage.getItem('usuarioSessao');
    if (!json) return null;
    try {
      return JSON.parse(json) as UsuarioModel;
    } catch {
      return null;
    }
  }

  obterUsuarioPorId(id: string) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    return usuarios.find((u: UsuarioModel) => u.id === id) || null;
  }

  obterUsuarioPorEmail(email: string) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    return usuarios.find((u: UsuarioModel) => u.email === email) || null;
  }

  atualizarUsuarioLocal(usuario: UsuarioModel): UsuarioModel | null {
    const usuariosJson = localStorage.getItem('usuarios');
    if (!usuariosJson) {
      return null;
    } 

    const usuarios: UsuarioModel[] = JSON.parse(usuariosJson);

    const existente = usuarios.find(u => u.id === usuario.id);
    if (!existente) {
      return null;
    }

    existente.nome = String(usuario.nome ?? existente.nome);
    existente.email = String(usuario.email ?? existente.email);

    if (usuario.senha) {
      existente.senha = String(usuario.senha);
    }

    if (usuario.foto !== undefined && usuario.foto !== '') {
      existente.foto = String(usuario.foto);
    }

    if (usuario.diasStreak !== undefined) {
      existente.diasStreak = Number(usuario.diasStreak);
    }

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.salvarSessao(existente);

    return existente;
  }


}
