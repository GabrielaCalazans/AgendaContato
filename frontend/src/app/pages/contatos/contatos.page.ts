import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

interface Contato {
  nome: string;
  email: string;
  telefone?: string;
  nascimento?: string;
  horaContato?: string;
}

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.page.html',
  styleUrls: ['./contatos.page.scss'],
  standalone: false,
})
export class ContatosPage {
  contatos: Contato[] = [];
  novoContato = {
    nome: '',
    email: '',
    telefone: '',
    nascimento: '',
    horaContato: ''
  };

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) {}

  private async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success', duration = 2000) {
    const toast = await this.toastCtrl.create({ message, duration, color });
    await toast.present();
  }


  private async presentAlert(message: string, header = 'Aviso') {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private isValidNome(nome: string): boolean {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome.trim());
  }

  private isValidTelefone(telefone: string): boolean {
    return /^\d{10,11}$/.test(telefone);
  }

  private containsAt(email: string): boolean {
    return email.indexOf('@') !== -1;
  }

  private isEmailUnique(email: string): boolean {
    return !this.contatos.some(c => c.email === email);
}
  
  
  async salvarContato() {
    const nome = (this.novoContato.nome || '').trim();
    const email = (this.novoContato.email || '').trim();
    const telefone = (this.novoContato.telefone || '').trim();

    if (!nome || !email) {
      await this.presentAlert('Preencha pelo menos o nome e o e-mail!', 'Erro');
      return;
    }

    if (!this.isValidNome(nome)) {
      await this.presentAlert('Nome inválido. Use apenas letras e espaços.', 'Erro');
      return;
    }

    if (!this.containsAt(email)) {
      await this.presentAlert('Email inválido. Deve conter o caractere "@"', 'Erro');
      return;
    }

    if (!this.isEmailUnique(email)) {
      await this.presentAlert('Email já cadastrado. Use um email diferente.', 'Erro');
      return;
    }

    if (telefone) {
      if (!this.isValidTelefone(telefone)) {
        await this.presentAlert('Telefone inválido. Deve conter apenas números e ter 10 ou 11 dígitos.', 'Erro');
        return;
      }
    }
    this.contatos.push({
      nome,
      email,
      telefone,
      nascimento: this.novoContato.nascimento,
      horaContato: this.novoContato.horaContato
    });
    this.novoContato = { nome: '', email: '', telefone: '', nascimento: '', horaContato: '' };
    await this.presentToast('Contato salvo com sucesso!', 'success');
  }


  async excluirContato(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Contato',
      message: 'Deseja realmente excluir este contato?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: () => {
            this.contatos.splice(index, 1);
          }
        }
      ]
    });
    await alert.present();
  }
}