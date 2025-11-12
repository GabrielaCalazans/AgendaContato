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
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isEmailUnique(email: string): boolean {
    return !this.contatos.some(c => c.email === email);
}

  private isValidDate(value: string): boolean {
    if (!value) return false;
    const d = new Date(value);
    return !isNaN(d.getTime());
  }

  private isValidTime(value: string): boolean {
    if (!value) return false;
    const d = new Date(value);
    if (!isNaN(d.getTime())) return true;
    return /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(value);
  }
  
  
  async salvarContato() {
    const nome = (this.novoContato.nome || '').trim();
    const email = (this.novoContato.email || '').trim();
    const telefone = (this.novoContato.telefone || '').trim();
    const nascimento = (this.novoContato.nascimento || '').trim();
    const horaContato = (this.novoContato.horaContato || '').trim();

    if (!nome || !email || !telefone || !nascimento || !horaContato) {
      await this.presentAlert('Todos os campos são obrigatórios: nome, e-mail, telefone, data de nascimento e horário para contato.', 'Erro');
      return;
    }

    if (!this.isValidNome(nome)) {
      await this.presentAlert('Nome inválido. Use apenas letras e espaços.', 'Erro');
      return;
    }

    if (!this.isValidEmail(email)) {
      await this.presentAlert('Email inválido. Deve ter o formato local@dominio.ext (ex: user@example.com)', 'Erro');
      return;
    }

    if (!this.containsAt(email)) {
      await this.presentAlert('Email inválido. Deve ter o formato local@dominio.ext (ex: user@example.com)', 'Erro');
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

        if (!this.isValidDate(nascimento)) {
      await this.presentAlert('Data de nascimento inválida. Selecione uma data válida.', 'Erro');
      return;
    }

    if (!this.isValidTime(horaContato)) {
      await this.presentAlert('Horário para contato inválido. Use o seletor de horário ou formato HH:mm.', 'Erro');
      return;
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