import React, { Component } from 'react';
import $ from 'jquery';
import InputCustom from './componentes/InputCustom.js';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';


class FormularioLivro extends Component {
  // Guarda a lista do JSON
  constructor() {
    super();
    this.state = {titulo:'', preco:'', autorId:''};
    this.enviaForm = this.enviaForm.bind(this);
    this.setTitulo = this.setTitulo.bind(this);
    this.setPreco = this.setPreco.bind(this);
    this.setAutorId = this.setAutorId.bind(this);
    // O bind a cima é por que o this não está definido.
  }
    // Evento do react
    // O evento.preventDefault evita que a página seja recarregada em uma ação do botão
    enviaForm(evento){
      evento.preventDefault();
      // Enviar os dados 
      $.ajax({
        url:"http://localhost:8080/api/livros",
        contentType: 'application/json',
        dataType: 'json',
        type:'post',
        // No metodo normal pegariamos o value do input. Por ser React utilizamos this.state. E depois declara no construtor onde guarda a lista com o JSON. Lembrar de incluir o .bind(this).
        data: JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
        success: function(novaListagem){
          PubSub.publish('atualiza-lista-livros',novaListagem);
          this.setState({titulo:'',preco:'',autorId:''}); //Limpar o form
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
    setTitulo(evento) {
      this.setState({titulo:evento.target.value});
    }
    setPreco(evento){
      this.setState({preco:evento.target.value});
    }
    setAutorId(evento){
      this.setState({autorId:evento.target.value})
    }
    
    // Para trazer a lista de autores da api 
    // utiliza a função que esta dentro do option

    // {this.state.autorId} esse estado dentro do select limpa o campo após o botão submeter

    render () {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustom id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Titulo"/>                                              
                    <InputCustom id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preço"/>                                              
                    <div className="pure-control-group">
                      <label htmlFor="autorId">Autor</label>
                      <select value={this.state.autorId} name="autorId" id="autorId" onChange={this.setAutorId}>
                        <option value="">Selecione o autor</option>
                        {
                          this.props.autores.map(function(autor){
                            return <option value={autor.id}>{autor.nome}</option>
                          })
                        }
                      </select>
                    </div>

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
// TABELA DE LIVROS 
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
class TabelaLivros extends Component {
    render() {
      return(
        <div>            
          <table className="pure-table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Preço</th>
                <th>Autor</th>
              </tr>
            </thead>
              <tbody>
              {
                this.props.lista.map(function(livro){
                  return (
                  <tr key={livro.id}>
                  <td>{livro.titulo}</td>
                  <td>{livro.preco}</td>
                  <td>{livro.autor.nome}</td>
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

export default class LivroBox extends Component {
    // Guarda a lista do JSON
    constructor() {
      super();
      this.state = {lista : [],autores:[]};
    }
    // O bind a cima é por que o this não está definido.
    // Setando o local do JSON
    componentDidMount(){
      // console.log("didMount");
      $.ajax({
        url:"http://localhost:8080/api/livros",
        dataType: 'json',
        success:function(resposta){    
        // console.log("chegou a resposta");          
        this.setState({lista:resposta});
        }.bind(this)
      }); 
      $.ajax({
        url:"http://localhost:8080/api/autores",
        dataType: 'json',
        success:function(resposta){    
        // console.log("chegou a resposta");          
        this.setState({autores:resposta});
        }.bind(this)
      }); 
      PubSub.subscribe('atualiza-lista-livros',function(topico,novaLista){
        this.setState({lista:novaLista});
      }.bind(this));         
    }

    render () {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}