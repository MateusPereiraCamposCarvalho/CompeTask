import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { UsuarioService } from 'src/app/services/usuario.service';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, personOutline, cameraOutline } from 'ionicons/icons';
import { UsuarioModel } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonIcon, IonButton],
})
export class CadastroPage {

  cadastroForm: FormGroup;
  fotoPreview: string | null = null;

  senhaVisivel = false;

  constructor(private readonly formBuilder: FormBuilder, private readonly router: Router, private usuarioService: UsuarioService) {
    this.cadastroForm = this.formBuilder.group({
      'nome': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'senha': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'foto': ['']
    });

    addIcons({
          'mail-outline': mailOutline,
          'lock-closed-outline': lockClosedOutline,
          'eye-outline': eyeOutline,
          'eye-off-outline': eyeOffOutline,
          'person-outline': personOutline,
          'camera-outline': cameraOutline
        }); 
  }

  cadastrar(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    // this.usuarioService.salvar(this.cadastroForm.value).subscribe({
    //   next: (resultado: UsuarioModel) => {
    //     this.router.navigate(['/login']);
    //   },
    //   error: (erro) => {
    //     console.log(erro);
    //    this.router.navigate(['/usuario']);
    //   }
    // });

    let salvo = this.usuarioService.salvar(this.cadastroForm.value);
    if (!salvo) {
      this.cadastroForm.get('email')?.setErrors({ emailEmUso: true });
      this.cadastroForm.get('email')?.markAsTouched();
      return;
    }
    this.router.navigate(['/login']);
  }

  ngOnInit(){
    this.usuarioService.inicializar();
  }

  ionViewWillEnter(){
    this.cadastroForm.reset();
    this.fotoPreview = null;
    this.cadastroForm.markAsPristine(); // indica que o formulário não foi modificado desde seu estado inicial — remove o estado dirty que poderia disparar validações visuais.
    this.cadastroForm.markAsUntouched(); //marca todos os controles como não tocados — remove o estado touched para que mensagens de erro baseadas em toque não apareçam imediatamente.
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }

  alternarSenhaVisibilidade(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }

  selecionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files && input.files.length > 0 ? input.files[0] : null;

    if (!arquivo) {
      this.fotoPreview = null;
      this.cadastroForm.patchValue({ foto: '' });
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      const fotoBase64 = String(leitor.result || '');
      this.fotoPreview = fotoBase64;
      this.cadastroForm.patchValue({ foto: fotoBase64 });
    };

    leitor.readAsDataURL(arquivo);
  }
}
