import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import $ from 'jquery';
import InputCustom from './componentes/InputCustom.js';


// Guarda a lista do JSON
class App extends Component {
  constructor() {
    super();
    this.state = {lista : [], nome:'', email:'', senha:''};
    this.enviaForm = this.enviaForm.bind(this);
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
  }

// O bind a cima é por que o this não está definido.

// Setando o local do JSON
  componentDidMount(){
    // console.log("didMount");
    $.ajax({
        url:"http://localhost:8080/api/autores",
        dataType: 'json',
        success:function(resposta){    
          // console.log("chegou a resposta");          
          this.setState({lista:resposta});
        }.bind(this)
      } 
    );          
  }
  // Evento do react
  // O evento.preventDefault evita que a página seja recarregada em uma ação do botão
  enviaForm(evento){
    evento.preventDefault();
    // Enviar os dados 
    $.ajax({
      url:"http://localhost:8080/api/autores",
      contentType: 'application/json',
      dataType: 'json',
      type:'post',
      // No metodo normal pegariamos o value do input. Por ser React utilizamos this.state. E depois declara no construtor onde guarda a lista com o JSON. Lembrar de incluir o .bind(this).
      data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
      success: function(resposta){
        this.setState({lista:resposta});
      }.bind(this),
      error: function(resposta){
        console.log("Erro");
      }
    });
  }

  // Para pegar informação dos inputs

  setNome(evento) {
    this.setState({nome:evento.target.value});
  }
  setEmail(evento){
    this.setState({email:evento.target.value});
  }
  setSenha(evento){
    this.setState({senha:evento.target.value})
  }

  render () {
    return (
      <div id="layout">
        {/* <!-- Menu toggle --> */}
        <a href="#menu" id="menuLink" className="menu-link">
            {/* <!-- Hamburger icon --> */}
            <span></span>
        </a>

        <div id="menu">
            <div className="pure-menu">
                <a className="pure-menu-heading" href="#">Company</a>

                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livro</a></li>
                </ul>
            </div>
        </div>

        <div id="main">
          <div className="header">
            <h1>Cadastro de Autores</h1>
          </div>
          <div className="content" id="content">
            <div className="pure-form pure-form-aligned">
              <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                <InputCustom id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome"/>                                              
                <InputCustom id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email"/>                                              
                <InputCustom id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha"/>                                                                       
                <div className="pure-control-group">                                  
                  <label></label> 
                  <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                </div>
              </form>             

            </div>  
            <div>            
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.lista.map(function(autor){
                      return (
                        <tr key={autor.id}>
                          <td>{autor.nome}</td>
                          <td>{autor.email}</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table> 
            </div>             
          </div>
        </div>            
      </div>     
    );
  }
}

export default App;
