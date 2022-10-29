import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  myScriptElement: HTMLScriptElement;
  form: FormGroup;
  formR: FormGroup;

  constructor(private formBuilder: FormBuilder){
  }
  ngOnInit(): void {
    this.buildForm();
    this.buildFormR();
    this.myScriptElement = document.createElement("script");
    this.myScriptElement.src = "../../../assets/js/login.js";
    document.body.appendChild(this.myScriptElement);
  }


  private buildForm(): any {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
        });
  }

  private buildFormR(): any {
    this.form = this.formBuilder.group({
      user: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordr: ['', [Validators.required, Validators.minLength(6)]],
        });
  }
 
  login(event: Event): any {
    event.preventDefault();
    if (this.form.valid) {
      const value = this.form.value;
      console.log(`'%c'USER: ${value.email} - PASSWORD: ${value.password}`, 'background: #222; color: #bada55');
    }
    window.location.href = 'pago';
  }

  registro(event: Event): any {
    event.preventDefault();
    if (this.formR.valid) {
      const value = this.formR.value;
      console.log(`'%c'USER: ${value.email} - PASSWORD: ${value.password}`, 'background: #222; color: #bada55');
    }
  }

}
