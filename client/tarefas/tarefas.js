import {Tarefas} from "../../lib/collections";

if (Meteor.isServer) {
    Tarefas._ensureIndex({nome: 1});
}

Template.tarefas.helpers({

    // tarefas: function(){
    //     return [
    //         {nome : "Estudar Meteor"},
    //         {nome : "Jantar"},
    //         {nome : "Estudar Inglês"},
    //         {nome : "Ler o livro Inteligencia Emocional"},
    //     ];      
    // }

    tarefas() {
        let tarefas = Tarefas.find({}, {sort: {ativo: 'ASC', nome: 1, }})
        if (tarefas) {
            return tarefas;
        }
    }

    // tarefas(){
    //     return Tarefas.find({});
    // }
});


// Types of alert style> (primary, secondary, success, danger, warning, info, light, dark)
Template.adicionar.events({
    'submit .add-form': function () {
        event.preventDefault();
        const target = event.target;
        const nome = target.nome.value;

        $(".alert").removeClass(function (index, className) {
            return (className.match(/(^|\s)alert-\S+/g) || []).join(' ');
        });

        if (nome.length > 0) {
            Tarefas.insert({
                nome,
                ativo: true,
                data: new Date()
            })
            target.nome.value = ""
            $('.alert').addClass('alert-success').show().text('Tarefa adicionada com sucesso.')
        } else {
            $('.alert').addClass('alert-warning').show().text('Informe o nome da tarefa')
        }

        setTimeout(function () {
            $('.alert').hide()
        }, 5200)
        return false;
    }
});

Template.tarefas.events({
    'click .excluir-tarefa': function () {

        var tarefa_id = this._id;
        $('.modal-title').text('Excluir Tarefa')
        $('.modal-body').text('Deseja realmente excluir essa Tarefa?')

        $('#modal').modal('show');

        $('#modal .btn-primary').on('click', function () {
            $('#modal').modal('hide');
            Tarefas.remove(tarefa_id);
            $('.alert').addClass('alert-info').show().text('Tarefa removida com sucesso')
        })
        return false;
    },
    'click td.tarefa-nome': function () {
        $('span.' + this._id).hide()
        $('input.' + this._id).show()
        $('.aplicar-alteracao-tarefa.' + this._id).show()
        $('.cancelar_' + this._id).show()
        $('#excluir_'+this._id).show()
    },
    'click .aplicar-alteracao-tarefa': function (event) {
        const nome = $('input.' + this._id).val();
        if (nome.length > 0) {
            Tarefas.update({_id: this._id}, {$set: {nome: nome, ativo: true}})
            $('span.' + this._id).show()
            $('input.' + this._id).hide()
            $('.aplicar-alteracao-tarefa.' + this._id).hide()
            $('.cancelar_' + this._id).hide()
            $('#excluir_'+this._id).hide()
            $('.alert').addClass('alert-success').show().text('Tarefa alterada com sucesso.')
        } else {
            $('.alert').addClass('alert-warning').show().text('Informe o nome da tarefa')
        }
        return false;
    },
    'keypress .tarefa-nome input.form-control': function (event, template) {
        if (event.which === 13) {
            $('.aplicar-alteracao-tarefa.' + this._id).click()
        }
    },
    'click .btnCancelar': function () {
        $('span.' + this._id).show()
        $('input.' + this._id).hide()
        $('.aplicar-alteracao-tarefa.' + this._id).hide()
        $('.cancelar_' + this._id).hide()
        $('#excluir_'+this._id).hide()
    },
    'click .feito-tarefa': function () {
        var isAtivo = Tarefas.findOne({_id: this._id}).ativo
        Tarefas.update({_id: this._id}, {$set: {ativo: !isAtivo}})
        $('.alert').addClass('alert-success').show().text('Status alterado com sucesso.')
    },
});




