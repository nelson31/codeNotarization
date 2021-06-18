# Código do Projeto de LEI
BlockChain para Notarização de Documentos

**Este repositório encontra-se organizado da seguinte forma:**

- :open_file_folder: **Diretoria [smartNotarization](https://github.com/nelson31/codeNotarization/tree/master/smartNotarization)** que possui todos os Ficheiros e Diretorias para a migração e testagem dos *smart contracts*
- :bookmark_tabs: Ficheiro [modeloLogicoBD_offchain.mwb](https://github.com/nelson31/codeNotarization/blob/master/modeloLogicoBD_offchain.mwb) que contém o modelo lógico da Base de Dados SQL que pode ser aberto com o *MySQL Workbench*
- :open_file_folder: **Diretoria [codeNotarization](https://github.com/nelson31/codeNotarization/tree/master/codeNotarization)** que possui todos os Ficheiros e Diretorias da aplicação, tanto o FrontEnd como o Backend
  - :open_file_folder: **Diretoria [ClientApp](https://github.com/nelson31/codeNotarization/tree/master/codeNotarization/ClientApp)** que possui todos os Ficheiros e Diretorias necessárias ao FrontEnd da aplicação
  - :open_file_folder: **Diretoria [Backend](https://github.com/nelson31/codeNotarization/tree/master/codeNotarization/Backend)** que possui parte dos Ficheiros e Diretorias necessárias ao BackEnd da aplicação, principalmente os DAOs (*Data Access Objects*) para acesso à Base de Dados
- :bookmark_tabs: Ficheiro [codeNotarization.sln](https://github.com/nelson31/codeNotarization/blob/master/codeNotarization.sln) que pode ser ser aberto usando Visual Studio 2019, sendo que irá automáticamente abrir e configurar todo o projeto

<br/>

## Configuração da aplicação

Nesta secção, a nossa preocupação passar por informar como poderá, qualquer leitor deste documento, configurar a nossa aplicação e deixa-la pronta a correr/ser testada na sua própria máquina.

Em primeiro lugar deixamos algumas das aplicações das quais o software desenvolvido por nós depende:

 - **_Visual studio_** - <https://visualstudio.microsoft.com/pt-br/downloads/>
 - **_Metamask_** - <https://metamask.io/download>
 - **_Ganache_** - <https://www.trufflesuite.com/ganache>
 - **_MySQL_** - <https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/>
 - **_MySQL Workbench_** - <https://dev.mysql.com/doc/workbench/en/wb-installing-windows.html>
 - **_Truffle_** - <https://www.trufflesuite.com/docs/truffle/getting-started/installation>
 
Depois de termos tudo devidamente instalado, podemos dar início à execução da aplicação, tendo em atenção que o Ganache deve ter os contratos migrados através do uso do truffle ($ truffle migrate) e a correr no localhost:8545 e os respetivos contratos JSON gerados na pasta [build/contracts](https://github.com/nelson31/codeNotarization/tree/master/smartNotarization/build/contracts) devem estar também na pasta [abis](https://github.com/nelson31/codeNotarization/tree/master/codeNotarization/ClientApp/src/abis).

Além disso, é importante que a Base de Dados esteja desenvolvida, pelo que se usar o MySQL WorkBench é só pegar no [modelo lógico](https://github.com/nelson31/codeNotarization/blob/master/modeloLogicoBD_offchain.mwb) e fazer *Forward Engeneering* que este já gera a base de dados.

Depois, ao correr no Visual Studio 2019, este deverá só na linha de comandos pedir a password do MySQL e depois de inserida a aplicação já deverá estar operacional.

Nota para o facto de que enquanto se executa a aplicação, o **Ganache** deve estar sempre a correr, além disso para ser possível criar uma conta e fazer login necessita de ter o plugin **Metamask** com uma conta válida que pertença ao **Ganache**, bastando para isso fazer import de uma conta através da chave privada de uma conta do **Ganache**.

