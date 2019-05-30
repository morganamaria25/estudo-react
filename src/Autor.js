import React, { Component } from 'react';
import $ from 'jquery';
import InputCustom from './componentes/InputCustom.js';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';



class FormularioAutor extends Component {
  // Guarda a lista do JSON
  constructor() {
    super();
    this.state = {nome:'', email:'', senha:''};
    this.enviaForm = this.enviaForm.bind(this);
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
    // O bind a cima é por que o this não está definido.
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
        success: function(novaListagem){
          PubSub.publish('atualiza-lista-autores',novaListagem);
          this.setState({nome:'',email:'',senha:''}); //Limpar o form
        }.bind(this),
        error: function(resposta){
          if(resposta.status === 400) {
            new TratadorErros().publicaErros(resposta.responseJSON);
          }
        },
        beforeSend: function() {
          PubSub.publish("limpa-erros",{});
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
        );
    }
}

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// TABELA DE AUTORES 
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 class TabelaAutores extends Component {
  render() {
    return(
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
              this.props.lista.map(function(autor){
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
      );
    }
  }

  export default class AutorBox extends Component {
      // Guarda a lista do JSON
      constructor() {
        super();
        this.state = {lista : []};
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
        }); 
        PubSub.subscribe('atualiza-lista-autores',function(topico,novaLista){
          this.setState({lista:novaLista});
        }.bind(this));         
      }
          
    render(){
      return (
        <div>
          <div className="header">
            <h1>Cadastro de autores</h1>
          </div>
          <div className="content" id="content">
            <FormularioAutor/>
            <TabelaAutores lista={this.state.lista}/>
          </div>
        </div>
      );
    }
  }
  