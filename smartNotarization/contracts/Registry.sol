pragma solidity >=0.4.22 <0.9.0;

contract Registry {

  	// Identificador
  	address[] public registers;


  	struct Document {
    	// Hash do documento
    	string hashDocumento;
    	// Hash metadados
    	string hashMetadados;
    	// Usado para verificar so para a verificacao da existencia
    	bool exists;
  	}

  	mapping (string => Document) public notarizations;
  	uint public notarizationsCount;


  	//eventos teste
  	event addRegister(
  		address reg
  	);

  	event addNotarization(
    	string hashDocumento,
    	string hashMetadados,
    	bool exists
  	);

  	event transProperty(
  		string prop
  	);


  	// The smart contract's constructor
  	constructor() public {

  	}

  	// Verificar se um documento se encontra notarizado
  	function isNotarized(string memory hash) public view returns (bool res){
  		return notarizations[hash].exists;
  	}


  	// Verificar se é um register
  	function isRegister(address addr) public view returns (bool res) {
  		res = false;
  		for (uint i = 0; i < registers.length; i++) {
  			if (registers[i] == addr) {
  				res = true;
          break;
        }
      }
      return res;
  	}

    function numRegisters() public view returns (uint num){
      return registers.length;
    }

  	// Adicionar um novo register
  	function adicionarRegister(address reg) public{
  		require(!isRegister(reg), "Sender is already registered!!!");
  		registers.push(reg);
  		emit addRegister(reg);
  	}


  	// Adicionar um novo documento notarizado
  	function adicionarNotarization(string memory hmetadata, string memory hash) public {
        require(!notarizations[hash].exists, "Document already exists");

		notarizationsCount++;
        notarizations[hash] = Document(hash,hmetadata,true);
        emit addNotarization(hash,hmetadata,true);
  	}


  	// Transferencia de propriedade de um documento(alteracao dos metadados)
  	function transferirPropriedade(string memory hmetadata, string memory hash) public {
  		require(notarizations[hash].exists == true, "Document does not exists");

  		notarizations[hash].hashMetadados = hmetadata;
  		emit transProperty(hash);
  	}


  	// Obter o numero de registadores de documentos registados
    function getRegistersLength() public view returns (uint count) {
        require(isRegister(msg.sender) == true, "Sender not authorized.");
        return registers.length;
    }


  	// Ver melhor!!
  	function calculateHash(string memory s) public pure returns (bytes32 res) {
  		return keccak256(abi.encodePacked(s));
  	}


    // Função que retorna o hash dos metadados de um determinado documento
    function getHMetadata(string memory hashDoc) public view returns (string memory hmetadata){
      require(notarizations[hashDoc].exists, "Documen t does not exist");
      return notarizations[hashDoc].hashMetadados;
    }

}
