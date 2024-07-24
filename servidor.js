const mysqli = require('mysql')

exports.conectaSQl = function(){
    const conexao =  mysqli.createPool({
        host: 'localhost',
        port: 3308,
        user:'root',
        password : '',
        database: 'testesigna',
    });
}



function connection() {

    var db = require('postgresql-query');

    db.config({
        username: 'TESTE',
       host: 'localhost',
        port: 3308,
        user:'root',
        password : '',
        database: 'testesigna',
    });

    return db;
}

exports.verificarUsuario = function(usuario, id_user_type) {

	var conexao = connection();

	

		var sql = "SELECT * FROM administrativo.users WHERE usuario = $1";
		var values = [
			[usuario]
		];
		
		conexao.query(sql, [values], function (erro, resultado) {
			if(erro)console.log(erro);

            var dados = resultado[0];
			console.log("Número de linhas inseridas: " +  dados);
            if(dados.id_user_type === 1){
                console.log(dados.usuario)
                return true;
                /*if(dados.token === token){
                    console.log('Autenticado com sucesso!');
                    return true;
                }else{
                    console.log("Falha no sistema.");
                    return false;
                }*/
            }else{
                console.log("Falha no sistema.");
                return false;
            }
		})
}
